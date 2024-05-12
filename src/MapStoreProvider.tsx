import { MapStore, mapStore } from "./components/Datasets/MapStore";
import React, { createContext, useContext, useState } from 'react';

interface MapStoreContext {
    mapStoreInstance: MapStore
}
export const MapStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mapStoreInstance, setMapStoreInstance] = useState(mapStore); // Create the single instance

  return (
    <MapStoreContext.Provider value={{ mapStoreInstance }}>
      {children}
    </MapStoreContext.Provider>
  );
};

export const useMapStore = (): MapStoreContext => {
  const store = useContext(MapStoreContext);
  if (!store) {
    throw new Error('useMapStore must be used within a MapStoreProvider');
  }
  return store;
};

const MapStoreContext = createContext<MapStoreContext | null>(null);

export default MapStoreContext;
