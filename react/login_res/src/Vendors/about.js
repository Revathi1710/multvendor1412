import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar";
import './vendorWebsite.css';

const VendorWebAbout = () => {
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [about, setAbout] = useState([]);
  useEffect(() => {
    const slug = window.location.pathname.split("/")[1]; 

    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getBusinessSlug/${slug}`);
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error fetching vendor data:', error);
        setError(error.message);
      }
    };

    fetchVendorData();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      if (vendorData) {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/getVendorThreeProduct`, { vendorId: vendorData._id });

          if (response.data.status === 'ok') {
            setProducts(response.data.data);
          } else {
            console.error('Error fetching products:', response.data.message);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };
    const fetchWebsiteDetails = async () => {
        if (vendorData) {
          try {
              const response = await axios.post(`${process.env.REACT_APP_API_URL}/getWebsiteDetailsVendor`, { vendorId: vendorData._id });
  
            if (response.data.status === 'ok') {
                setAbout(response.data.data);
            } else {
              console.error('Error fetching products:', response.data.message);
            }
          } catch (error) {
            console.error('Error fetching products:', error);
          }
        }
      };

    fetchProducts();
    fetchWebsiteDetails();

  }, [vendorData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!vendorData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Navbar />
      <div className="vendorwebsite">
        <div className="row">
          <div className="col-sm-10">
            <h2>{vendorData.businessName}</h2>
            <div className="locationwebsite">
              <i className='fas fa-map-marker-alt'></i> {vendorData.City}, {vendorData.State}
            </div>
          </div>
          <div className="col-sm-2">
            <Link to={`tel:${vendorData.number}`} className="phone-link">
              <i className='fas fa-phone' id="phonevendor"></i> {vendorData.number}
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="vendor-menu">
          <ul>
       
            <li><Link to={`/${vendorData.businessSlug}`}>Home</Link></li>
<li><Link to={`/${vendorData.businessSlug}/about` }  style={{ color: '#00a2ab' }}>About Us</Link></li>
<li><Link to={`/${vendorData.businessSlug}/product`}>Product & Service</Link></li>
<li><Link to={`/${vendorData.businessSlug}/contact`}>Contact</Link></li>
          </ul>
        </nav>
     
    
<div className="aboutdetailSection">
  {about.length > 0 ? (
    about.map((item) => (
      <div key={item._id} className="col-sm-12 mb-4">
         
          <h2 className="pagetitle mt-5">{item.AboutTitle}</h2>
        <div className="row">
          <div className="col-sm-6 mb-4">
            <img
              src={`${process.env.REACT_APP_API_URL}/uploads/${item.AboutImage.replace('\\', '/')}`}
              alt={item.name}
              style={{ width: '100%'}} // Adjust width/height to fit your design
            />
          </div>
          <div className="col-sm-6 mb-4 aboutdetails">
            <div className="aboutdescription">{item.AboutDescription}</div>
          </div>
        </div>
      </div>
     
            ))
          ) : (
            <div className="text-center">
              <p>No products available.</p>
            </div>
          )}
      </div>
   
        <div className="footer-section">
        <div className="getTouch">
        Get in touch with us
        </div>
      </div>
      <footer>
        <div className="row mt-3">
            <div className="col-sm-3 companymenu">
                <h5 className="ourCompany">Our Company</h5>
                <ul className="footer-menu">
                <li><Link to={`/${vendorData.businessSlug}`}>Home</Link></li>
<li><Link to={`/${vendorData.businessSlug}/about`}>About Us</Link></li>
<li><Link to={`/${vendorData.businessSlug}/product`}>Product & Service</Link></li>
<li><Link to={`/${vendorData.businessSlug}/contact`}>Contact</Link></li>

                </ul>
            </div>
            <div className="col-sm-3 companymenu">
                <h5 className="ourCompany">Reach Us</h5>
                <div className="footerReach">
                <h4>{vendorData.businessName}</h4>
              <i className='fas fa-map-marker-alt'></i> 
              {vendorData.City}-{vendorData.pincode}, {vendorData.State}
            </div>
            <div className="footerReach">
              
            <i className='fas fa-phone'></i> 
              {vendorData.number}
            </div>
            <div className="footerReach">
                
            <i class='fas fa-mail-bulk'></i>
               {vendorData.email}
            </div>
            </div>
            <div className="col-sm-5 companymenu" id="formfooter">
                <h5 className="ourCompany">Contact Us</h5>
                <form>
                    <div className="form-group">
                    <label>Requirement Details</label>
                    <textarea className="form-control requireTextarea" height="120px" >

                    </textarea>
                    <button type="submit" className="btn btn-primary mt-2">Send</button>
                    </div>
                </form>
               
            </div>
        </div>
      </footer>
      </div>
      
      </div>
  );
}

export default VendorWebAbout;
