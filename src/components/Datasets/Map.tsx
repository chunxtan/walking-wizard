import React, { useRef, useEffect, LegacyRef, useState } from 'react';
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import './Map.css';
import { hdbData } from '../../datasets/hdb_bedok_centroid';
import { preschoolData } from '../../datasets/preschools_bedok'; 
import { mrtData } from '../../datasets/mrt_bedok_centroid';
import { networkData } from '../../datasets/network_bedok';
import LayerToggleComponent from './LayerToggleComponent';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { MapStore } from './MapStore';
import { observer } from 'mobx-react';
import { EditDatasetCard } from './EditDatasetCard';
import { Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export type showToastMsg = {
    isShow: boolean;
    toastMsg: string
}

// Set up store
const mapStore = new MapStore();

const DATASET_COLOR_LOOKUP: Record<string, string> = {
    "hdb": 'rgba(55,148,179,1)',
    "preschools": 'rgb(125, 125, 222)',
    "mrt": 'rgb(57, 143, 45)' 
}

export const Map = observer((): React.JSX.Element => {
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
                data: geoJsonData
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
                    'circle-color': DATASET_COLOR_LOOKUP[parentId]
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
            map.current.on('load', () => {

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
            })

            mapStore.toggleLayersReady(true);

    }}}, []); 

    // To add new markers
    useEffect(() => {
        if (map.current) {

            // check if isEditing is on for any layers

            if (mapStore.totalEditingLayers > 1) {
                throw new Error("More than one layer in editing mode.") 
            }

            // Ensures that only single layer in editing mode 
            else if (mapStore.totalEditingLayers == 1) {
            mapStore.setCurrEditingLayer(mapStore.editingLayers[0].layerId);

                map.current.on('click', (e: MapMouseEvent) => {
                    // store click coords in state
                    mapStore.setClickCoords(e.lngLat);
    
                    // create moveable marker with coords state
                    if (map.current) {
                        // TODO: make marker draggable
                        const marker = new mapboxgl.Marker()
                            .setLngLat(mapStore.clickCoords)
                            .addTo(map.current)
                        console.log("marker:", marker);
                        mapStore.addMarker(marker);
                    }
                }
            )}
                
            else {
                console.log("No layers in editing mode.")
                return
            }

            // To delete marker
            map.current.on('dblclick', () => {
                // check if coord is in marker[] state

                // if yes, remove
            })
        }
    }, mapStore.layersReady ? mapStore.layers.map((layer) => layer.isEditing) : [])

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
                                    <LayerToggleComponent key={layer.layerId} id={layer.layerId} active={layer.visibility === 'visible'} onToggle={toggleLayer} isUserCreated={layer.isUserCreated} backendId={layer.backendId} mapStore={mapStore} deleteLayerSource={deleteLayerSource} setShowToast={setShowToast} />
                                ))
                            : null
                        }
                    </ul>
                </div>

                {
                    mapStore.currEditingLayer
                    ? 
                    <div className="sidebar-right">
                        <EditDatasetCard mapStore={mapStore} addSourceLayer={addSourceLayer} />
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