import React, { useState } from 'react';
import { observer } from "mobx-react";
import mapboxgl from 'mapbox-gl';
import { ScenarioList } from './ScenarioList';
import { CreateScenario } from './CreateScenario';
import { ScenarioResult } from './ScenarioResult';
import { LoginUserStore } from '../UserProfile/LoginSignUp/LoginUserStore';

export type SidebarMode = "view" | "create" | "result";

export type ScenarioProps = {
    userStore: LoginUserStore,
    map: React.MutableRefObject<mapboxgl.Map | undefined>
}

export const Scenarios = observer(({ userStore, map }: ScenarioProps): React.JSX.Element => {

    const [sidebarMode, setSidebarMode] = useState<SidebarMode>("view");

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
        <div className="sidebar max-w-sm p-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ position:"absolute", right:0, left: "auto" }}>
            {switchSidebar()}
        </div>
    )
})