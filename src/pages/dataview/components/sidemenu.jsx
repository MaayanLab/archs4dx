import React, { useState } from 'react';

export const SideMenu = () => {
  // Define a state to track which menus are open
  const [openMenus, setOpenMenus] = useState({});

  // Toggle the open state of a menu item
  const toggleMenu = (menuKey) => {
    setOpenMenus((prevOpenMenus) => ({
      ...prevOpenMenus,
      [menuKey]: !prevOpenMenus[menuKey],
    }));
  };

  // Example menu structure
  const menuData = [
    {
      title: 'Home',
      key: 'home',
      subMenu: [],
    },
    {
      title: 'Services',
      key: 'services',
      subMenu: [
        { title: 'Web Design', key: 'web-design' },
        { title: 'App Development', key: 'app-development' },
        { title: 'SEO', key: 'seo' },
      ],
    },
    {
      title: 'Products',
      key: 'products',
      subMenu: [
        {
          title: 'Software',
          key: 'software',
          subMenu: [
            { title: 'Product 1', key: 'product-1' },
            { title: 'Product 2', key: 'product-2' },
          ],
        },
        { title: 'Hardware', key: 'hardware' },
      ],
    },
    {
      title: 'Contact',
      key: 'contact',
      subMenu: [],
    },
  ];

  // Recursive function to render menu items
  const renderMenu = (items) => {
    return (
      <ul>
        {items.map((item) => (
          <li key={item.key}>
            <button onClick={() => toggleMenu(item.key)}>
              {item.title}{item.subMenu && item.subMenu.length > 0 ? (openMenus[item.key] ? ' -' : ' +') : ''}
            </button>
            {item.subMenu && openMenus[item.key] && renderMenu(item.subMenu)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="side-menu">
      {renderMenu(menuData)}
    </div>
  );
};

// Simple CSS for the side menu
export const Styles = () => (
  <style>{`
    .side-menu {
      width: 250px;
      background: #f4f4f4;
      padding: 10px;
    }
    .side-menu ul {
      list-style-type: none;
      padding-left: 10px;
    }
    .side-menu li {
      margin: 5px 0;
    }
    .side-menu button {
      background: none;
      border: none;
      color: #333;
      cursor: pointer;
      padding: 5px 0;
      text-align: left;
      width: 100%;
    }
  `}</style>
);