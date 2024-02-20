import React from 'react';

interface LayerToggleProps {
  id: string;
  active: boolean;
  onToggle: (id: string) => void;
}

const LayerToggleComponent: React.FC<LayerToggleProps> = ({ id, active, onToggle }) => {
  return (
    <button
      id={id}
      className={active ? "active menu" : "menu"}
      onClick={() => onToggle(id)}
    >
      {id}
    </button>
  );
};

export default LayerToggleComponent;
