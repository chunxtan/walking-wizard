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

export type FeatureId = string | number | undefined
type deletedFeatures = {
    id: FeatureId,
    feature: mapboxgl.MapboxGeoJSONFeature
}

export class MapStore {
    layers: DatasetLayer[];
    layersReady: boolean;
    clickCoords: LngLat;
    markers: Marker[];
    currEditingLayer: string | null;
    deletedFeatures: deletedFeatures[];

    constructor() {
        this.layers = [];
        this.layersReady = false;
        this.clickCoords = new LngLat(0, 0);
        this.markers = [];
        this.currEditingLayer = null;
        this.deletedFeatures = [];

        makeObservable(this, {
            layers: observable,
            layersReady: observable,
            markers: observable,
            currEditingLayer: observable,
            deletedFeatures: observable,
            addLayer: action,
            setLayerProps: action,
            setMarkers: action,
            toggleLayersReady: action,
            clearCoordsMarkers: action,
            setCurrEditingLayer: action,
            setDeletedFeatures: action,
            totalEditingLayers: computed,
            markersGeoJson: computed,
            markersLngLat: computed,
            deletedFeaturesId: computed,
            deletedFeaturesNum: computed,
            deletedFeaturesGeoJson: computed
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

    get markersGeoJson(): Feature<Geometry, GeoJsonProperties>[] {
        return this.markers.map((marker, idx) => {
            const {lng, lat} = marker.getLngLat() as LngLat;
            const feature: Feature<Geometry, GeoJsonProperties> = {
                "type": "Feature",
                "properties": {
                    "Name": `userGenerated_${idx}`,
                    "Description": "",
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [lng, lat]
                }
            };
            return feature;
        })
    }

    get markersLngLat() {
        return this.markers.map((marker) => {
            return marker.getLngLat();
        })
    }

    setDeletedFeatures(updatedDeletedFeatures: deletedFeatures[]) {
        this.deletedFeatures = updatedDeletedFeatures;
    }

    get deletedFeaturesId() {
        return this.deletedFeatures.map(feature => feature.id);
    }

    get deletedFeaturesGeoJson(): Feature<Geometry, GeoJsonProperties>[] {
        return this.deletedFeatures.map((deletedFeature) => {
            const feature = deletedFeature.feature;
            const output: Feature<Geometry, GeoJsonProperties> = {
                "type": "Feature",
                "properties": feature.properties,
                "geometry": feature.geometry
            }

            return output;
        });
    }

    get deletedFeaturesNames(): string[] {
        return this.deletedFeatures.map((deletedFeature) => {
            const feature = deletedFeature.feature;
            let output;
            if (feature.properties) {
                output = feature.properties.Name
            } else {
                output = ""
            }
            return output;
        })
    }

    get deletedFeaturesNum() {
        return this.deletedFeatures.length;
    }
}