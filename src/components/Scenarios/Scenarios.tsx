import React, { useRef, useEffect, LegacyRef, useState } from 'react';
import { observer } from "mobx-react";
import { MapProps } from "../Datasets/Map";
import mapboxgl from 'mapbox-gl';
import { ScenarioList } from './ScenarioList';
import { CreateScenario } from './CreateScenario';
import { ScenarioResult } from './ScenarioResult';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

export type SidebarMode = "view" | "create" | "result";

export const Scenarios = observer(({ userStore }: MapProps): React.JSX.Element => {
    const mapContainer = useRef<string | HTMLElement | null>(null);
    const map = useRef<mapboxgl.Map>();

    const [sidebarMode, setSidebarMode] = useState<SidebarMode>("view");

    useEffect(() => {
        // Set up map
        if (!map.current && mapContainer.current) {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: "mapbox://styles/mapbox/streets-v12",
            center: [103.85606546860004, 1.335853410573298],
            zoom: 9,
          });
    }}, []); 

    const switchSidebar = () => {
        switch(sidebarMode) {
            case "view":
                return <ScenarioList setSidebarMode={setSidebarMode} />
            case "create":
                return <CreateScenario setSidebarMode={setSidebarMode} userStore={userStore} />
            case "result":
                return <ScenarioResult setSidebarMode={setSidebarMode} addResultLayer={addResultLayer} deleteLayerSource={deleteLayerSource} />
        }
    }

    const deleteLayerSource = (id: string): void => {
        if (map.current) {
            map.current.removeLayer(id);
            map.current.removeSource(id);
        }
    }

    // addLayer for ATOS Result geojson
    const addResultLayer = (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>) => {
        if (map.current) {

            const checkSrc = map.current.getSource(id);

            if (!checkSrc) {
                map.current.addSource(id, {
                    type: 'geojson',
                    data: geoJsonData,
                    generateId: true
                })
            }

            map.current.addLayer({
                "id": id,
                "type": "circle",
                "source": id,
                'layout': {
                    'visibility': 'visible'
                },
                'paint': {
                    'circle-radius': ['interpolate', ['linear'], ['zoom'], 
                        10, 3, 
                        12, 4,
                        12.25, 5,
                        12.5, 6
                    ],
                    'circle-stroke-width': 1,
                    'circle-stroke-color': 'white',
                    'circle-color': [
                        
                          'interpolate',
                          ['linear'],
                          ['get', 'ATOS_SCORE'],
                          1,
                          '#FF0000',
                          2,
                          '#E61900',
                          3,
                          '#CC3300',
                          4,
                          '#B34D00',
                          5,
                          '#996600',
                          6,
                          '#7F8000',
                          7,
                          '#669900',
                          8,
                          '#50A300',
                          9,
                          '#33B300',
                          10,
                          '#00C200'
                      ]                  
                }
                
            })
        }
    }

    return (
        <div>
            <div id="map-frame" className="relative">
                <div className="sidebar max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    {switchSidebar()}
                </div>

                <div ref={mapContainer as LegacyRef<HTMLDivElement>} className="map-container mapboxgl-map" />
            </div>
        </div>
    )
})