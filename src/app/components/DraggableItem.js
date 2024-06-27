import React from 'react';
import { useDrag } from 'react-dnd';

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'TABLE',
    item: { ...item },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`p-2 border rounded ${isDragging ? 'opacity-50' : 'opacity-100'}`}
    >
      {item.name}
    </div>
  );
};

export default DraggableItem;
