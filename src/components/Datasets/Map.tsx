import React, { useRef, useEffect, useState, LegacyRef } from 'react';
import mapboxgl from "mapbox-gl";
import './Map.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = (): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<number>(103.85606546860004);
    const [lat, setLat] = useState<number>(1.335853410573298);
    const [zoom, setZoom] = useState<number>(9);

    useEffect(() => {
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: zoom,
          });

        map.current.on('move', () => {
            if (map.current) {
                setLng(parseFloat(map.current.getCenter().lng.toFixed(4)));
                setLat(parseFloat(map.current.getCenter().lat.toFixed(4)));
                setZoom(parseFloat(map.current.getZoom().toFixed(2)));
            }
            });
        }
    }); 
  
    return (
      <div className="App">
        <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container" />
      </div>
    );
    
}