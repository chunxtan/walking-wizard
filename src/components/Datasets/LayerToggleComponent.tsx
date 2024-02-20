import React from 'react';
import "./LayerToggleComponent.css"

interface LayerToggleProps {
  id: string;
  active: boolean;
  onToggle: (id: string) => void;
}

const LayerToggleComponent: React.FC<LayerToggleProps> = ({ id, active, onToggle }) => {
  return (
    <div id="layer-toggle">
        <input type="checkbox" defaultChecked className="checkbox checkbox-xs" /> 
        <button
        id={id}
        className={active ? "active menu" : "menu"}
        onClick={() => onToggle(id)}
        >
        {id}
        </button>
    </div>
  );
};

export default LayerToggleComponent;
