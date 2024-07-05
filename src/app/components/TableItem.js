// src/components/TableItem.js
import React, { useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { Resizable } from 'react-resizable';
import './styles.css'

const TableItem = ({ id, left, top, table, moveTable, removeTable, resizeTable }) => {
  const ref = useRef(null);
  const [isResizing, setIsResizing] = useState(false);

  const [, drop] = useDrop({
    accept: 'TABLE',
    hover: (item, monitor) => {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTable(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: 'TABLE',
    item: { id, left: left || 0, top: top || 0, ...table, from: 'grid' },
    canDrag: () => !isResizing,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const onResize = (e, { size }) => {
    // console.log("e", e, "size", size)
    resizeTable(id, size.width, size.height);
  };

  drag(ref);
  
  return (
  <Resizable
    width={table.width || 200}
    height={table.height || 100}
    onResize={onResize}
    onResizeStart={() => setIsResizing(true)}
    onResizeStop={() => setIsResizing(false)} 
  >
    <div
      ref={ref}
      data-id={id}
      className={`p-2 border rounded bg-white shadow-md ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      style={{ position: 'absolute', left: left || 5, top: top || 5, height: table.height, width: table.width }}
    >
      <div className="flex justify-between items-center border-b pb-2">
        <div className="text-xs text-black">{table.name}</div>
        <button
          onClick={() => removeTable(id)}
          className="text-red-500 font-bold cursor-pointer"
        >
          &times;
        </button>
      </div>
      <div className="text-sm pt-5">
        <div className="flex justify-between">
          <div className="font-bold text-black">Column</div>
          <div className="font-bold text-black ml-5">Data Type</div>
        </div>
        <div className="mt-2">
          <div className="flex justify-between border-t py-1">
            <div className="text-black text-xs">{table.name}</div>
            <div className="text-black text-xs">string</div>
          </div>
        </div>
      </div>
    </div>
    </Resizable>
  );
};

export default TableItem;
