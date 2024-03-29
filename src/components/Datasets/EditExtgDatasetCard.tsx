import { observer } from "mobx-react";
import { MapStore, UserCreatedDatasetLayer } from "./MapStore";
import { useEffect, useState } from "react";
import { hdbData } from "../../datasets/hdb_bedok_centroid";
import { preschoolData } from "../../datasets/preschools_bedok";
import { mrtData } from "../../datasets/mrt_bedok_centroid";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore";
import { getToken } from "../../util/security";
import './EditDatasetCard.css'
import { Button } from "flowbite-react";

export const DATASETID_LOOKUP: Record<string, GeoJSON.FeatureCollection<GeoJSON.Geometry>> = {
    "hdb": hdbData,
    "preschools": preschoolData,
    "mrt": mrtData
}

export type NewDatasetType = {
    title: string;
    description: string;
    parentLayerId: string;
    newFeatures: Feature<Geometry, GeoJsonProperties>[];
    deletedFeatures: Feature<Geometry, GeoJsonProperties>[];
}

export type CreateDatasetType = NewDatasetType & {
    userId: string;
}

export type UpdateDatasetType = {
    title: string,
    description: string,
    newFeatures: Feature<Geometry, GeoJsonProperties>[];
    deletedFeatures: Feature<Geometry, GeoJsonProperties>[];
    userId: string
}
 
type EditExtgDatasetCardProps = {
    mapStore: MapStore,
    addSourceLayer: (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>, parentId: string, backendId: string) => void;
    userStore: LoginUserStore,
    cancelDeletedFeatures: () => void,
    disableEditing: () => void,
    deleteLayerSource: (id: string) => void;
    updateLayerSource: (id: string, parentLayerId: string, newData: FeatureCollection<Geometry, GeoJsonProperties>) => void,
    enablePopup: () => void
}

type SaveFormInput = {
    title: string,
    description: string
}

