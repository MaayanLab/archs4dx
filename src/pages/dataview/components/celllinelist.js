import React, { useState } from 'react';
import './celllinelist.css';
import menuData from './celllines.json';
import menuDataMouse from './celllinesmouse.json';

export const CellLineList = ({ species, setSearchQuery, menuId = "menu-v2" }) => {
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

  const renderMenuItems = (data, parentIndex = '0') => {
    const filteredData = data.filter(item => item.examples && item.examples.length > 0);

    return filteredData.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;
      return (
        <li
          key={currentIndex}
          onMouseEnter={() => handleMouseEnter(currentIndex)}
          onMouseLeave={() => handleMouseLeave(currentIndex)}
        >
          <a>{item.title}</a>
          <ul
            className="sub"
            style={{ display: isOpen[currentIndex] ? 'block' : 'none' }}
          >
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
        </li>
      );
    });
  };

  return (
    <>
      <br />
      <h2>Cell Lines</h2>
      <ul id={menuId} className="menu-v2">
        {species === "human" ? renderMenuItems(menuData, "0") : renderMenuItems(menuDataMouse, "0")}
      </ul>
    </>
  );
};