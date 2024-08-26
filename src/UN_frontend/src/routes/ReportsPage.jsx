import React, { useEffect, useState } from 'react';
import './reportspage.css';
import Layout from '../components/Layout';
import repoot from '../assets/report1.svg'; // Assuming the path is correct
import { UN_backend } from '../../../declarations/UN_backend';
import { parseValues } from '../helper/parser';

const ReportsPage = () => {
  // Hardcoded data with the same image for all reports
  const [reports, setReports] = useState([]);
  const [upvotes, setUpvotes] = useState([]);

  const [activeTab, setActiveTab] = useState('New Reports'); // State to manage the active tab

  const handleLike = (id) => {
    setUpvotes({
      ...upvotes,
      [id]: upvotes[id] + 1,
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

  useEffect(() => {
    // Load reports
    async function load() {
      const response = await UN_backend.listReports('');
      console.log(response)
      setReports(await parseValues(response));
    }
    load();
  }, [])

  useEffect(() => {
    setUpvotes(reports.reduce((acc, report) => {
      acc[report.id] = report.upvotes || 0;
      return acc;
    }, {}))
  }, [reports])

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
                  <h3>{report.country}</h3>
                  <p>{report.category}</p>
                  <button className="like-button" onClick={() => handleLike(report.id)}>
                    👍 {upvotes[report.id]}
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
