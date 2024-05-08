
import { Button, Table } from "flowbite-react";
import { SidebarMode } from "./Scenarios";
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";
import { atosRes_TEST04 } from "../../datasets/ATOS_RESULTS_TEST04";

type ScenarioResultProps = {
    setSidebarMode: (mode: SidebarMode) => void,
    addResultLayer: (id: string, geoJsonData: FeatureCollection<Geometry, GeoJsonProperties>) => void,
    deleteLayerSource: (id: string) => void
}

export const ScenarioResult = ({ setSidebarMode, addResultLayer, deleteLayerSource }: ScenarioResultProps) : React.JSX.Element => {
    const results = {
        "total_origin": 575,
        "origin_within_400": 501,
        "perc_origin_within_400": 87.1304347826087,
        "avg_travelling_dist": 239.94515839113708
    }

    // Render layer of ATOS Results
    addResultLayer("atos_res", atosRes_TEST04);


    const handleRestart = () => {
        setSidebarMode("view");
        // Clear Map
        deleteLayerSource("atos_res");
    }

    return (
        <div id='res-menu' className="space-y-2 font-medium">
            Results

            <div id="atos-results-indicators" className="font-sans overflow-x-auto">
                <Table striped>
                    <Table.Body className="divide-y">
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs resMenuCells">
                            {'Total no. of Origins'}
                            </Table.Cell>
                            <Table.Cell className="text-xs resMenuCells">{results.total_origin}</Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs resMenuCells">
                            {'No. of Origins within 400m'}
                            </Table.Cell>
                            <Table.Cell className="text-xs resMenuCells">{results.origin_within_400}</Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs resMenuCells">
                            {'% of Origins within 400m'}
                            </Table.Cell>
                            <Table.Cell className="text-xs resMenuCells">{`${results.perc_origin_within_400.toFixed(2)}%`}</Table.Cell>
                        </Table.Row>
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                            <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white text-xs resMenuCells">
                            {'Avg travelling distance (m)'}
                            </Table.Cell>
                            <Table.Cell className="text-xs resMenuCells">{`${results.avg_travelling_dist.toFixed(2)}m`}</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </div>

            <div className="flex flex-wrap items-start gap-2" style={{ justifyContent:"center" }}>
                <Button size="xs" outline color="blue" onClick={() => handleRestart()}>Restart</Button>
            </div>

        </div>

    )
}