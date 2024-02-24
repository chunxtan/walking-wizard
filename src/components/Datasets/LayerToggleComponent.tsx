import React, { useState } from 'react';
import "./LayerToggleComponent.css"
import { observer } from 'mobx-react';
import { Dropdown } from 'flowbite-react';
import { Toast } from 'flowbite-react';
import { HiCheck } from 'react-icons/hi';
import { MapStore } from './MapStore';

interface LayerToggleProps {
  id: string;
  active: boolean;
  onToggle: (id: string, toggleType: "vis" | "edit") => void;
  isUserCreated: boolean;
  backendId: string;
  mapStore: MapStore;
  deleteLayerSource: (id: string) => void;
}

const LayerToggleComponent: React.FC<LayerToggleProps> = observer(({ id, active, onToggle, isUserCreated, backendId, mapStore, deleteLayerSource }) => {

    const [showToast, setShowToast] = useState<boolean>(false);

    const getLayerIdx = (): number => {
        const layerIdx = mapStore.layers.findIndex((layer) => {
            layer.layerId === id;
        })
        return layerIdx;
    }

    const handleDeleteDataset = async () :Promise<void> => {
        try {
            const res = await fetch(`http://localhost:3000/datasets/delete/${backendId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (res.ok) {
                console.log('Dataset deleted.');

                // show toast
                setShowToast(true);

                setTimeout(() => {
                  setShowToast(false);
                  // remove from map
                  deleteLayerSource(id);
  
                  // remove from mapStore.layers
                  const updatedLayers = [...mapStore.layers];
                  updatedLayers.splice(getLayerIdx(), 1);
                  mapStore.setLayerProps(updatedLayers);
                }, 1000);

            }
        } catch(err) {
            console.error(err);
        }
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
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path fillRule="evenodd" d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l10.5 10.5a.75.75 0 1 0 1.06-1.06l-1.322-1.323a7.012 7.012 0 0 0 2.16-3.11.87.87 0 0 0 0-.567A7.003 7.003 0 0 0 4.82 3.76l-1.54-1.54Zm3.196 3.195 1.135 1.136A1.502 1.502 0 0 1 9.45 8.389l1.136 1.135a3 3 0 0 0-4.109-4.109Z" clipRule="evenodd" />
                                <path d="m7.812 10.994 1.816 1.816A7.003 7.003 0 0 1 1.38 8.28a.87.87 0 0 1 0-.566 6.985 6.985 0 0 1 1.113-2.039l2.513 2.513a3 3 0 0 0 2.806 2.806Z" />
                            </svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                                <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" />
                                <path fillRule="evenodd" d="M1.38 8.28a.87.87 0 0 1 0-.566 7.003 7.003 0 0 1 13.238.006.87.87 0 0 1 0 .566A7.003 7.003 0 0 1 1.379 8.28ZM11 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" clipRule="evenodd" />
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
                        <Dropdown.Item onClick={() => onToggle(id, "edit")}>Customise</Dropdown.Item>
                        {
                            isUserCreated
                            ? <Dropdown.Item onClick={() => handleDeleteDataset()}>Delete</Dropdown.Item>
                            : null
                        }
                    </Dropdown>
                </span>
                
                {   
                    showToast
                    ?
                    <div>
                        <Toast className="transition-opacity fixed flex items-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow bottom-5 left-5 dark:text-gray-400 dark:divide-gray-700 space-x dark:bg-gray-800" role="alert">
                            <div className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <HiCheck className="h-3 w-3" />
                            </div>
                            <div className="ml-3 text-xs font-normal">Dataset deleted successfully.</div>
                            <Toast.Toggle />
                        </Toast>
                    </div>
                    : null
                }
        </li>
  );
});

export default LayerToggleComponent;