export const EditExtgDatasetCard = observer(({ mapStore, cancelDeletedFeatures, disableEditing, updateLayerSource, enablePopup }: EditExtgDatasetCardProps) : React.JSX.Element => {
    const [updateInput, setUpdateInput] = useState<SaveFormInput>(mapStore.currEditingExtngLayerUpdateInput);   
    const [userId, setUserId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
        setUpdateInput({
            ...updateInput,
            [evt.currentTarget.name]: evt.currentTarget.value
        });
    }

    const clearMap = (): void => {
        cancelDeletedFeatures();
        // clear add changes
        mapStore.setCurrEditingLayer(null);
        mapStore.markers.forEach(marker => marker.remove());
        mapStore.clearCoordsMarkers();

        mapStore.setLayerProps(mapStore.layers.map((layer) => ({
            ...layer,
            isEditing: false,
        })))

        disableEditing();
        enablePopup();
    }

    const prepSrcData = (parentLayerId: string, featuresToConcat?: Feature<Geometry, GeoJsonProperties>[], featuresToRemove?: string[]) :FeatureCollection<Geometry, GeoJsonProperties> | undefined => {

        const currData: FeatureCollection<Geometry, GeoJsonProperties> = DATASETID_LOOKUP[parentLayerId];
        if (currData) {
            let currPointDataFeatures = currData.features;
            let newPointDataFeatures: Feature<Geometry, GeoJsonProperties>[] = [];
            console.log("currData", currPointDataFeatures);
    
            // add new points if any
            if (!featuresToConcat) {
                featuresToConcat = [];
            } 
            // remove deleted points if any
            if (featuresToRemove) {
                // remove points that exist in featuresToRemove arr
                newPointDataFeatures = currPointDataFeatures.filter((feature) => !featuresToRemove.includes(feature.properties?.Name));
                console.log("currData removed", newPointDataFeatures);
            }
            newPointDataFeatures = newPointDataFeatures.concat(featuresToConcat);
            console.log("currData concat", newPointDataFeatures);
    
            const newGeoJsonData = {
                "type": "FeatureCollection",
                "features": newPointDataFeatures
            } as GeoJSON.FeatureCollection<GeoJSON.Geometry>;
    
            return newGeoJsonData;
        }

    }
    
    useEffect(() => {
        const token = getToken();
        const payload = token ? JSON.parse(atob(token.split(".")[1])).payload : null;
        if (payload && payload.userId) {
            setUserId(payload.userId);
        }
    }, []);

    const handleUpdate = async () => {
        setIsLoading(true);

        const token = localStorage.getItem('token'); 
        if (!token) throw new Error('Token not found');

        // process for changes in user edits
        const backendLayerIdx = mapStore.userCreatedBackendLayers.findIndex(layer => layer.layerId === mapStore.currEditingLayer);
        const backendLayerNewFeatures = mapStore.userCreatedBackendLayers[backendLayerIdx].newFeatures;
        let updatedNewFeatures: Feature<Geometry, GeoJsonProperties>[] = backendLayerNewFeatures.concat(mapStore.markersGeoJson);
        const backendLayerDelFeatures = mapStore.userCreatedBackendLayers[backendLayerIdx].deletedFeatures;
        const updatedDeletedFeatures: Feature<Geometry, GeoJsonProperties>[] = backendLayerDelFeatures.concat(mapStore.deletedFeaturesGeoJson);

        const updatedDelNames = updatedDeletedFeatures.map(feature => feature.properties?.Name);
        // remove any features previously added
        updatedNewFeatures = updatedNewFeatures.filter(feature => !updatedDelNames.includes(feature.properties?.Name));

        if (mapStore.currEditingLayer !== null) {
            const datasetData: UpdateDatasetType = {
                ...updateInput,
                userId: userId,
                ...(updatedNewFeatures && { newFeatures: updatedNewFeatures }),
                ...(updatedDeletedFeatures && { deletedFeatures: updatedDeletedFeatures })
            }

            const currEditingLayerObj = mapStore.userCreatedBackendLayers.find(layer => layer.layerId === mapStore.currEditingLayer )
            let currEditingLayerBackendId = "";
            if (currEditingLayerObj) {
                currEditingLayerBackendId = currEditingLayerObj?._id;
            }

            try {

                const res = await fetch(`https://walking-wizard-be.onrender.com/datasets/update/${currEditingLayerBackendId}`, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(datasetData),
                });

                if (res.ok) {
                    const jsonData = await res.json();
                    console.log("update json", jsonData);

                    const layer = mapStore.layers.find(layer => layer.layerId === mapStore.currEditingLayer);
                    let parentLayerId = "";
                    if (layer && layer.parentLayerId) {
                        parentLayerId = layer.parentLayerId;
                    }
                    
                    const newGeoJsonData = prepSrcData(parentLayerId, updatedNewFeatures, updatedDelNames);
                    console.log("newGeoJsonData", newGeoJsonData);
                    if (newGeoJsonData) {
                        // replace source data in map
                        updateLayerSource(mapStore.currEditingLayer, parentLayerId, newGeoJsonData);
                        // update userCreatedDatasetLayers in mapStore
                        const newCreatedBackendLayers = [...mapStore.userCreatedBackendLayers];
                        for (const layer of newCreatedBackendLayers) {
                            if (layer.layerId === mapStore.currEditingLayer) {
                                const updatedLayer: UserCreatedDatasetLayer = {
                                    ...layer,
                                    description: updateInput.description,
                                    layerId: updateInput.title,
                                    newFeatures: updatedNewFeatures,
                                    deletedFeatures: updatedDeletedFeatures,
                                }
                                const idxToUpdate = newCreatedBackendLayers.findIndex(layer => layer.layerId === mapStore.currEditingLayer);
                                newCreatedBackendLayers[idxToUpdate] = updatedLayer;
                            }
                        }
                        mapStore.setUserCreatedBackendLayers(newCreatedBackendLayers);
                    }
                }
                setIsLoading(false);
                // reset form & close card
                setUpdateInput({
                    title: "",
                    description: ""
                });
                clearMap();

            } catch(err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                    Editing: {mapStore.currEditingLayer} Layer
                </h5>
            </a>

            <div id="feature-tracking">
                <p className="mb-3 text-xs font-normal text-gray-700 dark:text-gray-400">
                    {mapStore.markers.length} features added
                </p>
                <p className="mb-3 text-xs font-normal text-gray-700 dark:text-gray-400">
                    {mapStore.deletedFeaturesNum} features deleted
                </p>
            </div>

            <form className="max-w-md mx-auto">
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="title" id="title" value={updateInput.title} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Title" required />
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="description" id="fdescription" value={updateInput.description} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Description" required />
                </div>
            </form>

            <div className="flex mt-4 md:mt-6">
                {
                    isLoading 
                    ?
                    <Button className="bg-blue-700 focus:outline-none focus:ring-blue-300" isProcessing>
                        <span className="pl-3">Loading...</span>
                    </Button>
                    :
                    <button id="login-save" onClick={() => handleUpdate()} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                        Update
                    </button>                 
                }
                <button onClick={() => clearMap()} className="py-2 px-4 ms-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Cancel
                </button>
            </div>

        </div>
    )
})