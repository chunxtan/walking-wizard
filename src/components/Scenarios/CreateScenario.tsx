import { Button, TextInput } from "flowbite-react"
import { SidebarMode } from "./Scenarios"
import { Label, Select } from "flowbite-react";
import { mapStore } from "../Datasets/MapStore";
import { useState } from "react";
import { LoginUserStore } from "../UserProfile/LoginSignUp/LoginUserStore";
import { getToken } from "../../util/security";
import { patchBackendData } from "../Datasets/Map";
import { DATASETID_LOOKUP } from "../Datasets/EditDatasetCard";
import { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import { saveAs } from "file-saver";
import JSZip from "jszip";

type CreateScenarioProps = {
    setSidebarMode: (mode: SidebarMode) => void,
    userStore: LoginUserStore
}

type SelectedDatasetIds = {
    origin: string,
    dest: string,
    network: string
}

export const CreateScenario = ({ setSidebarMode, userStore }: CreateScenarioProps): React.JSX.Element => {
    const layerIdsTemp = ["hdb", 'preschools', "mrt"];

    const [nameInput, setNameInput] = useState<string>("");
    const handleInputChange = (evt: React.FormEvent<HTMLInputElement>) => {
        setNameInput(evt.currentTarget.value);
    }

    const [selDatasetIds, setSelDatasetIds] = useState<SelectedDatasetIds>({origin: "hdb", dest: "hdb", network: "network"});
    const handleOnSel = (evt: React.SyntheticEvent<HTMLSelectElement> ) => {
        setSelDatasetIds({
            ...selDatasetIds,
            [evt.currentTarget.id]: evt.currentTarget.value
        })
    }

    const prepareDatasets = () => {
        // initialise variable to store geojsons
        let selDatasets = new Map();
        Object.values(selDatasetIds).forEach(async (id) => {
            // check if baseLayer or userCreated
            const mapStoreLayer = mapStore.layers.find(layer => layer.layerId === id);
            if (mapStoreLayer?.isUserCreated) {

                if (userStore.user) {
                    const token = getToken();
                    
                    try {
                        // retrieve geojson from backend
                        const res = await fetch(`https://walking-wizard-be.onrender.com/datasets/show/${mapStoreLayer.backendId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            }
                        })

                        if (res.ok) {
                            // patch userCreated geojson with base geojson
                            const dataset = await res.json();
                            const geoJsonData = patchBackendData(dataset.parentLayerId, dataset.newFeatures, dataset.deletedFeatures);
                            selDatasets.set(id, geoJsonData);
                        }

                    } catch(err) {
                        console.error(err)
                    }

                } else {
                    console.error("You must be logged in to access this resource.")
                }
            } else {
                // retrieve base geojsons
                const geoJsonData = DATASETID_LOOKUP[id];
                selDatasets.set(id, geoJsonData);
            }
        })
        
        return selDatasets;
    }

    // download zipped file of all selected datasets
    const downloadInputFiles = (selDatasets: Map<string, FeatureCollection<Geometry, GeoJsonProperties>>) => {
        const zip = new JSZip();
        for (const key of selDatasets.keys()) {
            const filename = key.concat(".geojson");
            zip.file(filename, JSON.stringify(selDatasets.get(key)));
        }
        zip.generateAsync({type: "blob"}).then(blob => {
            saveAs(blob, `${nameInput}.zip`)
        })
    }

    // onClick
    // get backendIds of selected datasets
    // store geojson of each in variable
    // zip together and download
    const runAnalysis = () => {
        const selDatasets = prepareDatasets();
        downloadInputFiles(selDatasets);
    }

    // next:
    // apply atos equation to jupyter notebook code
    // add score column
    // build upload tool 
    // apply symbology to incoming layer

    // to fix:
    // why cant i fetch layerId from mapStore
    // fix api gateway / ec2 instance / lambda function
    

    return (
        <div id='menu' className="space-y-2 font-medium">
            Create new scenario

            <div>
                <div className="max-w-md">
                <div className="mb-2 block">
                    <Label htmlFor="origin" value="Origin dataset" />
                </div>
                <Select id="origin" required value={selDatasetIds.origin} onChange={handleOnSel}>
                    {layerIdsTemp.map((l) => (<option key={l}>{l}</option>))}
                </Select>
                </div>

                <div className="max-w-md">
                <div className="mb-2 block">
                    <Label htmlFor="dest" value="Destination dataset" />
                </div>
                <Select id="dest" required value={selDatasetIds.dest} onChange={handleOnSel}>
                    {layerIdsTemp.map((l) => (<option key={l}>{l}</option>))}
                </Select>
                </div>

                <div className="max-w-md">
                <div className="mb-2 block">
                    <Label htmlFor="network" value="Network dataset" />
                </div>
                <Select id="network" required value={selDatasetIds.network} onChange={handleOnSel}>
                    <option key=''>network</option>
                </Select>
                </div>
                <form className="flex max-w-md flex-col gap-4">
                    <div>
                        <div className="mb-2 block">
                        <Label htmlFor="scenario-name" value="Output Name" />
                        </div>
                        <TextInput id="scenario-name" type="text" placeholder="TEST01" value={nameInput} onChange={handleInputChange} required />
                    </div>
                </form>
            </div>

            <div className="flex flex-wrap items-start gap-2" style={{ justifyContent:"center" }}>
                <Button size="xs" outline color="blue" onClick={() => setSidebarMode("view")}>Cancel</Button>
                <Button size="xs" color="blue" onClick={() => runAnalysis()}>Run</Button>
            </div>
        </div>
    )
}