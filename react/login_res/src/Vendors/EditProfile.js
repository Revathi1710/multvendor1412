import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Vendorsidebar '; // Ensure this path is correct
import '../SuperAdmin/addcategory.css';

const UpdateProfileVendor = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    fname: '',
    email: '',
    number: '',
    businessName: '',
  });
  const [error, setError] = useState(null);

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
  }, [vendorId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const vendortoken = window.localStorage.getItem('vendortoken');
  
    axios.put(`${process.env.REACT_APP_API_URL}/vendor/${vendorId}`, vendorData, {
      headers: { 'Authorization': `Bearer ${vendortoken}` }
    })
    .then(response => {
      if (response.data.status === 'ok') {
        navigate('/Vendor/Dashboard');
      } else {
        setError(response.data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setError(error.message);
    });
  };
  

  return (
    <div className="update-profile-vendor">
      <Sidebar />
      <div className="content" style={{ marginLeft: '250px' }}>
        <h2>Update Profile</h2>
        {error && <p className="error">{error}</p>}
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="mb-3">
                <div className="labelcontainer mb-3">
                  <label htmlFor="fname">First Name:</label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="fname"
                  name="fname"
                  value={vendorData.fname}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="mb-3">
                <div className="labelcontainer mb-3">
                  <label htmlFor="email">Email:</label>
                </div>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={vendorData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="mb-3">
                <div className="labelcontainer mb-3">
                  <label htmlFor="phone">Mobile Number:</label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  name="number"
                  value={vendorData.number}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <div className="mb-3">
                <div className="labelcontainer mb-3">
                  <label htmlFor="businessName">Business Name:</label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  id="businessName"
                  name="businessName"
                  value={vendorData.businessName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <button type="submit" className="submit-btn">Update Profile</button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfileVendor;
