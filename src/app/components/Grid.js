"use client";
import React, { useRef, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import TableItem from './TableItem';

const Grid = ({ gridItems, setGridItems, arrows, onDrop }) => {
  const containerRef = useRef(null);
  // const [gridItems, setGridItems] = useState([]);

  const getNextAvailablePosition = (items) => {
    const positions = items.map(item => ({ left: item.left, top: item.top }));
    const itemSize = 180;
    let left = 0;
    let top = 0;

    while (positions.some(pos => pos.left === left && pos.top === top)) {
      left += itemSize;
      if (left >= 4 * itemSize) {
        left = 0;
        top += itemSize;
      }
    }

    return { left, top };
  };

  
  const [, drop] = useDrop({
    accept: 'TABLE',
    drop: (item, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      const left = Math.round(item.left + delta.x);
      const top = Math.round(item.top + delta.y);
      
      const existingItem = gridItems.find(i => i.id === item.id);
      
      if (existingItem) {
        setGridItems(prevItems => prevItems.map(i => 
        i.id === item.id ? { ...i, left: left, top: top } : i
        ));
      } else {
        const { left: initialLeft, top: initialTop } = getNextAvailablePosition(gridItems);
        const newItem = { ...item, left: initialLeft, top: initialTop };
        setGridItems(prevItems => [...prevItems, newItem]);
        onDrop(newItem);
      }
    },
  }, [gridItems]);

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.querySelectorAll('svg').forEach(svg => svg.remove());

      arrows.forEach(({ from, to }) => {
        const fromElement = container.querySelector(`[data-id='${from}']`);
        const toElement = container.querySelector(`[data-id='${to}']`);

        if (fromElement && toElement) {
          const fromRect = fromElement.getBoundingClientRect();
          const toRect = toElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          const corners = [
            { x: fromRect.left - containerRect.left, y: fromRect.top - containerRect.top },
            { x: fromRect.right - containerRect.left, y: fromRect.top - containerRect.top },
            { x: fromRect.left - containerRect.left, y: fromRect.bottom - containerRect.top },
            { x: fromRect.right - containerRect.left, y: fromRect.bottom - containerRect.top },
          ];

          const targetCorners = [
            { x: toRect.left - containerRect.left, y: toRect.top - containerRect.top },
            { x: toRect.right - containerRect.left, y: toRect.top - containerRect.top },
            { x: toRect.left - containerRect.left, y: toRect.bottom - containerRect.top },
            { x: toRect.right - containerRect.left, y: toRect.bottom - containerRect.top },
          ];

          let minDistance = Infinity;
          let startCorner = corners[0];
          let endCorner = targetCorners[0];

          corners.forEach(corner => {
            targetCorners.forEach(targetCorner => {
              const distance = Math.sqrt(
                Math.pow(corner.x - targetCorner.x, 2) + Math.pow(corner.y - targetCorner.y, 2)
              );
              if (distance < minDistance) {
                minDistance = distance;
                startCorner = corner;
                endCorner = targetCorner;
              }
            });
          });

          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.style.position = 'absolute';
          svg.style.left = 0;
          svg.style.top = 0;
          svg.style.width = '100%';
          svg.style.height = '100%';
          svg.style.pointerEvents = 'none'; 

          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          const d = `
            M ${startCorner.x},${startCorner.y}
            C ${startCorner.x + 50},${startCorner.y} ${endCorner.x - 50},${endCorner.y} ${endCorner.x},${endCorner.y}
          `;

          path.setAttribute('d', d);
          path.setAttribute('stroke', 'red');
          path.setAttribute('stroke-width', '2');
          path.setAttribute('fill', 'none');

          const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('cx', startCorner.x);
          dot.setAttribute('cy', startCorner.y);
          dot.setAttribute('r', '9');
          dot.setAttribute('fill', 'blue');

          const arrow = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
          const arrowSize = 6;
          const angle = Math.atan2(endCorner.y - startCorner.y, endCorner.x - startCorner.x);
          const arrowPoints = [
            [endCorner.x, endCorner.y],
            [endCorner.x - arrowSize * Math.cos(angle - Math.PI / 6), endCorner.y - arrowSize * Math.sin(angle - Math.PI / 6)],
            [endCorner.x - arrowSize * Math.cos(angle + Math.PI / 6), endCorner.y - arrowSize * Math.sin(angle + Math.PI / 6)],
          ].map(p => p.join(',')).join(' ');

          arrow.setAttribute('points', arrowPoints);
          arrow.setAttribute('fill', 'red');

          svg.appendChild(path);
          svg.appendChild(dot);
          svg.appendChild(arrow);
          container.appendChild(svg);
        }
      });
    }
  }, [arrows, gridItems]);

  const moveTable = (dragIndex, hoverIndex) => {
    const draggedItem = gridItems[dragIndex];
    const newGridItems = [...gridItems];
    newGridItems.splice(dragIndex, 1);
    newGridItems.splice(hoverIndex, 0, draggedItem);
    setGridItems(newGridItems);
  };

  const removeTable = (id) => {
    setGridItems(prevItems => prevItems.filter(item => item.id !== id));
  };


  return (
    <div 
    ref={(node) => {
      drop(node); 
      containerRef.current = node;
    }} 
     className="relative w-full h-full p-4 border rounded">
      {gridItems.map((table, index) => (
        <TableItem
          key={table.id}
          id={table.id}
          left={table.left}
          top={table.top}
          table={table}
          moveTable={moveTable}
          index={index}
          removeTable={removeTable}
        />
      ))}
    </div>
  );
};

export default Grid;
