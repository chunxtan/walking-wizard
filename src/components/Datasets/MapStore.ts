import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { LngLat, Marker } from "mapbox-gl";
import { action, computed, makeObservable, observable } from "mobx";


export type DatasetLayer = { 
    layerId: string, 
    visibility: 'visible' | 'none',
    isEditing: boolean,
    isUserCreated: boolean
    backendId: string
}

export class MapStore {
    layers: DatasetLayer[];
    layersReady: boolean;
    clickCoords: LngLat;
    markers: Marker[];
    currEditingLayer: string | null;

    constructor() {
        this.layers = [];
        this.layersReady = false;
        this.clickCoords = new LngLat(0, 0);
        this.markers = [];
        this.currEditingLayer = null;

        makeObservable(this, {
            layers: observable,
            layersReady: observable,
            markers: observable,
            currEditingLayer: observable,
            addLayer: action,
            setLayerProps: action,
            setMarkers: action,
            toggleLayersReady: action,
            clearCoordsMarkers: action,
            setCurrEditingLayer: action,
            totalEditingLayers: computed,
            markersGeoJson: computed,
            markersLngLat: computed
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

    get editingLayers() {
        const editingLayer: DatasetLayer[] = [];
        this.layers.forEach((layer) => {
            if (layer.isEditing) {
                editingLayer.push(layer);
            }
        })
        return editingLayer;
        
    }

    get totalEditingLayers() {
        const editingLayer = this.editingLayers;
        return editingLayer.length;
    }

    setClickCoords(coords: LngLat) {
        this.clickCoords = coords;
    }

    setMarkers(updatedMarkers: Marker[]) {
        this.markers = updatedMarkers;
    }

    clearCoordsMarkers() {
        this.clickCoords = new LngLat(0, 0);
        this.markers.length = 0;
    }

    setCurrEditingLayer(id: string | null) {
        this.currEditingLayer = id;
    }

    get markersGeoJson() {
        return this.markers.map((marker, idx) => {
            const {lng, lat} = marker.getLngLat() as LngLat;
            return {
                "type": "Feature",
                "properties": {
                    "Name": `userGenerated_${idx}`,
                    "Description": "",
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                }
            } as Feature<Geometry, GeoJsonProperties>;
        })
    }

    get markersLngLat() {
        return this.markers.map((marker) => {
            return marker.getLngLat();
        })
    }
}