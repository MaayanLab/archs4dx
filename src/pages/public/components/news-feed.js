import React from 'react';
import './news-feed.css'; // Import your CSS file

export const NewsFeed = () => {
  return (
    <div id="newsfeed">
      <ul>
        <li style={{ '--accent-color': '#4CADAD' }}>
          <div className="date">Update: 2024-9-4</div>
          <div className="descr">Transcript level data is now available for data release v9.</div>
        </li>
        <li style={{ '--accent-color': '#41516C' }}>
          <div className="date">Update: 2024-7-12</div>
          <div className="descr">New ARCHS4 data update is now available for  <a href="\download">downloadad</a> The ARCHS4 data now covers 980,000 mouse and 880,000 human samples.</div>
        </li>
        <li style={{ '--accent-color': '#FBCA3E' }}>
          <div className="date">Update: 2023-9-8</div>
          <div className="descr">The  <a href="\download">archs4py</a> Python package is now available allowing seamless access to gene count data.</div>
        </li>
        <li style={{ '--accent-color': '#E24A68' }}>
          <div className="date">Update: 2023-7-23</div>
          <div className="descr">New ARCHS4 data (v2) release with updated Ensembl annotation 107.</div>
        </li>
        <li style={{ '--accent-color': '#1B5F8C' }}>
          <div className="date">Update: 2017</div>
          <div className="descr">Lorem ipsum dolor, sit amet consectetur adipisicing elit. Impedit, cumque.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2022</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2021</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2020</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2019</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2018</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2017</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>
        <li style={{ '--accent-color': '#dddddd' }}>
          <div className="date">2016</div>
          <div className="descr">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, non.</div>
        </li>

      </ul>
      
    </div>
  );
}
