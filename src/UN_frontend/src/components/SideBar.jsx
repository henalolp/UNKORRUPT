// src/components/Sidebar.jsx
import React from "react";
import { FaHome, FaCommentDots, FaClipboardList, FaCog,FaQuestionCircle } from "react-icons/fa";
import "./Sidebar.css"; // Make sure to create and style this file
// import ReportForm from "../routes/ReportForm";
import { NavLink } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";

const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* <a href="/" className="sidebar-icon">
        <FaHome />
      </a>
      <a href="/coursePage" className="sidebar-icon">
        <FaCommentDots />
      </a>
      <a href="/reportForm" className="sidebar-icon">
        <FaClipboardList />
      </a>
      <a href="/settings" className="sidebar-icon">
        <FaCog />
      </a> */}


      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : undefined}>
        <i className="sidebar-icon"></i> <FaHome style={{ color: "#FFFFFF" }}  />
      </NavLink>
      <NavLink to="/coursePage" className={({ isActive }) => isActive ? 'active' : undefined}>
        <i className="sidebar-icon"></i> <FaCommentDots style={{ color: "#FFFFFF" }}/>
      </NavLink>
      <NavLink to="/quizPage" className={({ isActive }) => isActive ? 'active' : undefined}>
        <i className="sidebar-icon"></i> <FaQuestionCircle style={{ color: "#FFFFFF" }}/>
      </NavLink>
      <NavLink to="/reportForm" className={({ isActive }) => isActive ? 'active' : undefined}>
        <i className="sidebar-icon"></i> <FaClipboardList style={{ color: "#FFFFFF" }}/>
      </NavLink>
      <NavLink to="/profilePage" className={({ isActive }) => isActive ? 'active' : undefined}>
        <i className="sidebar-icon"></i> <CgProfile style={{ color: "#FFFFFF" }}/>
      </NavLink>
    </div>
  );
};

export default Sidebar;
