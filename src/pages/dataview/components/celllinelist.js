import React, { useState } from 'react';
import './celllinelist.css';
import menuData from './celllines.json';

export const CellLineList = ({ setSearchQuery, menuId = "menu-v2" }) => {
  const [hoveredIndices, setHoveredIndices] = useState({});

  const handleMouseEnter = (index) => {
    setHoveredIndices((prev) => ({ ...prev, [index]: true }));
  };

  const handleMouseLeave = (index) => {
    setHoveredIndices((prev) => ({ ...prev, [index]: false }));
  };


const fillExample = (term) => {
  setSearchQuery(term);
  console.log(`Example term: ${term}`);
};


  const renderMenuItems = (data, parentIndex = '0') =>
    data.map((item, index) => {
      const currentIndex = `${parentIndex}-${index}`;

      return (
        <li
          key={currentIndex}
          onMouseEnter={() => handleMouseEnter(currentIndex)}
          onMouseLeave={() => handleMouseLeave(currentIndex)}
        >
          <a>{item.title}</a>
          {item.examples && (
            <ul
              className="sub"
              style={{ display: hoveredIndices[currentIndex] ? 'block' : 'none' }}
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
          )}
        </li>
      );
    });

  return (
    <>
      <br />
      <h2>Cell Lines</h2>
      <ul id={menuId} className="menu-v2">
        {renderMenuItems(menuData, "0")}
      </ul>
    </>
  );
};