import React, { useEffect, useState } from 'react';
import axios from 'axios';
import VendorHeader from './vendorHeader'; // Ensure the correct capitalization
import './websitepage.css'; // Ensure the correct file reference

const WebsitePages = () => {
  const [vendorData, setVendorData] = useState(null);
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
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!vendorData) {
    return <div>Loading...</div>;
  }

  const businessSlug  = vendorData.businessSlug ;

  const homepagesetup = () => {
    window.location.href = `/Vendor/Homepage`;
  };

  const aboutpagesetup = () => {
    window.location.href = `/Vendor/AboutPage`;
  };

  const awardpagesetup = () => {
    window.location.href = `/Vendor/Awards`;
  };

  return (
    <div>
      <VendorHeader />
      <p>
        Business URL: 
        <a href={`/${businessSlug }`} target='_blank'>
          {`https://localhost:3000/${businessSlug }`}
        </a>
      </p>
      
      <div className="row allpagebox">
        <div className="col-sm-4 pagelist" onClick={homepagesetup}>
          <div className='webpageicon'>
            <i className="fas fa-home"></i>
          </div>
          <div className='webpagename'>
            Home
          </div>
        </div>
        <div className="col-sm-4 pagelist" onClick={aboutpagesetup}>
          <div className='webpageicon'>
            <i className="fas fa-users"></i>
          </div>
          <div className='webpagename'>
            About
          </div>
        </div>
        <div className="col-sm-4 pagelist" onClick={awardpagesetup}>
          <div className='webpageicon'>
            <i className="fas fa-award"></i>
          </div>
          <div className='webpagename'>
            Awards & Memberships
          </div>
        </div>
        {/* Add more page icons as necessary */}
      </div>
    </div>
  );
};

export default WebsitePages;