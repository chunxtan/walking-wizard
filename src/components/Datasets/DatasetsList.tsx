import mapboxgl from "mapbox-gl";
import { DatasetItem } from "./DatasetItem";

type DatasetListProps = {
    datasets: string[],
    map: mapboxgl.Map
}

export const DatasetList = ({ datasets, map }: DatasetListProps): React.JSX.Element => {

    return (
        <div className="absolute top left ml12 mt12 border border--2 border--white bg-white shadow-darken10 z1">
            <ul>
                {
                    datasets.map((dataset) => {
                        return <DatasetItem dataset={dataset} map={map} />
                    })
                }
            </ul>
        </div>
    )
}