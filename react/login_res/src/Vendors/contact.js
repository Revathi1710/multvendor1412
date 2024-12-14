import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar";
import './vendorWebsite.css';
import EnquiryModal from './Enquiry';
const VendorWebContact = () => {
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [about, setAbout] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const slug = window.location.pathname.split("/")[1]; 
    const vendortoken = window.localStorage.getItem("vendortoken");
    if (vendortoken) {
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
            setUserData(data.data);
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
        });
    }
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
  const handleEnquiryClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
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
         

           
          <li><Link to={`/${vendorData.businessSlug}`} >Home</Link></li>
<li><Link to={`/${vendorData.businessSlug}/about` }  >About Us</Link></li>
<li><Link to={`/${vendorData.businessSlug}/product`}>Product & Service</Link></li>
<li><Link to={`/${vendorData.businessSlug}/contact`} style={{ color: '#00a2ab' }}>Contact</Link></li>
          </ul>
        </nav>
    
    

       
      <div className="container mt-3 mb-3">
        <div className="row">
            <div className="col-sm-7">
      <div className="footerReach">
              
      <i className='fas fa-map-marker-alt'></i> 
                {vendorData.Address}
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
              <div className="col-sm-5">
              <form className="contactform">
                    <div className="form-group mb-3">
                       
                        <input type="text" name="number" className="form-control" placeholder="Enter Mobile Number"></input>
                    </div>
                    <div className="form-group mb-3">
                    <textarea className="form-control requireTextarea" height="120px" placeholder="Requirement Details">

                    </textarea>
                    </div>
                    <button type="submit" className="btn btn-primary mt-2">Send</button>
                    
                </form>
              </div>
              </div>
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

export default VendorWebContact;
