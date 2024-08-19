import React, { useState } from 'react';
import './reportspage.css';
import Layout from '../components/Layout';

const ReportsPage = ({ reports = [] }) => {
  // Initial likes state
  const initialLikes = reports.reduce((acc, report) => {
    acc[report.id] = report.likes || 0; // Default to 0 if no likes property exists
    return acc;
  }, {});

  const [likes, setLikes] = useState(initialLikes);

  const handleLike = (id) => {
    setLikes({
      ...likes,
      [id]: likes[id] + 1,
    });
  };

  return (
    <div className="all-reports">
      <Layout />
      <div className="reports-cont">
        <h2>Reports!</h2>
        <div className="report-tabs">
          <span className="active-tab">New Reports</span>
          <span>All Reports</span>
          <span>Analytics</span>
        </div>
        <div className="new-reports-section">
          <div className="reports-grid">
            {reports.slice(0, 2).map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-image">
                  {report.image && <img src={URL.createObjectURL(report.image)} alt="Report" />}
                </div>
                <div className="report-details">
                  <h3>{report.name}</h3>
                  <p>{report.category}</p>
                  <button className="like-button" onClick={() => handleLike(report.id)}>
                    👍 {likes[report.id]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="all-reports-section">
          <h3>All Reports</h3>
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-image">
                  {report.image && <img src={URL.createObjectURL(report.image)} alt="Report" />}
                </div>
                <div className="report-details">
                  <h3>{report.name}</h3>
                  <p>{report.category}</p>
                  <button className="like-button" onClick={() => handleLike(report.id)}>
                    👍 {likes[report.id]}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
