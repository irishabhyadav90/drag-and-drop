// src/components/CollapsibleList.js
import React, { useState } from 'react';
import { useDrag } from 'react-dnd';

const CollapsibleList = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'TABLE',
    item: { id: item.id, name: item.name },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`p-2 ${isDragging ? 'opacity-50' : 'opacity-100'}`}>
      <div
        ref={drag}
        className="flex items-center cursor-pointer"
        onClick={handleToggle}
      >
        {item.children && (
          <span className="mr-2">{isOpen ? '-' : '+'}</span>
        )}
        <span>{item.name}</span>
      </div>
      {isOpen && item.children && (
        <div className="ml-4">
          {item.children.map((child) => (
            <CollapsibleList key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollapsibleList;
