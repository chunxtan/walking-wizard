import { Feature, Geometry, GeoJsonProperties } from "geojson";
import { LngLat, Marker } from "mapbox-gl";
import { action, computed, makeObservable, observable } from "mobx";


export type DatasetLayer = { 
    layerId: string, 
    visibility: 'visible' | 'none',
    parentLayerId?: string,
    isEditing: boolean,
    isUserCreated: boolean
    backendId: string
}

export type UserCreatedDatasetLayer = {
    layerId: string,
    description: string,
    newFeatures: Feature<Geometry, GeoJsonProperties>[],
    deletedFeatures: Feature<Geometry, GeoJsonProperties>[],
    _id: string
}

export type FeatureId = string | number | undefined
export type DeletedFeatureMap = {
    featureId: FeatureId,
    feature: mapboxgl.MapboxGeoJSONFeature
}

interface MapEditListener {
    (ev: mapboxgl.MapMouseEvent & mapboxgl.EventData): void
  }

export class MapStore {
    layers: DatasetLayer[];
    userCreatedBackendLayers: UserCreatedDatasetLayer[];
    layersReady: boolean;
    clickCoords: LngLat;
    markers: Marker[];
    currEditingLayer: string | null;
    deletedFeaturesMap: DeletedFeatureMap[];
    editHandle: MapEditListener | null;

    constructor() {
        this.layers = [];
        this.userCreatedBackendLayers = [];
        this.layersReady = false;
        this.clickCoords = new LngLat(0, 0);
        this.markers = [];
        this.currEditingLayer = null;
        this.deletedFeaturesMap = [];
        
        this.editHandle = null;

        makeObservable(this, {
            layers: observable,
            layersReady: observable,
            markers: observable,
            currEditingLayer: observable,
            deletedFeaturesMap: observable,
            userCreatedBackendLayers: observable,
            addLayer: action,
            setLayerProps: action,
            setUserCreatedBackendLayers: action,
            setMarkers: action,
            toggleLayersReady: action,
            clearCoordsMarkers: action,
            setCurrEditingLayer: action,
            setDeletedFeaturesMap: action,
            totalEditingLayers: computed,
            markersGeoJson: computed,
            markersLngLat: computed,
            deletedFeaturesId: computed,
            deletedFeaturesNum: computed,
            deletedFeaturesGeoJson: computed,
            userCreatedBackendLayersNewFeatures: computed
        })
    }

    addLayer(newLayer: DatasetLayer) {
        this.layers.push(newLayer);
    }

    setLayerProps(updatedLayers: DatasetLayer[]) {
        this.layers = updatedLayers;
    } 

    addUserCreatedBackendLayers(newLayer: UserCreatedDatasetLayer) {
        this.userCreatedBackendLayers.push(newLayer);
    }

    setUserCreatedBackendLayers(updatedLayers: UserCreatedDatasetLayer[]) {
        this.userCreatedBackendLayers = updatedLayers;
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

    get layerIds() {
        return this.layers.map((layer) => {
            return layer.layerId;
        })
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

    setDeletedFeaturesMap(updatedDeletedFeatures: DeletedFeatureMap[]) {
        this.deletedFeaturesMap = updatedDeletedFeatures;
    }

    get deletedFeaturesId() {
        return this.deletedFeaturesMap.map(feature => feature.featureId);
    }

    get deletedFeaturesGeoJson(): Feature<Geometry, GeoJsonProperties>[] {
        return this.deletedFeaturesMap.map((deletedFeature) => {
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
        return this.deletedFeaturesMap.map((deletedFeature) => {
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
        return this.deletedFeaturesMap.length;
    }

    get isCurrEditingLayerUserCreated(): boolean {
        const layerIdx = this.layers.findIndex(layer => layer.layerId === this.currEditingLayer);
        const currLayer = this.layers[layerIdx];
        return currLayer.isUserCreated;
    }

    get userCreatedBackendLayersNewFeatures(): Feature<Geometry, GeoJsonProperties>[] {
        const output: Feature<Geometry, GeoJsonProperties>[] = [];
        this.userCreatedBackendLayers.forEach(layer => {
            output.concat(layer.newFeatures);
        })

        return output;
    }

}