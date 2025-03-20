import React from 'react';
import './news-feed.css';

export const NewsFeed = () => {
  return (
    <div id="newsfeed">
      <ul id="newsfeed-v1">
      <li style={{ '--accent-color': '#4CADAD' }}>
          <div className="date">Update: 2025-3-20</div>
          <div className="descr">The  <a href="https://github.com/MaayanLab/archs4r" target="_blank">archs4r</a> R package is now available allowing seamless access to gene count data.</div>
      </li>
      <li style={{ '--accent-color': '#4CADAD' }}>
          <div className="date">Update: 2024-12-21</div>
          <div className="descr">New web-portal is now online. It supports a new data visualization, dynamic data extraction, signature search, and context specific gene correlation identification.</div>
      </li>
      <li style={{ '--accent-color': '#4CADAD' }}>
          <div className="date">Update: 2024-12-20</div>
          <div className="descr">Data release v2.6 is now available in the download section. ARCHS4 now covers 922000 human and 1040000 mouse samples.</div>
        </li>
        <li style={{ '--accent-color': '#4CADAD' }}>
          <div className="date">Update: 2024-9-4</div>
          <div className="descr">Transcript level data is now available for data release v9.</div>
        </li>
        <li style={{ '--accent-color': '#41516C' }}>
          <div className="date">Update: 2024-7-12</div>
          <div className="descr">New ARCHS4 data update is now available for <a href="\download">download</a> The ARCHS4 data now covers 980,000 mouse and 880,000 human samples.</div>
        </li>
        <li style={{ '--accent-color': '#FBCA3E' }}>
          <div className="date">Update: 2023-9-8</div>
          <div className="descr">The  <a href="https://github.com/MaayanLab/archs4py" target="_blank">archs4py</a> Python package is now available allowing seamless access to gene count data.</div>
        </li>
        <li style={{ '--accent-color': '#E24A68' }}>
          <div className="date">Update: 2023-7-23</div>
          <div className="descr">New ARCHS4 data (v2) release with updated Ensembl annotation 107.</div>
        </li>
      </ul>
      
    </div>
  );
}
