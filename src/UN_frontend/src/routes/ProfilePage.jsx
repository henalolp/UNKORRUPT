import React from "react";
import "./profilepage.css";
import Sidebar from "../components/SideBar";
import { CiEdit } from "react-icons/ci";
import { IoSettingsOutline } from "react-icons/io5";
import { CiShare2 } from "react-icons/ci";
import { IoMdHelpCircleOutline } from "react-icons/io";

const ProfilePage = () => {
  return (
    <div className="profile-container">
      <Layout />
      <div className="profile-header">
        <div className="profile-avatar"></div>
        <h1>Varun Israni</h1>
        <p>soloxvofficial@gmail.com</p>
      </div>
      <div className="profile-options">
        <div>
          <CiEdit style={{ color: "#FF5349" }} />
          <button>
            <i className="icon icon-edit"></i> Edit Profile
          </button>
        </div>
        <div>
          <IoSettingsOutline style={{ color: "#FF5349" }} />
          <button>
            <i className="icon icon-settings"></i> Settings
          </button>
        </div>
        <div>
        <CiShare2  style={{ color: "#FF5349" }} />
          <button>
            <i className="icon icon-settings"></i> Invite a friend
          </button>
        </div>
        <div>
        <IoMdHelpCircleOutline  style={{ color: "#FF5349" }} />
          <button>
            <i className="icon icon-settings"></i> Help
          </button>
        </div>

        <button className="logout-button">
          <i className="icon icon-logout"></i> Log Out
        </button>
      </div>
     
    </div>
  );
};

export default ProfilePage;
