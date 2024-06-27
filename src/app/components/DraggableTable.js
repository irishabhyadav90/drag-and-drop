import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import DraggableItem from './DraggableItem';

const DraggableList = ({ section, moveItem, onItemMoved }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const [, drop] = useDrop({
    accept: 'TABLE',
    drop: (item) => {
      if (item.section !== section.id) {
        moveItem(item, section.id);
        onItemMoved(item, section.id);
      }
    },
  });

  return (
    <div ref={drop} className="p-2 border rounded mb-2">
      <div className="cursor-pointer" onClick={handleToggle}>
        <span>{isOpen ? '-' : '+'}</span> {section.name}
      </div>
      {isOpen && (
        <div className="pl-4">
          {section.children.map((child) => (
            <DraggableItem key={child.id} item={{ ...child, section: section.id }} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DraggableList;
