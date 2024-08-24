import React, { useState } from 'react';
import '../../src/ReportForm.css'; // Importing CSS for styling
import Layout from '../components/Layout';
import ReportsPage from './ReportsPage'; 


const ReportForm = () => {
  const [reports, setReports] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: '',
    details: '',
    image: null,
  });

  const handleChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.name && formData.email && formData.category && formData.details) {
      setReports((prevReports) => [
        ...prevReports,
        { ...formData, id: prevReports.length + 1 },
      ]);
      setFormData({
        name: '',
        email: '',
        category: '',
        details: '',
        image: null,
      });
    }
  };

  return (
    <div className='containerf'>

      {/* <Sidebar /> */}
      <Layout />
      <div className="form-container">        
        <a href="#" className="back-link">← File Report</a>
        <form className="report-form" onSubmit={handleSubmit}>
          <br />
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Edit Your Name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Edit Your Email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              {/* <option value="">Please select...</option> */}
              <option value="Private Sector">Private Sector </option>
              <option value="Public Sector">Public Sector</option>
              <option value="Judicial Corruption">Judicial Corruption</option>
              <option value="Natural Resources">Natural Resources</option>
              <option value="International Aid and Development">International Aid and Development</option>
              <option value="Elections and Political Processes ">Elections and Political Processes </option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education<">Education</option>
              <option value="Law Enforcement">Law Enforcement</option>
              <option value="Procurement and Public Contracting">Procurement and Public Contracting</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="details">Details</label>
            <textarea
              id="details"
              name="details"
              placeholder="Describe the issue"
              value={formData.details}
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="image-upload">Upload Image</label>
            <input
              type="file"
              id="image-upload"
              name="image"
              onChange={handleChange}
            />
          </div>
          <button id="send-button" type="submit">Send</button>
        </form>

      </div>
    </div>

  );
};

export default ReportForm;
