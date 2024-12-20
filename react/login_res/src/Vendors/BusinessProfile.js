
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './businessProfile.css';
import percentageimage1 from '../icons/percentageimage1.png';

import infogif from '../icons/gifinfo.gif';


const UpdateProfileVendor = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [vendorData, setVendorData] = useState({
    businessName: '',
    OfficeContact: '',
    FaxNumber: '',
    Ownership: '',
    AnnualTakeover: '',
    establishment: '',
    NoEmployee: '',
      selectType:'',
    Address: '',
    City: '',
    State: '',
    Country: '',
    Pincode: ''
  });
  const [error, setError] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [businessType, setBusinessType] = useState(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);
  const [showCompanyDetails, setShowCompanyDetails] = useState(true);
  const [showAddressDetails, setShowAddressDetails] = useState(false);

  const toggleCompanyDetails = () => setShowCompanyDetails(!showCompanyDetails);
  const toggleAddressDetails = () => setShowAddressDetails(!showAddressDetails);

  
  

  

 

  useEffect(() => {
    const vendortoken = window.localStorage.getItem('vendortoken');

    if (!vendortoken) {
      setError('No token found');
      return;
    }

    axios.post(`http://localhost:5000/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
          setBusinessType(response.data.data.businessType);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, [vendorId]);
  const calculateCompleteness = (data) => {
    let filledFields = 0;
    const totalFields = 13;

    if (data.businessName && data.businessName.trim() !== '') filledFields++;
    if (data.OfficeContact && data.OfficeContact.trim() !== '') filledFields++;
    if (data.FaxNumber && data.FaxNumber.trim() !== '') filledFields++;
    if (data.Ownership && data.Ownership.trim() !== '') filledFields++;
    if (data.AnnualTakeover && data.AnnualTakeover.trim() !== '') filledFields++;
    if (data.establishment && data.establishment.trim() !== '') filledFields++;
    if (data.NoEmployee && data.NoEmployee.trim() !== '') filledFields++;
   
    if (data.selectType && data.selectType.trim() !== '') filledFields++;
    if (data.Address && data.Address.trim() !== '') filledFields++;
    if (data.City && data.City.trim() !== '') filledFields++;
    if (data.State && data.State.trim() !== '') filledFields++;
    if (data.Country && data.Country.trim() !== '') filledFields++;
    if (data.Pincode && data.Pincode.trim() !== '') filledFields++;

    const completeness = Math.round((filledFields / totalFields) * 100);
    setProfileCompleteness(completeness);
  };
  useEffect(() => {
    calculateCompleteness(vendorData);
}, [vendorData]); 
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
    axios.put(`http://localhost:5000/BusinessProfile`, vendorData, {
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
      <VendorHeader />
      <div className="content row mt-4">
      <div className='col-sm-3'>
          <ul className='VendorList'>
            <li className='list'><i className="fa fa-laptop sidebaricon"></i> Dashboard</li>
          </ul>
          <ul className="nano-content VendorList">
            <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/UserProfile" className='listsidebar'>User Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BusinessProfile" className='listsidebar'>Business Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BankDetails" className='listsidebar'>Bank Details</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/AllCategory" className='listsidebar'>All Categories</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/AddCategory" className='listsidebar'>Add New Category</Link></li>
              </ul>
            </li>
            {vendorData.selectType === "Product Based Company" && (
    <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
      <a href="#!" onClick={() => handleSubMenuToggle(3)}>
        <i className="fa fa-cogs sidebaricon"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
      </a>
      <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }} className='vendorsidebarmenu'>
        <li className='list_sidebar'><Link to="/Vendor/AllProduct" className='listsidebar'>All Product</Link></li>
        <li className='list_sidebar'><Link to="/Vendor/AddProductVendor" className='listsidebar'>Add Product</Link></li>
      </ul>
    </li>
  )}
  {vendorData.selectType === "Service Based Company" && (
    <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
      <a href="#!" onClick={() => handleSubMenuToggle(1)}>
        <i className="fa fa-cogs sidebaricon"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
      </a>
      <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }} className='vendorsidebarmenu'>
        <li className='list_sidebar'><Link to="/Vendor/AllService" className='listsidebar'>All Service</Link></li>
        <li className='list_sidebar'><Link to="/Vendor/AddService" className='listsidebar'>Add Service</Link></li>
      </ul>
    </li>
  )}
            <li className={`sub-menu list ${activeSubMenu === 2 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(2)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Enquiry</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/AllEnquiryVendor" className='listsidebar'>All Enquiry</Link></li>
              </ul>
             
            </li>
            <ul className='VendorList'>
            <li className='list'><Link to="/Vendor/MyOrders" className='listout listsidebar'><i className="fa fa-laptop sidebaricon"></i>My Orders</Link></li>
          </ul>
          </ul>
          <img 
        src={infogif} 
        alt="Loading..." 
        style={{  height: 'auto', borderRadius: '10px' }} 
      />
        </div>
        <div className='col-sm-6 businessinfo-container'>
          <h3 className='title-vendorInfo'>Business Profile</h3>
          {error && <p className="error">{error}</p>}
          <div className="form-container1">
            {/*<div className='row threesection'>
                <div className='col-sm-4'>
                    Business Details
                </div>
                <div className='col-sm-4'>
                   Additional Details
                </div>
                <div className='col-sm-4'>
                Certification & Awards
                </div>
            </div>*/}

            <div className='companyDetails'>
               
                
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
        <div className="mb-2">
          <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
        <div className="mb-2">
          <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          <div className="mb-2">
            <div className="labelcontainer">
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
          
        <div className='col-sm-3  perbox'>
          <div className='percentage'>
  

  
  <div class="circle-wrap">
    <div class="circle">
      <div class="mask full-1">
        <div class="fill-1"></div>
      </div>
      <div class="mask half">
        <div class="fill-1"></div>
      </div>
      <div className="inside-circle"> {profileCompleteness}% </div>
    </div>
  </div>
   
     

        <h6>My Profile Completeness</h6>
        <p>Please add your Standard Certificate</p>
          </div>
          <img src={percentageimage1}  />
          </div>
        
      </div>
    </div>
  );
};

export default UpdateProfileVendor;