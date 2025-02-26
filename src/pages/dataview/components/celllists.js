import React, { useState } from 'react';
import './celllists.css';
import menuData from './celltypes.json';

export const CellList = ({ setSearchQuery, menuId = "menu-v1" }) => {
  const [hoveredIndices, setHoveredIndices] = useState({});
  const [isOpen, setIsOpen] = useState({});

  const handleMouseEnter = (index) => {
    setHoveredIndices((prev) => ({ ...prev, [index]: true }));
    setIsOpen((prev) => ({ ...prev, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setHoveredIndices((prev) => ({ ...prev, [index]: false }));
    setIsOpen((prev) => ({ ...prev, [index]: false })); // Close the specific submenu
  };

  const fillExample = (term) => {
    setSearchQuery(term);
    setIsOpen({}); // Close all submenus
    setHoveredIndices({}); // Reset hover states
    console.log(`Example term: ${term}`);
  };

  const renderMenuItems = (data, parentIndex) =>
    data.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;
    
      return (
        <li
          key={currentIndex}
          onMouseEnter={() => handleMouseEnter(currentIndex)}
          onMouseLeave={() => handleMouseLeave(currentIndex)}
        >
          <a>{item.title}</a>
          {item.subcategories ? (
            <ul className="sub" style={{ display: isOpen[currentIndex] ? 'block' : 'none' }}>
              {renderMenuItems(item.subcategories, currentIndex)}
            </ul>
          ) : (
            <ul className="sub" style={{ display: isOpen[currentIndex] ? 'block' : 'none' }}>
              {item.examples.map((example, i) => (
                <li key={`${currentIndex}-${i}`}>
                  <a
                    className="exampleTerm"
                    onClick={() => fillExample(example)}
                  >
                    {example}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </li>
      );
    });

  return (
    <>
      <br />
      <h2>Tissue Types</h2>
      <ul id={menuId} className="menu-v">
        {renderMenuItems(menuData, "0")}
      </ul>
    </>
  );
};