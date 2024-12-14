import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

import Sidebar from './Vendorsidebar ';
import '../SuperAdmin/addcategory.css';

const SelectBusiness = () => {
  const [type, setType] = useState('');
  const [vendorId, setVendorId] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('vendortoken');
    const storedVendorId = localStorage.getItem('vendorId');
    if (token && storedVendorId) {
      try {
        const decoded = jwtDecode(token);
        setVendorId(storedVendorId);
      } catch (error) {
        console.error('Invalid token or failed to decode:', error);
        // Handle error, e.g., redirect to login
      }
    } else {
      alert('Vendor not authenticated. Please log in.');
      // Redirect to login page or show an error
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!vendorId) {
      alert("Invalid or missing vendorId. Please log in again.");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/addBusinessType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ type, vendorId })
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "addcategory");
      if (data.status === 'ok') {
        //alert('Category added successfully!');
        window.location.href = "./Dashboard";
      } else {
        alert(data.message || 'Category addition failed!');
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  };

  return (
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Business Type</h1>
        <form onSubmit={handleSubmit} className="category-form">
          <div className='form-row row'>
            <div className='form-group'>
              <label>Type</label>
              <div className="status-options">
                <label>
                  <input
                    type='radio'
                    name="type"
                    value="Product Based Business"
                    onChange={() => setType('Product Based Business')}
                  /> Product Based Business
                </label>
                <label>
                  <input
                    type='radio'
                    name="type"
                    value="Service Based Business"
                    onChange={() => setType('Service Based Business')}
                  /> Service Based Business
                </label>
              </div>
            </div>
          </div>
          <button type="submit" className="submit-btn">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default SelectBusiness;
