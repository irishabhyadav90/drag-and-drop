"use client"
import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import DraggableTable from './components/DraggableTable';
import Grid from './components/Grid';
import { tables as initialTables } from './components/data';

export default function Home() {
  const [tables, setTables] = useState(initialTables);
  const [gridItems, setGridItems] = useState([]);
  const [arrows, setArrows] = useState([]);

  const moveItem = (item, newSectionId) => {
    setTables((prevTables) => {
      const newTables = [...prevTables];
      const oldSection = newTables.find((section) => section.children.some((child) => child.id === item.id));
      const newSection = newTables.find((section) => section.id === newSectionId);

      if (oldSection && newSection) {
        const movedItem = oldSection.children.find((child) => child.id === item.id);
        oldSection.children = oldSection.children.filter((child) => child.id !== item.id);
        newSection.children.push({ ...movedItem, section: newSectionId });
        
        const matchingItem = gridItems.find((gridItem) => gridItem.pointer === item.pointer && gridItem.section !== item.section);
        if (matchingItem) {
          setArrows((prevArrows) => [
            ...prevArrows,
            { from: matchingItem.id, to: item.id },
          ]);
        }
      }

      return newTables;
    });
  };

  const onItemMoved = (item, newSectionId) => {
    const existingGridItem = gridItems.find((gridItem) => gridItem.id === item.id);
    if (existingGridItem) {
      setArrows((prevArrows) => [
        ...prevArrows,
        { from: existingGridItem.id, to: newSectionId },
      ]);
    }
  };


  const handleDrop = (item) => {
    const existingItem = gridItems.find((gridItem) => gridItem.id === item.id);
    if (!existingItem) {
      const newItem = {
        ...item
        // section: item.id.split('_')[0]
      };
      setGridItems([...gridItems, newItem]);
      const matchingItem = gridItems.find((gridItem) => gridItem.pointer === item.pointer && gridItem.section === newItem.section);
      if (matchingItem) {
        setArrows([...arrows, { from: matchingItem.id, to: newItem.id }]);
      }
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen p-4">
       <div className="w-1/4 p-4 border rounded overflow-y-auto">
          {tables.map((section) => (
            <DraggableTable key={section.id} section={section} moveItem={moveItem} onItemMoved={onItemMoved} />
          ))}
        </div>
        <div className="w-3/4 p-4 border rounded relative">
          <Grid gridItems={gridItems} setGridItems={setGridItems} arrows={arrows} onDrop={handleDrop} />
        </div>
      </div>
    </DndProvider>
  );
}
