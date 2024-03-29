import React, { Dispatch, SetStateAction } from 'react';
import "./LayerToggleComponent.css"
import { observer } from 'mobx-react';
import { Dropdown } from 'flowbite-react';
import { MapStore } from './MapStore';
import { showToastMsg } from './Map';
import { LoginUserStore } from '../UserProfile/LoginSignUp/LoginUserStore';
import { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

interface LayerToggleProps {
  id: string;
  active: boolean;
  onToggle: (id: string, toggleType: "vis" | "edit") => void;
  isUserCreated: boolean;
  backendId: string;
  mapStore: MapStore;
  deleteLayerSource: (id: string) => void;
  setShowToast: Dispatch<SetStateAction<showToastMsg>>;
  userStore: LoginUserStore;
  getGeoJsonData: (id: string) => FeatureCollection<Geometry, GeoJsonProperties> | undefined
}

const LayerToggleComponent: React.FC<LayerToggleProps> = observer(({ id, active, onToggle, isUserCreated, backendId, mapStore, deleteLayerSource, setShowToast, userStore, getGeoJsonData }) => {

    const getLayerIdx = (): number => {
        const layerIdx = mapStore.layers.findIndex((layer) => {
            layer.layerId === id;
        })
        return layerIdx;
    }

    const handleDeleteDataset = (): void => {

        // show toast
        setShowToast({isShow: true, toastMsg: "Dataset successfully deleted."});

        setTimeout(() => {
          setShowToast({isShow: false, toastMsg: ""});
        }, 1500);

        // remove from map
        deleteLayerSource(id);

        // remove from mapStore.layers
        const updatedLayers = [...mapStore.layers];
        updatedLayers.splice(getLayerIdx(), 1);
        mapStore.setLayerProps(updatedLayers);

    }

    const submitDeleteDataset = async () :Promise<void> => {
        try {

            const token = localStorage.getItem('token'); // Retrieve the token from localStorage
            if (!token) throw new Error('Token not found');

            const res = await fetch(`https://walking-wizard-be.onrender.com/datasets/delete/${backendId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.ok) {
                console.log('Dataset deleted.');
                handleDeleteDataset();
            }

        } catch(err) {
            console.error(err);
        }
    }

    const downloadDataset = (id: string): void => {
        const geojsonData = getGeoJsonData(id);

        // Create a Blob object with the GeoJSON data
        const blob = new Blob([JSON.stringify(geojsonData, null, 2)], { type: 'application/json' });
      
        // Create a downloadable URL for the Blob
        const url = URL.createObjectURL(blob);
      
        // Simulate a click on a hidden anchor element to trigger download
        const link = document.createElement('a');
        link.href = url;
        link.download = `${id}_data.geojson`; // Set the desired filename
        link.click();
      
        // Revoke the object URL to avoid memory leaks
        URL.revokeObjectURL(url);
    }

    return (
        <li id="layer-toggle" className='flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group'>
                
                <span id="icon-slot">
                    <button className={active ? "active menu" : "menu"}
                        id={id}
                        onClick={() => onToggle(id, "vis")}>
                        {
                            active
                            ?
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="#1A56DB" className="w-4 h-4">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
                            </svg>
                            :
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z" clipRule="evenodd" />
                                <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                            </svg>
                        }
                    </button>
                </span>

                <span id="title-slot">
                    <p className='text-xs text-gray-900 dark:text-white'>{id.toUpperCase()}</p>
                </span>

                <span id="options-slot">
                    <Dropdown label="" dismissOnClick={false} renderTrigger={() => 
                        <button>                    
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                            <path d="M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM6.5 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0ZM12.5 6.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
                            </svg>
                        </button>}>
                        {
                            isUserCreated
                            ? <Dropdown.Item onClick={() => onToggle(id, "edit")}>Edit</Dropdown.Item>
                            : <Dropdown.Item onClick={() => onToggle(id, "edit")}>Customise</Dropdown.Item>
                        }
                        
                        {
                            isUserCreated
                            ? userStore.user 
                                ? <Dropdown.Item onClick={() => submitDeleteDataset()}>Delete</Dropdown.Item>
                                : <Dropdown.Item onClick={() => handleDeleteDataset()}>Remove</Dropdown.Item>
                            : null
                        }
                        <Dropdown.Item onClick={() => downloadDataset(id)}>Download</Dropdown.Item>
                    </Dropdown>
                </span>
                

        </li>
  );
});

export default LayerToggleComponent;
