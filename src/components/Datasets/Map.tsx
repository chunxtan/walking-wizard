import React, { useRef, useEffect, LegacyRef } from 'react';
import mapboxgl, { MapMouseEvent } from "mapbox-gl";
import './Map.css';
import { hdbData } from '../../datasets/hdb_bedok_centroid';
import { preschoolData } from '../../datasets/preschools_bedok'; 
import { mrtData } from '../../datasets/mrt_bedok_centroid';
import { networkData } from '../../datasets/network_bedok';
import LayerToggleComponent from './LayerToggleComponent';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';
import { MapStore, DatasetLayer } from './MapStore';
import { observer } from 'mobx-react';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;


// Set up store
const mapStore = new MapStore();

export const Map = observer((): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map>();
    // const [layers, setLayers] = useState<DatasetLayers[]>([]);
    // const [layersReady, setLayersReady] = useState<boolean>(false);


    const addSourceLayer = (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>, circleColor: string) => {
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
                    'circle-color': circleColor
                }
                
            })

            mapStore.addLayer({ layerId: id, visibility: 'visible', isEditing: false});
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

                addSourceLayer("hdb", hdbData, 'rgba(55,148,179,1)');

                addSourceLayer("preschools", preschoolData, 'rgb(125, 125, 222)');

                addSourceLayer("mrt", mrtData, 'rgb(57, 143, 45)');

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
        
                    
                    mapStore.addLayer({ layerId: "network", visibility: 'visible', isEditing: false});
                }
            })

            mapStore.toggleLayersReady(true);

    }}}, []); 

    // To add new markers
    useEffect(() => {
        console.log("layer.isEditing", mapStore.layers.map((layer) => layer.isEditing))
        if (map.current) {
            map.current.on('click', (e: MapMouseEvent) => {

                // check if isEditing is on for any layers
                const editingLayer: DatasetLayer[] = mapStore.getEditingLayers();

                if (editingLayer.length > 1) {
                    console.log("layers in editing mode: ", editingLayer);
                    throw new Error("More than one layer in editing mode.") 
                }
                // Ensures that only single layer in editing mode 
                else if (editingLayer.length == 1) {
                    mapStore.setCurrEditingLayer(editingLayer[0].layerId);
    
                    // store click coords in state
                    mapStore.setClickCoords(e.lngLat);
    
                    // create moveable marker with coords state
                    if (map.current) {
                        // TODO: make marker draggable
                        const marker = new mapboxgl.Marker()
                            .setLngLat(mapStore.clickCoords)
                            .addTo(map.current)

                        mapStore.addMarker(marker);
                    }

                }
                else {
                    console.log("No layers in editing mode.")
                    return
                }
            })

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
            <div className="relative">
                <div>
                <div className="sidebar card">
                    <div id="menu">
                        { mapStore.layersReady
                            ? mapStore.layers.map((layer) => (
                                    <LayerToggleComponent key={layer.layerId} id={layer.layerId} active={layer.visibility === 'visible'} onToggle={toggleLayer} />
                                ))
                            : null
                        }
                    </div>
                </div>
                <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container mapboxgl-map" />
                </div>
            </div>
        </div>
    );
    
})