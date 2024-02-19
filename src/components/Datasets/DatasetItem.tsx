import mapboxgl from "mapbox-gl";

type DatasetItemProps = {
    dataset: string,
    map: mapboxgl.Map
}

export const DatasetItem = ({ dataset, map }: DatasetItemProps): React.JSX.Element => {

    const toggleVisibility = (evt: React.MouseEvent): void => {
        const clickedLayer = evt.currentTarget.id;
        evt.preventDefault();
        evt.stopPropagation()

        const visibility = map.getLayoutProperty(
            clickedLayer,
            'visibility'
        );

        // Toggle layer visibility by changing the layout object's visibility property
        if (visibility === "visibile") {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            evt.currentTarget.className = ""
        } else {
            evt.currentTarget.className = 'active';
            map.setLayoutProperty(
                clickedLayer, 'visibility', 'visible');
        }
    }

    return (
        <li>
            <a 
            onClick={(evt) => toggleVisibility(evt)}
            id={dataset}
            href='#'
            className='active'>
                {dataset}
            </a>
        </li>
    )
}