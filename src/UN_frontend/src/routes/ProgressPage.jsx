import React from "react";
import { useNavigate } from "react-router-dom";
import "./progresspage.css";
import { FiArrowLeft } from "react-icons/fi";
import { BiMessageSquareDetail } from "react-icons/bi";
import Layout from "../components/Layout";

const ProgressPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Replace with the correct path to your courses page
  };

  return (
    <div className="everything">
      <Layout />
      <div className="progress-container">
        <div className="progress-header">
          <FiArrowLeft className="back-icon" onClick={handleBackClick} />
          <div className="profile-avatar"></div>
          <BiMessageSquareDetail className="message-icon" />
        </div>
        <h1>Varun Israni</h1>
        <div className="toggle-buttons">
          <button className="toggle-button active">Progress</button>
          <button className="toggle-button">Badges</button>
        </div>
        <div className="course-progress">
          <div className="course-item">
            <div className="progress-circle">
              <span>50%</span>
            </div>
            <p>Course 1</p>
          </div>
          <div className="course-item">
            <div className="progress-circle">
              <span>50%</span>
            </div>
            <p>Course 2</p>
          </div>
          <div className="course-item">
            <div className="progress-circle">
              <span>50%</span>
            </div>
            <p>Course 3</p>
          </div>
          <div className="course-item">
            <div className="progress-circle">
              <span>50%</span>
            </div>
            <p>Course 4</p>
          </div>
          <div className="course-item">
            <div className="progress-circle">
              <span>50%</span>
            </div>
            <p>Course 5</p>
          </div>
          <div className="course-item">
            <div className="progress-circle">
              <span>50%</span>
            </div>
            <p>Course 6</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProgressPage;
