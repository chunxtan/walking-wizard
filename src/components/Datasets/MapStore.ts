import { LngLat, Marker } from "mapbox-gl";
import { action, makeObservable, observable } from "mobx";


export type DatasetLayer = { 
    layerId: string, 
    visibility: 'visible' | 'none',
    isEditing: boolean 
}

export class MapStore {
    layers: DatasetLayer[];
    layersReady: boolean;
    clickCoords: LngLat;
    markers: Marker[];
    currEditingLayer: string;

    constructor() {
        this.layers = [];
        this.layersReady = false;
        this.clickCoords = new LngLat(0, 0);
        this.markers = [];
        this.currEditingLayer = "";

        makeObservable(this, {
            layers: observable,
            layersReady: observable,
            addLayer: action,
            setLayerProps: action,
            toggleLayersReady: action
        })
    }

    addLayer(newLayer: DatasetLayer) {
        this.layers.push(newLayer);
    }

    setLayerProps(updatedLayers: DatasetLayer[]) {
        this.layers = updatedLayers;
    } 

    toggleLayersReady(val: boolean) {
        this.layersReady = val;
    }

    getEditingLayers() {
        const editingLayer: DatasetLayer[] = [];
        this.layers.forEach((layer) => {
            if (layer.isEditing) {
                editingLayer.push(layer);
            }
        })

        return editingLayer;
    }

    setClickCoords(coords: LngLat) {
        this.clickCoords = coords;
    }

    addMarker(newMarker: Marker) {
        this.markers.push(newMarker);
    }

    clearCoordsMarkers() {
        this.clickCoords = new LngLat(0, 0);
        this.markers.length = 0;
    }

    setCurrEditingLayer(id: string) {
        this.currEditingLayer = id;
    }
}