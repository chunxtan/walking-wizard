import { observer } from "mobx-react";
import { MapStore, FeatureId } from "./MapStore";
import { useEffect, useState } from "react";
import { hdbData } from "../../datasets/hdb_bedok_centroid";
import { preschoolData } from "../../datasets/preschools_bedok";
import { mrtData } from "../../datasets/mrt_bedok_centroid";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore";
import { getToken } from "../../util/security";
import './EditDatasetCard.css'

export const DATASETID_LOOKUP: Record<string, GeoJSON.FeatureCollection<GeoJSON.Geometry>> = {
    "hdb": hdbData,
    "preschools": preschoolData,
    "mrt": mrtData
}

export type NewDatasetType = {
    title: string;
    description: string;
    parentLayerId: string;
    newFeatures?: Feature<Geometry, GeoJsonProperties>[];
    deletedFeatures?: FeatureId[];
}

export type CreateDatasetType = NewDatasetType & {
    userId: string;
}
 
type EditDatasetCardProps = {
    mapStore: MapStore,
    addSourceLayer: (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>, parentId: string, backendId: string) => void;
    userStore: LoginUserStore,
    cancelDeletedFeatures: () => void,
    disableEditing: () => void
}

type SaveFormInput = {
    title: string,
    description: string
}

export const EditDatasetCard = observer(({ mapStore, addSourceLayer, userStore, cancelDeletedFeatures, disableEditing }: EditDatasetCardProps) : React.JSX.Element => {
    const [saveInput, setSaveInput] = useState<SaveFormInput>({
        title: "",
        description: ""
    })    
    const [userId, setUserId] = useState<string>("");
    
    const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
        setSaveInput({
            ...saveInput,
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
    }

    const prepSrcData = (currEditingLayerId: string, featuresToConcat?: Feature<Geometry, GeoJsonProperties>[], featuresToRemove?: string[]) :FeatureCollection<Geometry, GeoJsonProperties> => {

        const currData: FeatureCollection<Geometry, GeoJsonProperties> = DATASETID_LOOKUP[currEditingLayerId];
        let currPointDataFeatures = currData.features;
        let newPointDataFeatures: Feature<Geometry, GeoJsonProperties>[] = [];

        // add new points if any
        if (!featuresToConcat) {
            featuresToConcat = [];
        } 
        // remove deleted points if any
        if (featuresToRemove) {
            // remove points that exist in featuresToRemove arr
            newPointDataFeatures = currPointDataFeatures.filter((feature) => !featuresToRemove.includes(feature.properties?.Name));
        }
        newPointDataFeatures = newPointDataFeatures.concat(featuresToConcat);

        const newGeoJsonData = {
            "type": "FeatureCollection",
            "features": newPointDataFeatures
        } as GeoJSON.FeatureCollection<GeoJSON.Geometry>;

        return newGeoJsonData;

    }

    const handleAdd = (): void => {

        // add new dataset to map
        if (mapStore.currEditingLayer !== null) {
            const datasetData: NewDatasetType = {
                // saveInput
                ...saveInput, 
                parentLayerId: mapStore.currEditingLayer,
                ...(mapStore.markersGeoJson && { newFeatures: mapStore.markersGeoJson }),
                ...(mapStore.deletedFeatures && { deletedFeatures: mapStore.deletedFeaturesId })
            }
            const currEditingLayerId = mapStore.currEditingLayer;
            const newGeoJsonData = prepSrcData(currEditingLayerId, datasetData.newFeatures, mapStore.deletedFeaturesNames);

            const backendId = "";

            addSourceLayer(saveInput.title, newGeoJsonData, currEditingLayerId, backendId);
        } 
        
        // reset form & close card
        setSaveInput({
            title: "",
            description: ""
        });
        clearMap();

    }
    
    useEffect(() => {
        const token = getToken();
        const payload = token ? JSON.parse(atob(token.split(".")[1])).payload : null;
        if (payload && payload.userId) {
            setUserId(payload.userId);
        }
    }, []);

    const handleSubmit = async () => {

        const token = localStorage.getItem('token'); 
        if (!token) throw new Error('Token not found');
        
        if (mapStore.currEditingLayer !== null) {
            const datasetData: CreateDatasetType  = {
                // saveInput
                ...saveInput, 
                userId: userId,
                parentLayerId: mapStore.currEditingLayer,
                // copy features from geojson of parentLayer
                ...(mapStore.markersGeoJson && { newFeatures: mapStore.markersGeoJson }),
                ...(mapStore.deletedFeatures && { deletedFeatures: mapStore.deletedFeaturesId })
            }

            try {
                // send POST request
                const res = await fetch("http://localhost:3000/datasets/create", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}` },
                    body: JSON.stringify(datasetData)
                });
    
                if (res.ok) {
    
                    const jsonData = await res.json();
                    {/*
                        Sample jsonData
                        {
                            "success": true,
                            "data": {
                                "title": "Test HDB Layer",
                                "description": "jus for fun",
                                "newFeatures": [
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "_id": "65d86d23cb5f74939001d513"
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                103.9245885212186,
                                                1.3260592219579053
                                            ],
                                            "_id": "65d86d23cb5f74939001d514"
                                        },
                                        "_id": "65d86d23cb5f74939001d512"
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "_id": "65d86d23cb5f74939001d516"
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                103.92378673888516,
                                                1.3256892676513559
                                            ],
                                            "_id": "65d86d23cb5f74939001d517"
                                        },
                                        "_id": "65d86d23cb5f74939001d515"
                                    },
                                    {
                                        "type": "Feature",
                                        "properties": {
                                            "_id": "65d86d23cb5f74939001d519"
                                        },
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates": [
                                                103.92482288836248,
                                                1.3250973406445326
                                            ],
                                            "_id": "65d86d23cb5f74939001d51a"
                                        },
                                        "_id": "65d86d23cb5f74939001d518"
                                    }
                                ],
                                "deletedFeatures": [],
                                "_id": "65d86d23cb5f74939001d511",
                                "createdAt": "2024-02-23T10:02:11.866Z",
                                "updatedAt": "2024-02-23T10:02:11.866Z",
                                "__v": 0
                            }
                        }
                    */}
                    // add new dataset to map
                    const currEditingLayerId = mapStore.currEditingLayer;
                    const newGeoJsonData = prepSrcData(currEditingLayerId, mapStore.markersGeoJson, mapStore.deletedFeaturesNames);

                    const backendId = jsonData.data._id;

                    addSourceLayer(saveInput.title, newGeoJsonData, currEditingLayerId, backendId);
                
                    
                    // reset form & close card
                    setSaveInput({
                        title: "",
                        description: ""
                    });
                    clearMap();
    
                } else {
                    throw new Error("Invalid dataset creation.")
                }
    
            } catch(err) {
                console.error(err);
            }
        }
    }

    return (
        <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">
                    Customising: {mapStore.currEditingLayer} Layer
                </h5>
            </a>

            <div id="feature-tracking">
                <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
                    {mapStore.markers.length} features added
                </p>
                <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">
                    {mapStore.deletedFeaturesNum} features deleted
                </p>
            </div>

            <form className="max-w-md mx-auto">
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="title" id="title" value={saveInput.title} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Title" required />
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="description" id="fdescription" value={saveInput.description} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Description" required />
                </div>
            </form>

            <div className="flex mt-4 md:mt-6">
                {
                    userStore.user
                    ? 
                    <button id="login-save" onClick={() => handleSubmit()} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                        Save
                    </button>   
                    :
                    <button id="nonlogin-save" onClick={() => handleAdd()} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                        Add
                    </button>                 
                }
                <button onClick={() => clearMap()} className="py-2 px-4 ms-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Cancel
                </button>
            </div>

        </div>
    )
})