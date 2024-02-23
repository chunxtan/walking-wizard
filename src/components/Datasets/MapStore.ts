import { LngLat, Marker } from "mapbox-gl";

type LayerVisibility = {
    [layerName: string]: boolean
}

export class MapStore {
    layerVisibility: LayerVisibility;
    clickCoords: LngLat;
    // addedMarkers to be cleared after the edit function is complete/cancelled
    markers: Marker[];
    currEditingLayer: string;

    constructor() {
        this.layerVisibility = {};
        this.clickCoords = new LngLat(0, 0);
        this.markers = [];
        this.currEditingLayer = "";
    }

    setLayerVisibility(newVis: LayerVisibility) {
        this.layerVisibility = newVis;
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