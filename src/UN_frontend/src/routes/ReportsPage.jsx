import React, { useState } from 'react';
import './reportspage.css';
import Layout from '../components/Layout';
import repoot from '../../public/report1.svg'; // Assuming the path is correct

const ReportsPage = () => {
  // Hardcoded data with the same image for all reports
  const reports = [
    {
      id: 1,
      name: 'Over the Horizon',
      category: 'Photo',
      image: repoot,
      likes: 10,
    },
    {
      id: 2,
      name: 'Morning Dew',
      category: 'Photo',
      image: repoot,
      likes: 5,
    },
    {
      id: 3,
      name: 'Urban Exploration',
      category: 'Video',
      image: repoot,
      likes: 15,
    },
    {
      id: 4,
      name: 'Nature Sounds',
      category: 'Audio',
      image: repoot,
      likes: 20,
    },
  ];

  const initialLikes = reports.reduce((acc, report) => {
    acc[report.id] = report.likes || 0;
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
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-image">
                  <img src={report.image} alt={report.name} />
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
        {/* <div className="all-reports-section">
          <h3>All Reports</h3>
          <div className="reports-grid">
            {reports.map((report) => (
              <div key={report.id} className="report-card">
                <div className="report-image">
                  <img src={report.image} alt={report.name} />
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
        </div> */}
      </div>
    </div>
  );
};

export default ReportsPage;
