import React, { useRef, useEffect, useState, LegacyRef } from 'react';
import mapboxgl from "mapbox-gl";
import './Map.css';
import { hdbData } from '../../datasets/hdb_bedok_centroid';
import { DatasetList } from './DatasetsList';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export const Map = (): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map | null>(null);
    const [lng, setLng] = useState<number>(103.85606546860004);
    const [lat, setLat] = useState<number>(1.335853410573298);
    const [zoom, setZoom] = useState<number>(9);

    let togglebleLayerIds: string[] = [];

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

        if (map.current) {
            map.current.on('load', () => {
                if (map.current) {
    
                    // Add hdb data here
                    map.current.addSource('hdbs', {
                        type: 'geojson',
                        data: hdbData
                    })
                    // Add layer here
                    map.current.addLayer({
                        'id': 'hdbs-layer',
                        'type': 'circle',
                        'source': 'hdbs',
                        'layout': {
                            'visibility': 'visible'
                        },
                        'paint': {
                            'circle-radius': 3,
                            'circle-stroke-width': 1,
                            'circle-stroke-color': 'white',
                            'circle-color': 'rgba(55,148,179,1)'
                        }
                    })
                }
            })
    
            // map.current.on('idle', () => {
            //     // If layers not added to map, abort
            //     if (!map.current?.getLayer('hdbs')) {
            //         return;
            //     }
    
            //     togglebleLayerIds = ['hdbs'];
            // })
    
            // console.log("map.current available");
            // console.log(togglebleLayerIds);

            // return () => map.current.remove();
        }


    }, [lat, lng, zoom]); 

  
    return (
      <div>
        <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container" />
        {
            map.current && togglebleLayerIds 
            ? <DatasetList datasets={togglebleLayerIds} map={map.current} />
            : null
        }
      </div>
    );
    
}