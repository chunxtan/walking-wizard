import React, { useRef, useEffect, LegacyRef, useState } from 'react';
import { observer } from "mobx-react";
import { MapProps } from "../Datasets/Map";
import mapboxgl from 'mapbox-gl';
import { ScenarioList } from './ScenarioList';
import { CreateScenario } from './CreateScenario';
import { ScenarioResult } from './ScenarioResult';

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
                return <ScenarioResult map={map} setSidebarMode={setSidebarMode} />
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