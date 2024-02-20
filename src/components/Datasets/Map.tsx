import React, { useRef, useEffect, useState, LegacyRef } from 'react';
import mapboxgl from "mapbox-gl";
import './Map.css';
import { hdbData } from '../../datasets/hdb_bedok_centroid';
import LayerToggleComponent from './LayerToggleComponent';
import { FeatureCollection, GeoJsonProperties, Geometry } from 'geojson';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = (): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map>();
    const [lng, setLng] = useState<number>(103.85606546860004);
    const [lat, setLat] = useState<number>(1.335853410573298);
    const [zoom, setZoom] = useState<number>(9);
    const [layers, setLayers] = useState<{ id: string; visibility: 'visible' | 'none' }[]>([]);

    const getSource = (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>): void => {
        if (map.current) {
            map.current.addSource(id, {
                type: 'geojson',
                data: geoJsonData
            })
        }
    }

    const getLayer = (id: string, circleColor: string): void => {
        if (map.current) {
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

            setLayers((prevLayers) => [...prevLayers, { id: id, visibility: 'visible'}])
        }
    }

    useEffect(() => {
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: zoom,
          });

        if (map.current) {
            map.current.on('load', () => {
                if (map.current) {
    
                    if (!map.current.getSource("hdb") || !map.current.getLayer("hdb")) {
                        getSource("hdb", hdbData);
                        getLayer("hdb", 'rgba(55,148,179,1)');
                    }
                }
            })

    }}}, []); 

    const toggleLayerVisibility = (id: string) => {
        setLayers((prevLayers) => {
          if (!prevLayers) {
            // Handle potential undefined state (optional but recommended)
            return prevLayers; // Or throw an error or provide a default state
          }
      
          const updatedLayers = prevLayers.map((layer) => {
            if (layer.id === id && map.current) {
                if (layer.visibility === "visible") {
                    map.current.setLayoutProperty(id, "visibility", "none");
                } else {
                    map.current.setLayoutProperty(id, "visibility", "visible");
                }
                return { ...layer, visibility: (layer.visibility === 'visible' ? 'none' : 'visible') as "visible" | "none" }
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