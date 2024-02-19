import React, { useRef, useEffect, useState, LegacyRef } from 'react';
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = (): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<number>(-70.9);
    const [lat, setLat] = useState<number>(42.35);
    const [zoom, setZoom] = useState<number>(9);
  
    // useEffect(() => {
    //   if (map.current) return; // initialize map only once
    //   map.current = new mapboxgl.Map({
    //     container: mapContainer.current,
    //     style: "mapbox://styles/mapbox/streets-v12",
    //     center: [lng, lat],
    //     zoom: zoom,
    //   });
    // })

    useEffect(() => {
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [lng, lat],
            zoom: zoom,
          });
        }
    }, [lng, lat, zoom]); // Add dependencies to useEffect
  
    return (
      <div className="App">
        <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container" />
      </div>
    );
    
}