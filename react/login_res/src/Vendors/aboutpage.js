import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for the editor
import VendorHeader from './vendorHeader';
import './pagesetup.css';
import axios from 'axios'; // Import axios for making API calls

const AboutPageForm = () => {
  const [aboutTitle, setAboutTitle] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [aboutImage, setAboutImage] = useState(null); // Set to null initially for file
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const vendortoken = window.localStorage.getItem('vendortoken');
    
    if (!vendortoken) {
      setError('No token found');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, []);

  useEffect(() => {
    if (vendorData) {
      const vendorId = vendorData._id;

      const fetchHomepageData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/homepage/${vendorId}`);
          const aboutData = response.data;

          setAboutTitle(aboutData.AboutTitle || "");
          setDetailedDescription(aboutData.AboutDescription || "");
          setAboutImage(aboutData.AboutImage || "");
        } catch (error) {
          console.error("Error fetching about page data: ", error);
          alert("Could not load existing about page data.");
        }
      };

      fetchHomepageData();
    }
  }, [vendorData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('vendorId', vendorData._id);
    formData.append('AboutTitle', aboutTitle);
    formData.append('AboutDescription', detailedDescription);
    
    if (aboutImage) {
      formData.append('AboutImage', aboutImage); // Add the file to the FormData
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/aboutpage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting the form: ", error);
      alert("Failed to update about page details. Please try again.");
    }
  };
  

  return (
    <div>
      <VendorHeader />
      <div className="vendorHome">
        <form onSubmit={handleSubmit} className="homepageform" encType="multipart/form-data">
          <h2 className="mb-3">About Page</h2>

          {error && <div className="error-message">{error}</div>}

          <div>
            <label>Select Title About:</label>
            <select value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)}>
              <option value="About">About</option>
              <option value="About Us">About Us</option>
              <option value="Who We Are">Who We Are</option>
            </select>
          </div>

          <div style={{ marginTop: "60px" }}>
            <label>Detailed Description of your Website Home Page:</label>
            <ReactQuill
              value={detailedDescription}
              onChange={setDetailedDescription}
              placeholder="Enter detailed description"
            />
          </div>

          <div>
            <label>Upload Image:</label>
            <input
              type="file"
              onChange={(e) => setAboutImage(e.target.files[0])} // Capture the file
            />
          </div>

          <button type="submit" style={{ marginTop: "60px" }} className="btn btn-primary">
            Update Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default AboutPageForm;
