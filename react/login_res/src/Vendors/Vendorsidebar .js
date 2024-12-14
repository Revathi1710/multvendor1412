import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './vendorsidebar.css'; // Import your CSS for styling

import VendorProfile from '../icons/vendor.png';

const Vendorsidebar = () => {
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState(null);
  const [businessType, setBusinessType] = useState(null); // State to hold business type
  const [error, setError] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // State for profile dropdown
  
  const VendorlogOut = () => {
    window.localStorage.removeItem("vendortoken"); // Remove only the token
    window.location.href = "./Login";
  };

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const handleProfileToggle = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  useEffect(() => {
    const vendortoken = window.localStorage.getItem("vendortoken");
    const vendorId = localStorage.getItem('vendorId');

    if (!vendortoken) {
      setError("No token found");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/vendorData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ vendortoken }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setVendorData(data.data);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setError(error.message);
      });

    // Fetch business type
    fetch(`${process.env.REACT_APP_API_URL}/checkBusinessType`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ vendorId:  vendorId }), // Replace with actual vendorId
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBusinessType(data.data.type);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        console.error("Error fetching business type:", error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <div className="header" onClick={handleProfileToggle}>
        <div className='headermenu'>
          <img src={VendorProfile} alt="Vendor Profile" className='Vendorprofile' />
          Hello
          {vendorData ? (
            <span> {vendorData.fname}</span>
          ) : (
            <div>{error ? error : 'Loading...'}</div>
          )}
          <i className='fas fa-angle-down'></i>
        </div>
      </div>
      {showProfileDropdown && (
        <div className='profileDetails'>
          <img src={VendorProfile} alt="Vendor Profile" className='Vendorprofile2' />
          <div className='profileName'>
            {vendorData?.email}
          </div>
          <ul className="profileedit">
            <li className='profileEditlist'><Link to="/Vendor/EditProfile"><i className='fas fa-user-alt'></i>Edit Account</Link></li>
            <li className='profileEditlist'><Link to="/change-password"><i className='fas fa-lock'></i>Change Password</Link></li>
            <li className='profileEditlist'><Link to="/Vendor/Login" onClick={VendorlogOut}><i className='fas fa-sign-out-alt'></i>Log out</Link></li>
          </ul>
        </div>
      )}
      <aside className="sidebar">
        <div id="leftside-navigation" className="nano">
          <ul className="nano-content">
            <li>
              <Link to="/Vendor/Dashboard"><i className="fa fa-dashboard"></i><span>Dashboard</span></Link>
            </li>
            <li className={`sub-menu ${activeSubMenu === 5 ? 'active' : ''}`}>
<a href="javascript:void(5);" onClick={() => handleSubMenuToggle(5)}>
  <i className="fa fa-cogs"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
</a>
<ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }}>
  <li><Link to="/Vendor/UserProfile">User Profile</Link></li>
  <li><Link to="/Vendor/BusinessProfile">Business Profile</Link></li>
  <li><Link to="/Vendor/BankDetails"> Bank Details</Link></li>
 
</ul>
</li>
            <li className={`sub-menu ${activeSubMenu === 0 ? 'active' : ''}`}>
<a href="javascript:void(0);" onClick={() => handleSubMenuToggle(0)}>
  <i className="fa fa-cogs"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
</a>
<ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }}>
  <li><Link to="/Vendor/AllCategory">All Categories</Link></li>
  <li><Link to="/Vendor/AddCategory">Add New Category</Link></li>
</ul>
</li>

            {businessType === "Product Based Business" && (
              <li className={`sub-menu ${activeSubMenu === 3 ? 'active' : ''}`}>
                <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(0)}>
                  <i className="fa fa-cogs"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
                  <li><Link to="/Vendor/AllProduct">All Product</Link></li>
                  <li><Link to="/Vendor/AddProduct">Add Product</Link></li>
                </ul>
              </li>
            )}

            {businessType === "Service Based Business" && (
              <li className={`sub-menu ${activeSubMenu === 1 ? 'active' : ''}`}>
                <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(1)}>
                  <i className="fa fa-cogs"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }}>
                  <li><Link to="/Vendor/AllService">All Service</Link></li>
                  <li><Link to="/Vendor/AddService">Add Service</Link></li>
                </ul>
              </li>
            )}

            <li className={`sub-menu ${activeSubMenu === 2 ? 'active' : ''}`}>
              <a href="javascript:void(0);" onClick={() => handleSubMenuToggle(2)}>
                <i className="fa fa-cogs"></i><span>Enquiry</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/AllEnquiry">All Enquiry</Link></li>
              </ul>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Vendorsidebar;
