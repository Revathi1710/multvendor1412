import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the styles for the editor
import VendorHeader from './vendorHeader';
import './pagesetup.css';
import axios from 'axios'; // Import axios for making API calls

const HomePageForm = () => {
  const [keyDescription, setKeyDescription] = useState("");
  const [detailedDescription, setDetailedDescription] = useState("");
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState("");
  const [bannerImage, setBannerImage] = useState(null);


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
    // Only attempt to fetch homepage data if vendorData is available
    if (vendorData) {
      const vendorId = vendorData._id;

      const fetchHomepageData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/homepage/${vendorId}`);
          const homepageData = response.data;
          
          // Set the state with the fetched data
          setKeyDescription(homepageData.HomepageKey || "");
          setDetailedDescription(homepageData.HomepageDescription || "");
        } catch (error) {
          console.error("Error fetching homepage data: ", error);
          alert("Could not load existing homepage data.");
        }
      };

      fetchHomepageData();
    }
  }, [vendorData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('vendorId', vendorData._id);
    formData.append('HomepageKey', keyDescription);
    formData.append('HomepageDescription', detailedDescription);
    
    if (bannerImage) {
      formData.append('bannerImage', bannerImage);
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/homepage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      alert(response.data.message);
    } catch (error) {
      console.error("Error submitting the form: ", error);
      alert("Failed to update home page details. Please try again.");
    }
  };
  const handleFileChange = (event) => {
    setBannerImage(event.target.files[0]);
  };
    

  return (
    <div>
      <VendorHeader />
      <div className="vendorHome">
        <form onSubmit={handleSubmit} className="homepageform">
          <h2 className="mb-3">Home Page</h2>

          {error && <div className="error-message">{error}</div>}
          <div>
  <label>Banner Image</label>
  <input type="file" onChange={handleFileChange} />
</div>
          <div>
            <label>Key Description of your Company:</label>
            <ReactQuill
              value={keyDescription}
              onChange={setKeyDescription}
              placeholder="Enter key description"
            />
          </div>

          <div style={{ marginTop: "60px" }}>
            <label>Detailed Description of your Website Home Page:</label>
            <ReactQuill
              value={detailedDescription}
              onChange={setDetailedDescription}
              placeholder="Enter detailed description"
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

export default HomePageForm;
