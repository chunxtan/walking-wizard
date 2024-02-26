import React, { useRef, useEffect, LegacyRef, useState } from 'react';
import mapboxgl, { MapLayerMouseEvent } from "mapbox-gl";
import './Map.css';
import { hdbData } from '../../datasets/hdb_bedok_centroid';
import { preschoolData } from '../../datasets/preschools_bedok'; 
import { mrtData } from '../../datasets/mrt_bedok_centroid';
import { networkData } from '../../datasets/network_bedok';
import LayerToggleComponent from './LayerToggleComponent';
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { MapStore } from './MapStore';
import { observer } from 'mobx-react';
import { EditDatasetCard } from './EditDatasetCard';
import { Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';
import { LoginUserStore } from '../UserProfile/LoginSignUp/LoginUserStore';
import { getToken } from '../../util/security';
import { DATASETID_LOOKUP, CreateDatasetType } from './EditDatasetCard';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type MapProps = {
    userStore: LoginUserStore
}

export type showToastMsg = {
    isShow: boolean;
    toastMsg: string
}

type ExtgDatasets = CreateDatasetType & {
    _id: string;
    userId: string;
}

// Set up store
const mapStore = new MapStore();

const DATASET_COLOR_LOOKUP: Record<string, string> = {
    "hdb": 'rgba(55,148,179,1)',
    "preschools": 'rgb(125, 125, 222)',
    "mrt": 'rgb(57, 143, 45)' 
}

export const MapboxMap = observer(({ userStore }: MapProps): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map>();

    const [showToast, setShowToast] = useState<showToastMsg>({
        isShow: false,
        toastMsg: ""
    });

    const addSourceLayer = (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>, parentId: string = id, backendId: string) => {
        if (map.current) {
            map.current.addSource(id, {
                type: 'geojson',
                data: geoJsonData,
                generateId: true
            })

            map.current.addLayer({
                "id": id,
                "type": "circle",
                "source": id,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': 3,
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'white',
                    'circle-color': [
                        "case",
                        ["==", ["feature-state", "isDeleted"], true],
                        "rgba(255, 0, 0, 0.8)", // Color for clicked features
                        DATASET_COLOR_LOOKUP[parentId] // Default color
                      ]
                }
                
            })

            let isUserCreatedVal, backendIdVal;
            if (id === parentId) {
                isUserCreatedVal = false;
                backendIdVal = "";
            } else {
                isUserCreatedVal = true;
                backendIdVal = backendId;
            }

            mapStore.addLayer({ layerId: id, visibility: 'visible', isEditing: false, isUserCreated: isUserCreatedVal, backendId: backendIdVal });
        }

    }

    const deleteLayerSource = (id: string): void => {
        if (map.current) {
            map.current.removeLayer(id);
            map.current.removeSource(id);
        }
    }

    useEffect(() => {
        // Set up map
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [103.85606546860004, 1.335853410573298],
            zoom: 9,
          });

        if (map.current) {

                // Load layers 
                map.current.on('load', async () => {

                    addSourceLayer("hdb", hdbData, "hdb", "");

                    addSourceLayer("preschools", preschoolData, "preschools", "");

                    addSourceLayer("mrt", mrtData, "mrt", "");

                    // add network
                    if (map.current) {

                        map.current.addSource("network", {
                            type: 'geojson',
                            data: networkData
                        })
            
                        map.current.addLayer({
                            "id": "network",
                            "type": "line",
                            "source": "network",
                            'layout': {
                                'visibility': 'visible'
                            },
                            'paint': {
                                'line-color': "rgb(74, 169, 242)",
                                'line-width': 2
                            }
                            
                        })
                        
                        mapStore.addLayer({ layerId: "network", visibility: 'visible', isEditing: false, isUserCreated: false, backendId: "" });
                    }

                    // if user logged in, check for previously created datasets & add to map
                    if (userStore.user) {
                        const userId = userStore.user.userId;
                        const token = getToken();

                        try {
                            const res = await fetch(`http://localhost:3000/datasets/show/${userId}`, {
                                method: 'GET',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${token}`
                                }
                            })

                            if (res.ok) {
                                const extgDatasets = await res.json();
                                {/*
                                SAMPLE EXTG DATASETS:
                                {
                                    "datasets": [
                                        {
                                            "_id": "65d9aa26b50934d1b8bb4bef",
                                            "userId": "65d22ee3e6e1e2c29287325d",
                                            "title": "hdb 3",
                                            "description": "2024 june launch",
                                            "parentLayerId": "hdb",
                                            "newFeatures": [
                                                {
                                                    "type": "Feature",
                                                    "properties": {
                                                        "_id": "65d9aa26b50934d1b8bb4bf1"
                                                    },
                                                    "geometry": {
                                                        "type": "Point",
                                                        "coordinates": [
                                                            103.9287693833511,
                                                            1.3227589401520987
                                                        ],
                                                        "_id": "65d9aa26b50934d1b8bb4bf2"
                                                    },
                                                    "_id": "65d9aa26b50934d1b8bb4bf0"
                                                },
                                                {
                                                    "type": "Feature",
                                                    "properties": {
                                                        "_id": "65d9aa26b50934d1b8bb4bf4"
                                                    },
                                                    "geometry": {
                                                        "type": "Point",
                                                        "coordinates": [
                                                            103.92874801519037,
                                                            1.3208363173358464
                                                        ],
                                                        "_id": "65d9aa26b50934d1b8bb4bf5"
                                                    },
                                                    "_id": "65d9aa26b50934d1b8bb4bf3"
                                                },
                                                {
                                                    "type": "Feature",
                                                    "properties": {
                                                        "_id": "65d9aa26b50934d1b8bb4bf7"
                                                    },
                                                    "geometry": {
                                                        "type": "Point",
                                                        "coordinates": [
                                                            103.93050020444707,
                                                            1.320003180320171
                                                        ],
                                                        "_id": "65d9aa26b50934d1b8bb4bf8"
                                                    },
                                                    "_id": "65d9aa26b50934d1b8bb4bf6"
                                                }
                                            ],
                                            "deletedFeatures": [],
                                            "createdAt": "2024-02-24T08:34:46.444Z",
                                            "updatedAt": "2024-02-24T08:34:46.444Z",
                                            "__v": 0
                                        }
                                    ]
                                }
                                */}

                                if (extgDatasets.datasets.length > 0) {
                                    extgDatasets.datasets.forEach((dataset: ExtgDatasets) => {
                                        const parentData = DATASETID_LOOKUP[dataset.parentLayerId];
                                        let datasetFeatures: Feature<Geometry, GeoJsonProperties>[] = [];
                                        if (dataset.newFeatures) {
                                            datasetFeatures = parentData.features.concat(dataset.newFeatures);
                                        }
                                        const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Geometry>  = {
                                            "type": "FeatureCollection",
                                            "features": datasetFeatures
                                        }

                                        addSourceLayer(dataset.title, geoJsonData, dataset.parentLayerId, dataset._id);
                                    })
                                }
                            }
                        } catch(err) {
                            console.error(err);
                        }
                    }
                })

                mapStore.toggleLayersReady(true);

    }}}, []); 

    // For customising layer
    useEffect(() => {
        // check if isEditing is on for any layers
        if (mapStore.totalEditingLayers > 1) {
            throw new Error("More than one layer in editing mode.") 
        }

        // Ensures that only single layer in editing mode 
        else if (mapStore.totalEditingLayers == 1) {
            enableEditing();
        }
            
        else {
            return
        }
    }, [mapStore.totalEditingLayers])

    const enableEditingHandler = (e: MapLayerMouseEvent): void => {
        const clickLngLat = e.lngLat;

        if (map.current && mapStore.currEditingLayer) {
            const featuresIdentified = map.current?.queryRenderedFeatures(e.point, {
                layers: [mapStore.currEditingLayer]
            });

            let deleteId;

            if (featuresIdentified.length == 0) {

                // check if coord is in marker[] state
                if (mapStore.markersLngLat.includes(clickLngLat)) {
                    const idxToRemove = mapStore.markersLngLat.indexOf(clickLngLat);
                    // to remove from map
                    mapStore.markers[idxToRemove].remove();
                    // to remove from mapStore
                    const updatedMarkers = [...mapStore.markers];
                    updatedMarkers.splice(idxToRemove, 1);
                    mapStore.setMarkers(updatedMarkers);
                }

                // store click coords in state
                mapStore.setClickCoords(e.lngLat);

                // create moveable marker with coords state
                if (map.current) {
                    const marker = new mapboxgl.Marker()
                        .setLngLat(mapStore.clickCoords)
                        .addTo(map.current)
                    mapStore.setMarkers([...mapStore.markers, marker]);
                }
                return
            } else {
                const feature = featuresIdentified[0];
                deleteId = feature.id;
                if (mapStore.deletedFeaturesId.includes(deleteId)) {
                    map.current?.setFeatureState({
                        source: mapStore.currEditingLayer,
                        id: deleteId
                    }, {
                        isDeleted: false
                    })

                    const idxToRemove = mapStore.deletedFeaturesId.indexOf(deleteId);
                    const newDeletedFeatures = [...mapStore.deletedFeatures];
                    newDeletedFeatures.splice(idxToRemove, 1);
                    mapStore.setDeletedFeatures(newDeletedFeatures);

                } else {
                    map.current?.setFeatureState({
                        source: mapStore.currEditingLayer,
                        id: deleteId
                    }, {
                        isDeleted: true
                    })
                    const newDeletedFeature = { id: deleteId, feature: feature };
                    mapStore.setDeletedFeatures([...mapStore.deletedFeatures, newDeletedFeature]);
                }

            }
        }
        
    }

    const enableEditing = (): void => {

        if (map.current) {
            const currEditingLayer = mapStore.editingLayers[0].layerId;
            mapStore.setCurrEditingLayer(currEditingLayer);
            // To delete marker
            map.current.on('click', enableEditingHandler)
            mapStore.editHandle = enableEditingHandler;
        }
    }

    const disableEditing = (): void => {
        if (map.current && mapStore.editHandle) {
            map.current.off('click', mapStore.editHandle);
            mapStore.editHandle = null;
        }
    }

    const cancelDeletedFeatures = (): void => {
        mapStore.deletedFeaturesId.forEach((id) => {
            if (mapStore.currEditingLayer) {
                map.current?.setFeatureState({
                    source: mapStore.currEditingLayer,
                    id: id
                }, {
                    isDeleted: false
                })
            }
        });
        mapStore.setDeletedFeatures([]);
    }

    const toggleLayer = (id: string, toggleType: "vis" | "edit") => {
      
          const updatedLayers = mapStore.layers.map((layer) => {
            if (layer.layerId === id && map.current) {
                if (toggleType === "vis") { 
                    if (layer.visibility === "visible") {
                        map.current.setLayoutProperty(id, "visibility", "none");
                    } else {
                        map.current.setLayoutProperty(id, "visibility", "visible");
                    }

                    return { ...layer, visibility: (layer.visibility === 'visible' ? 'none' : 'visible') as "visible" | "none" }
                } else {
                    if (layer.isEditing === true) {
                        return { ...layer, isEditing: false }
                    } else {
                        return { ...layer, isEditing: true }
                    }
                }
            } else {
                return layer
            }}
          );
      
          mapStore.setLayerProps(updatedLayers);
    };
  
    return (
        <div>
            <div id="map-frame" className="relative">
                <div className="sidebar max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <ul id='menu' className="space-y-2 font-medium">
                        Datasets
                        { mapStore.layersReady
                            ? mapStore.layers.map((layer) => (
                                    <LayerToggleComponent key={layer.layerId} id={layer.layerId} active={layer.visibility === 'visible'} onToggle={toggleLayer} isUserCreated={layer.isUserCreated} backendId={layer.backendId} mapStore={mapStore} deleteLayerSource={deleteLayerSource} setShowToast={setShowToast} userStore={userStore} />
                                ))
                            : null
                        }
                    </ul>
                </div>

                {
                    mapStore.currEditingLayer
                    ? 
                    <div className="sidebar-right">
                        <EditDatasetCard mapStore={mapStore} addSourceLayer={addSourceLayer} userStore={userStore} cancelDeletedFeatures={cancelDeletedFeatures} disableEditing={disableEditing} />
                    </div>
                    :
                    null
                }                
                
                {   
                    showToast.isShow
                    ?
                    <div>
                        <Toast className="transition-opacity fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
                            <div className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-3 w-3" />
                            </div>
                            <div className="ml-3 text-xs font-normal">{showToast.toastMsg}</div>
                            <Toast.Toggle />
                        </Toast>
                    </div>
                    : null
                }
                <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container mapboxgl-map" />

            </div>
        </div>
    );
    
})