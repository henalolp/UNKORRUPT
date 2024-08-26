import React, { useState } from 'react';
import './reportspage.css';
import Layout from '../components/Layout';
import repoot from '../assets/report1.svg'; // Assuming the path is correct

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

  const [activeTab, setActiveTab] = useState('New Reports'); // State to manage the active tab

  const handleLike = (id) => {
    setLikes({
      ...likes,
      [id]: likes[id] + 1,
    });
  };

  const renderReports = () => {
    switch (activeTab) {
      case 'New Reports':
        return reports.slice(0, 2); // Show only the first two reports
      case 'All Reports':
        return reports; // Show all reports
      case 'Analytics':
        return []; // No reports to show for analytics (can be updated based on actual requirement)
      default:
        return reports;
    }
  };

  return (
    <div className="all-reports">
      <Layout />
      <div className="reports-cont">
        <h2>Reports!</h2>
        <div className="report-tabs">
          <span
            className={activeTab === 'New Reports' ? 'active-tab' : ''}
            onClick={() => setActiveTab('New Reports')}
          >
            New Reports
          </span>
          <span
            className={activeTab === 'All Reports' ? 'active-tab' : ''}
            onClick={() => setActiveTab('All Reports')}
          >
            All Reports
          </span>
          <span
            className={activeTab === 'Analytics' ? 'active-tab' : ''}
            onClick={() => setActiveTab('Analytics')}
          >
            Analytics
          </span>
        </div>
        <div className="new-reports-section">
          <div className="reports-grid">
            {renderReports().map((report) => (
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
            {activeTab === 'Analytics' && (
              <p>No analytics available at the moment.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
