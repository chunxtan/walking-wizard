import { observer } from "mobx-react";
import { MapStore } from "./MapStore";
import { useState } from "react";
import { hdbData } from "../../datasets/hdb_bedok_centroid";
import { preschoolData } from "../../datasets/preschools_bedok";
import { mrtData } from "../../datasets/mrt_bedok_centroid";
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { LngLat } from "mapbox-gl";

const DATASETID_LOOKUP: Record<string, GeoJSON.FeatureCollection<GeoJSON.Geometry>> = {
    "hdb": hdbData,
    "preschools": preschoolData,
    "mrt": mrtData
}

type EditDatasetCardProps = {
    mapStore: MapStore,
    addSourceLayer: (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>, parentId: string) => void
}

type SaveFormInput = {
    title: string,
    description: string
}

export const EditDatasetCard = observer(({ mapStore, addSourceLayer }: EditDatasetCardProps) : React.JSX.Element => {
    const [saveInput, setSaveInput] = useState<SaveFormInput>({
        title: "",
        description: ""
    })    
    
    const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
        setSaveInput({
            ...saveInput,
            [evt.currentTarget.name]: evt.currentTarget.value
        });
    }

    const clearMap = (): void => {
        mapStore.setCurrEditingLayer(null);
        mapStore.markers.forEach(marker => marker.remove());
        mapStore.clearCoordsMarkers();

        mapStore.setLayerProps(mapStore.layers.map((layer) => ({
            ...layer,
            isEditing: false,
        })))
    }

    const handleSubmit = async () => {
        
        const newPoints = mapStore.markers.map((marker) => {
            const {lng, lat} = marker.getLngLat() as LngLat;
            return {
                "type": "Feature",
                "properties": {
                    "Name": "",
                    "Description": "",
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                }
            } as Feature<Geometry, GeoJsonProperties>;
        })

        // TODO: Add user payload into POST req
        const datasetData = {
            // saveInput
            ...saveInput, 
            // copy features from geojson of parentLayer
            newFeatures: newPoints,
            parentLayerId: mapStore.currEditingLayer

        }
        console.log("datasetData", datasetData);

        try {
            // send POST request
            const res = await fetch("http://localhost:3000/datasets/create", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify(datasetData)
            });
            console.log("dataset POST: ", res);

            if (res.ok) {
                // add new dataset to map
                // let newGeoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>;
                if (mapStore.currEditingLayer !== null) {
                    const currEditingLayerId = mapStore.currEditingLayer;
                    const currData = DATASETID_LOOKUP[currEditingLayerId];
                    // const currPointDataFeatures: Feature<Geometry, GeoJsonProperties>[] = [...currData.features] as Feature<Geometry, GeoJsonProperties>[];
                    const newPointDataFeatures = currData.features.concat(newPoints);
                    const newGeoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry> = {
                        "type": "FeatureCollection",
                        "features": newPointDataFeatures
                    }
                    console.log("before", currData.features);
                    console.log("after", newPointDataFeatures);
                    console.log("newGeoJsonData", newGeoJsonData);

                    addSourceLayer(saveInput.title, newGeoJsonData, currEditingLayerId);
                } 


                // reset form & close card
                setSaveInput({
                    title: "",
                    description: ""
                });
                clearMap();

                const jsonData = await res.json();
                console.log("dataset POST JSON: ", jsonData);
                // Sample jsonData
                // {
                //     "success": true,
                //     "data": {
                //         "title": "Test HDB Layer",
                //         "description": "jus for fun",
                //         "newFeatures": [
                //             {
                //                 "type": "Feature",
                //                 "properties": {
                //                     "_id": "65d86d23cb5f74939001d513"
                //                 },
                //                 "geometry": {
                //                     "type": "Point",
                //                     "coordinates": [
                //                         103.9245885212186,
                //                         1.3260592219579053
                //                     ],
                //                     "_id": "65d86d23cb5f74939001d514"
                //                 },
                //                 "_id": "65d86d23cb5f74939001d512"
                //             },
                //             {
                //                 "type": "Feature",
                //                 "properties": {
                //                     "_id": "65d86d23cb5f74939001d516"
                //                 },
                //                 "geometry": {
                //                     "type": "Point",
                //                     "coordinates": [
                //                         103.92378673888516,
                //                         1.3256892676513559
                //                     ],
                //                     "_id": "65d86d23cb5f74939001d517"
                //                 },
                //                 "_id": "65d86d23cb5f74939001d515"
                //             },
                //             {
                //                 "type": "Feature",
                //                 "properties": {
                //                     "_id": "65d86d23cb5f74939001d519"
                //                 },
                //                 "geometry": {
                //                     "type": "Point",
                //                     "coordinates": [
                //                         103.92482288836248,
                //                         1.3250973406445326
                //                     ],
                //                     "_id": "65d86d23cb5f74939001d51a"
                //                 },
                //                 "_id": "65d86d23cb5f74939001d518"
                //             }
                //         ],
                //         "deletedFeatures": [],
                //         "_id": "65d86d23cb5f74939001d511",
                //         "createdAt": "2024-02-23T10:02:11.866Z",
                //         "updatedAt": "2024-02-23T10:02:11.866Z",
                //         "__v": 0
                //     }
                // }
                return jsonData;
            } else {
                throw new Error("Invalid dataset creation.")
            }


        } catch(err) {
            console.error(err);
        }
    }

    return (
        <div className="max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">Customising: {mapStore.currEditingLayer} Layer</h5>
            </a>
            <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">{mapStore.markers.length} features added</p>

            <form className="max-w-md mx-auto">
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="title" id="title" value={saveInput.title} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Title" required />
                </div>
                <div className="relative z-0 w-full mb-5 group">
                    <input type="text" name="description" id="fdescription" value={saveInput.description} onChange={handleInputChange} className="block py-2.5 px-0 w-full text-xs text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder="Description" required />
                </div>
            </form>

            <div className="flex mt-4 md:mt-6">
                <button onClick={() => handleSubmit()} className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                    Save
                </button>
                <button onClick={() => clearMap()} className="py-2 px-4 ms-2 text-xs font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                    Cancel
                </button>
            </div>

        </div>
    )
})