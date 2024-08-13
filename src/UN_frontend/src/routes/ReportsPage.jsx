import React from 'react';
import './reportspage.css'; // CSS for styling the reports page

const ReportsPage = ({ reports }) => {
  return (
    <div className="reports-container">
      <h2>Reports</h2>
      {reports.length > 0 ? (
        <div className="reports-grid">
          {reports.map((report) => (
            <div key={report.id} className="report-card">
              <div className="report-image">
                {report.image && <img src={URL.createObjectURL(report.image)} alt="Report" />}
              </div>
              <div className="report-details">
                <h3>{report.name}</h3>
                <p>{report.category}</p>
                <p>{report.details}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default ReportsPage;
