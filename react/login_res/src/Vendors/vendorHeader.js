import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import './navbarVendor.css';// Adjust path if needed
import logo from '../icons/aristostechlogo.png';
//import userIcon from '../icons/avatar.png'; // Adjust path if needed
const Navbar = () => {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const vendorId = localStorage.getItem('vendorId');

    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');
    
        if (!userId && !vendorId) return;
    
        const response = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, vendorId }),
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
    
        const result = await response.json();
    
        console.log('API Response:', result); // Debugging
    
        if (result.status === 'ok' && result.data && result.data.fname) {
          setUserName(result.data.fname); // Use fname instead of name
        } else {
          console.error('Error in API response:', result.message || 'No name found');
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };
    

    fetchUserName();
  }, []); // Add userId and vendorId if you expect them to change

  return (
    <nav className="navbar">
      <div className="container1">
        <div className="row">
          <div className="col-sm-3">
          <Link to="/" className="navbar-brand">
            
            <p className='logoname'>Kada
            <span className='spanlogo'>Theru</span></p>
             </Link>
          </div>
       
          <div className="col-sm-9">
           <div className='row'>
            <div className='col-sm-8 upgradeDetails'>
          <Link to='/Vendor/VendorSelectPlan' className='upgradeBtn'>Upgrade Plan</Link></div>
              <div className="nav-item col-sm-4">
              
              <i className='far fa-user-circle'></i>
                {userName ? (
                  <span className="nav-link">Welcome, {userName}</span>
                ) : (
                  <Link to="/signup" className="nav-link">
                    Login/Signup
                  </Link>
                )}
              </div>
              </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
