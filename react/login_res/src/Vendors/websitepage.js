import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import VendorHeader from './vendorHeader'; // Ensure correct capitalization and path
import './websitepage.css'; // Ensure correct file reference

const WebsitePages = () => {
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    const vendortoken = localStorage.getItem('vendortoken');

    if (!vendorId || !vendortoken) {
      setError('Vendor ID or token not found in local storage');
      setLoading(false);
      return;
    }

    axios
      .post('http://localhost:5000/vendorData', { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch vendor data');
        }
      })
      .catch(err => {
        setError(err.message || 'An error occurred while fetching vendor data');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const { businessSlug } = vendorData || {};

  const navigateToPage = (path) => {
    navigate(path);
  };

  return (
    <div>
      <VendorHeader />
      <p>
        Business URL:{' '}
        {businessSlug ? (
          <a href={`/${businessSlug}`} target="_blank" rel="noopener noreferrer">
            {`https://localhost:3000/${businessSlug}`}
          </a>
        ) : (
          'N/A'
        )}
      </p>

      <div className="row allpagebox">
        <div className="col-sm-4 pagelist" onClick={() => navigateToPage('/Vendor/Homepage')}>
          <div className="webpageicon">
            <i className="fas fa-home"></i>
          </div>
          <div className="webpagename">Home</div>
        </div>
        <div className="col-sm-4 pagelist" onClick={() => navigateToPage('/Vendor/AboutPage')}>
          <div className="webpageicon">
            <i className="fas fa-users"></i>
          </div>
          <div className="webpagename">About</div>
        </div>
        <div className="col-sm-4 pagelist" onClick={() => navigateToPage('/Vendor/Awards')}>
          <div className="webpageicon">
            <i className="fas fa-award"></i>
          </div>
          <div className="webpagename">Awards & Memberships</div>
        </div>
        {/* Add more page icons as necessary */}
      </div>
    </div>
  );
};

export default WebsitePages;
