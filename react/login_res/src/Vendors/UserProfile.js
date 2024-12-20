import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams, useNavigate } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import infogif from '../icons/gifinfo.gif';
import percentageimage1 from '../icons/percentageimage1.png';

const UpdateProfileVendor = () => {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const handleLogout = () => {
   
    localStorage.removeItem('vendortoken'); 
    

    
    navigate('/login');
};
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

  const [profileCompleteness, setProfileCompleteness] = useState(0); 

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
  const calculateCompleteness = (data) => {
    let filledFields = 0;
    const totalFields = 8; // Update this if you change the number of fields considered

    if (data.fname) filledFields++;
    if (data.lname) filledFields++;
    if (data.email) filledFields++;
    if (data.alterEmail) filledFields++;
    if (data.number) filledFields++;
    if (data.alterNumber) filledFields++;
    if (data.whatsappNumber) filledFields++;
    if (data.jobTitle) filledFields++;
   

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
       
          <ul className='VendorList'>
            <li className='list'><Link to="/Vendor/Websitepage" className='listout'><i className="fa fa-laptop sidebaricon"></i>My Website</Link></li>
          </ul>
          
         
          </ul>
          <img 
        src={infogif} 
        alt="Loading..." 
        style={{  height: 'auto', borderRadius: '10px' }} 
      />
        </div>
        <div className='col-sm-6 userinfo-container'>
          <h3 className='title-vendorInfo'>User Profile</h3>
          {error && <p className="error">{error}</p>}
          <div className="form-container1">
            <form onSubmit={handleSubmit}>
              <div className="form-group row">
                <div className="mb-2 col-sm-6">
                  <div className="labelcontainer">
                    <label htmlFor="fname">First Name:</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="fname"
                    name="fname"
                    placeholder='Enter First Name'
                    value={vendorData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2 col-sm-6">
                  <div className="labelcontainer">
                    <label htmlFor="lname">Last Name:</label>
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="lname"
                    name="lname"
                    placeholder='Enter Last Name'
                    value={vendorData.lname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className='row'>
                <div className="form-group col-sm-6">
                  <div className="mb-2">
                    <div className="labelcontainer">
                      <label htmlFor="email">Email:</label>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={vendorData.email}
                      onChange={handleChange}
                      placeholder='Enter Email'
                      required
                    />
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <div className="mb-2">
                    <div className="labelcontainer">
                      <label htmlFor="alterEmail">Alternate Email:</label>
                    </div>
                    <input
                      type="email"
                      className="form-control"
                      id="alterEmail"
                      name="alterEmail"
                      placeholder='Alternate Email'
                      value={vendorData.alterEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className="form-group col-sm-6">
                  <div className="mb-2">
                    <div className="labelcontainer">
                      <label htmlFor="number">Phone Number:</label>
                    </div>
                    <input
                      type="tel"
                      className="form-control"
                      id="number"
                      name="number"
                      placeholder='Enter Phone Number'
                      value={vendorData.number}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <div className="mb-2">
                    <div className="labelcontainer">
                      <label htmlFor="alterNumber">Alternate Phone Number:</label>
                    </div>
                    <input
                      type="tel"
                      className="form-control"
                      id="alterNumber"
                      name="alterNumber"
                      placeholder='Alternate Phone Number'
                      value={vendorData.alterNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className='row'>
                <div className="form-group col-sm-6">
                  <div className="mb-2">
                    <div className="labelcontainer">
                      <label htmlFor="whatsappNumber">WhatsApp Number:</label>
                    </div>
                    <input
                      type="tel"
                      className="form-control"
                      id="whatsappNumber"
                      name="whatsappNumber"
                      placeholder='Enter WhatsApp Number'
                      value={vendorData.whatsappNumber}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <div className="mb-2">
                    <div className="labelcontainer">
                      <label htmlFor="jobTitle">Job Title:</label>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      id="jobTitle"
                      name="jobTitle"
                      placeholder='Enter Job Title'
                      value={vendorData.jobTitle}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
             
              <div className="button-container mt-3">
                <button type="submit" className="btn btn-primary submitbtn">
                  Update Profile
                </button>
              </div>
            </form>
          </div>
          
          
        </div>
          
        <div className='col-sm-3'>
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