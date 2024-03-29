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
interface PopupListener {
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
    popupHandle: PopupListener | null;
    popup: mapboxgl.Popup | null;

    constructor() {
        this.layers = [];
        this.userCreatedBackendLayers = [];
        this.layersReady = false;
        this.clickCoords = new LngLat(0, 0);
        this.markers = [];
        this.currEditingLayer = null;
        this.deletedFeaturesMap = [];
        
        this.editHandle = null;
        this.popupHandle = null;

        this.popup = null;

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
            deletedFeaturesGeoJson: computed
        })
    }

    addLayer(newLayer: DatasetLayer) {
        this.layers.push(newLayer);
    }

    setLayerProps(updatedLayers: DatasetLayer[]) {
        this.layers = updatedLayers;
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
        return this.markers.map((marker) => {
            const {lng, lat} = marker.getLngLat() as LngLat;
            const randId = Math.random().toString(16).slice(2)
            const feature: Feature<Geometry, GeoJsonProperties> = {
                "type": "Feature",
                "properties": {
                    "Name": `userGenerated_${randId}`,
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

    get currEditingExtngLayerUpdateInput() {
        let output = { title: "", description: "" };
            const currEditingLayerObj = this.userCreatedBackendLayers.find(layer => layer.layerId === this.currEditingLayer);
            output = {
                title: currEditingLayerObj?.layerId || "",
                description: currEditingLayerObj?.description || "",
            }
        
        return output;
    }
    

}