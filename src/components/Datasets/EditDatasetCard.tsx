import { observer } from "mobx-react";
import { MapStore } from "./MapStore";
import { SaveDatasetModal } from './SaveDatasetModal';

type EditDatasetCardProps = {
    mapStore: MapStore
}

export const EditDatasetCard = observer(({ mapStore }: EditDatasetCardProps) : React.JSX.Element => {
    return (
        <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <a href="#">
                <h5 className="mb-2 text-sm font-bold tracking-tight text-gray-900 dark:text-white">Customising: {mapStore.currEditingLayer} Layer</h5>
            </a>
            <p className="mb-3 text-sm font-normal text-gray-700 dark:text-gray-400">{mapStore.markers.length} features added</p>
            <button data-modal-target="save-dataset-modal" data-modal-toggle="popup-modal" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                Save
            </button>
            <a href="#" className="py-2 px-4 ms-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                Cancel
            </a>

            <div id="save-dataset-modal" tabIndex={-1} className='hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"'>
                <SaveDatasetModal />
            </div>
        </div>
    )
})