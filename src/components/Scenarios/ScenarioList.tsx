import { Button } from "flowbite-react"
import { SidebarMode } from "./Scenarios"

type ScenarioListProps = {
    setSidebarMode: (mode: SidebarMode) => void
}

export const ScenarioList = ({ setSidebarMode }: ScenarioListProps) : React.JSX.Element => {
    return (
        <ul id='menu' className="space-y-2 font-medium">
            Scenarios
            <Button size="xs" outline color='blue' onClick={() => setSidebarMode("create")}>+</Button>
            {/* TODO: insert list of scenarios here */}
        </ul>
    )
}