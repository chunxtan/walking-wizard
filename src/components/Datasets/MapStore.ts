type LayerVisibility = {
    [layerName: string]: boolean
}

export class MapStore {
    layerVisibility: LayerVisibility

    constructor() {
        this.layerVisibility = {}

    }

    setLayerVisibility(newVis: LayerVisibility) {
        this.layerVisibility = newVis;
    } 
}