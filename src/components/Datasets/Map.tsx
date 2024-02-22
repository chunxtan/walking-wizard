import React, { useRef, useEffect, useState, LegacyRef } from 'react';
import mapboxgl from "mapbox-gl";
import './Map.css';
import { hdbData } from '../../datasets/hdb_bedok_centroid';
import { preschoolData } from '../../datasets/preschools_bedok'; 
import { mrtData } from '../../datasets/mrt_bedok_centroid';
import { networkData } from '../../datasets/network_bedok';
import LayerToggleComponent from './LayerToggleComponent';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = (): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map>();9
    const [layers, setLayers] = useState<{ id: string; visibility: 'visible' | 'none'; isEditing: boolean }[]>([]);

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

            setLayers((prevLayers) => [...prevLayers, { id: id, visibility: 'visible', isEditing: false}])
        }

    }

    useEffect(() => {
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [103.85606546860004, 1.335853410573298],
            zoom: 9,
          });

        if (map.current) {
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
        
                    setLayers((prevLayers) => [...prevLayers, { id: "network", visibility: 'visible', isEditing: false}])
                }
            })

    }}}, []); 

    const toggleLayerVisibility = (id: string, toggleType: "vis" | "edit") => {
        setLayers((prevLayers) => {
          if (!prevLayers) {
            return prevLayers; 
          }
      
          const updatedLayers = prevLayers.map((layer) => {
            if (layer.id === id && map.current) {
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
      
          return updatedLayers;
        });
    };
  
    return (
        <div>
            <div className="relative">
                <div>
                <div className="sidebar">
                    <div id="menu">
                        {layers.map((layer) => (
                            <LayerToggleComponent key={layer.id} id={layer.id} active={layer.visibility === 'visible'} onToggle={toggleLayerVisibility} />
                        ))}
                    </div>
                </div>
                <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container mapboxgl-map" />
                </div>
            </div>
        </div>
    );
    
}