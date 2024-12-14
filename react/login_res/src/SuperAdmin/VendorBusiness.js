import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';

import '../SuperAdmin/addcategory.css';
import '../Vendors/sidebar2.css';
import Sidebar from './sidebar'; 
import '../Vendors/businessProfile.css';
import './Vendorview.css';

const VendorProfileView = () => {
    const { id } = useParams();
 
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    fname: '',
    lname: '',
    email: '',
    alterEmail: '',
    number: '',
    alterNumber: '',
    whatsappNumber: '',
    jobTitle: '',
    businessName: ''
  });
  const [error, setError] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
 
  const [showCompanyDetails, setShowCompanyDetails] = useState(true);
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  const toggleCompanyDetails = () => setShowCompanyDetails(!showCompanyDetails);
  const toggleAddressDetails = () => setShowAddressDetails(!showAddressDetails);

  useEffect(() => {
    axios.post(`${process.env.REACT_APP_API_URL}/vendorDataAdmin`, { id })
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
  }, [id]);

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

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
    const vendorId = window.localStorage.getItem('vendorId');
    axios.put(`${process.env.REACT_APP_API_URL}/updateUserProfileVendor`, vendorData, {
      headers: { 'Authorization': `Bearer ${vendortoken} `}
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
      <div className="content  content2 row mt-5">
        <div className='col-sm-4 mt-5'>
          <ul className='VendorList'>
            <li className='list'><i className="fa fa-laptop"></i> Dashboard</li>
          </ul>
          <ul className="nano-content VendorList">
            <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                <i className="fa fa-cogs"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/UserProfile">User Profile</Link></li>
                <li>  <Link to={`/SuperAdmin/VendorBusiness/${id}`}>Business Profile</Link></li>
                <li><Link to={`/SuperAdmin/VendorBank/${id}`}>Bank Profile</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }}>
                <li><Link to={`/SuperAdmin/VendorCategory/${id}`}>All Category</Link></li>
                {/*<li><Link to="/Vendor/AddCategory">Add New Category</Link></li>*/}
              </ul>
            </li>
            {vendorData.selectType === "Product Based Company" && (
    <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
      <a href="#!" onClick={() => handleSubMenuToggle(3)}>
        <i className="fa fa-cogs"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
      </a>
      <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
        <li><Link to={`/SuperAdmin/VendorProduct/${id}`}>All Product</Link></li>
        {/*<li><Link to="/Vendor/AddProduct">Add Product</Link></li>*/}
      </ul>
    </li>
  )}
  {vendorData.selectType === "Service Based Company" && (
    <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
      <a href="#!" onClick={() => handleSubMenuToggle(1)}>
        <i className="fa fa-cogs"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
      </a>
      <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }}>
      <li><Link to={`/SuperAdmin/VendorService/${id}`}>All Service</Link></li>
       
       {/*<li><Link to="/Vendor/AddService">Add Service</Link></li>*/}
      </ul>
    </li>
  )}
            <li className={`sub-menu list ${activeSubMenu === 2 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(2)}>
                <i className="fa fa-cogs"></i><span>Enquiry</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
              <li><Link to={`/SuperAdmin/VendorEnquiry/${id}`}>All Enquiry</Link></li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='col-sm-7'>
          <h3>Vendor Profile</h3>
          {error && <p className="error">{error}</p>}
          <div className="form-container">
          <form onSubmit={handleSubmit}>
  <div className='titlecompany row' id='companydetails'>
    <div className="topic col-sm-10">Company Details</div>
    <div className='iconsbusiness col-sm-2' onClick={toggleCompanyDetails}>
      <i className={`fa fa-caret-${showCompanyDetails ? 'up' : 'down'}`}></i>
    </div>
  </div>

  {showCompanyDetails && (
    <div>
      <div className="form-group">
        <div className="mb-3">
          <div className="labelcontainer mb-3">
            <label htmlFor="businessName">Company Name:</label>
          </div>
          <input
            type="text"
            className="form-control"
            id="businessName"
            name="businessName"
            placeholder='Enter Company Name'
            value={vendorData.businessName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="OfficeContact">Office Contact Number:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="OfficeContact"
              name="OfficeContact"
              placeholder='Office Contact Number'
              value={vendorData.OfficeContact}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="FaxNumber">Fax Number:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="FaxNumber"
              name="FaxNumber"
              placeholder='Fax Number'
              value={vendorData.FaxNumber}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="Ownership">Ownership Type:</label>
            </div>
            <select
              className="form-control"
              id="Ownership"
              name="Ownership"
              value={vendorData.Ownership}
              onChange={handleChange}
              required
            >
              <option>Ownership Type</option>
              <option>Public Limited Company</option>
              <option>Private Limited Company</option>
              <option>Partnership</option>
              <option>Proprietorship</option>
              <option>Professional Associations</option>
              <option>Others</option>
            </select>
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="AnnualTakeover">Annual Takeover</label>
            </div>
            <input
              type="tel"
              className="form-control"
              id="AnnualTakeover"
              name="AnnualTakeover"
              placeholder='Annual Takeover'
              value={vendorData.AnnualTakeover}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="establishment">Year of Establishment:</label>
            </div>
            <input
              type="tel"
              className="form-control"
              id="establishment"
              name="establishment"
              placeholder='Year of Establishment'
              value={vendorData.establishment}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="NoEmployee">Number of Employees:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="NoEmployee"
              name="NoEmployee"
              placeholder='Number of Employees'
              value={vendorData.NoEmployee}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="selectType"> select Type:</label>
            </div>
           
              <select
              className="form-control"
              id="selectType"
              name="selectType"
              value={vendorData.selectType}
              onChange={handleChange}
              required
            >
              <option>Service Based Company</option>
              <option>Product Based Company</option>
              
            </select>
          </div>
        </div>
      
      </div>
    </div>
  )}

  <div className='titlecompany row' id='addressdetails'>
    <div className="topic col-sm-10">Address Details</div>
    <div className='iconsbusiness col-sm-2' onClick={toggleAddressDetails}>
      <i className={`fa fa-caret-${showAddressDetails ? 'up' : 'down'}`}></i>
    </div>
  </div>

  {showAddressDetails && (
    <div>
      <div className="form-group">
        <div className="mb-3">
          <div className="labelcontainer mb-3">
            <label htmlFor="Address">Address:</label>
          </div>
          <textarea
            className="form-control"
            id="Address"
            name="Address"
            placeholder="Enter Address"
            value={vendorData.Address}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="City">City:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="City"
              name="City"
              placeholder='City'
              value={vendorData.City}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="State">State:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="State"
              name="State"
              placeholder='State'
              value={vendorData.State}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className='row'>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="Pincode">Pincode:</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="Pincode"
              name="Pincode"
              placeholder='Pincode'
              value={vendorData.Pincode}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form-group col-sm-6">
          <div className="mb-3">
            <div className="labelcontainer mb-3">
              <label htmlFor="Country">Country</label>
            </div>
            <input
              type="text"
              className="form-control"
              id="Country"
              name="Country"
              placeholder='Country'
              value={vendorData.Country}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </div>
    </div>
  )}
  <div className="form-group text-center">
    <button type="submit" className="btn btn-primary">Update Profile</button>
  </div>
</form>

          </div>
          
          
        </div>
          
        
      </div>
    </div>
  );
};

export default VendorProfileView;