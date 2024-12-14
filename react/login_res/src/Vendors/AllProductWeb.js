import React, { useState, useEffect } from "react";
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from "../components/navbar";
import './vendorWebsite.css';
import EnquiryModal from './Enquiry';

const VendorWebProduct = () => {
  const [vendorData, setVendorData] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
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
    const fetchProductsAndServices = async () => {
      if (vendorData) {
        try {
          if (vendorData.selectType === 'Product Based Company') {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/getVendorProduct`, { vendorId: vendorData._id });
            if (response.data.status === 'ok') {
              setProducts(response.data.data);
            } else {
              console.error('Error fetching products:', response.data.message);
            }
          } else if (vendorData.selectType === 'Service Based Company') {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/getVendorService`, { vendorId: vendorData._id });
            if (response.data.status === 'ok') {
              setServices(response.data.data);
            } else {
              console.error('Error fetching services:', response.data.message);
            }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchProductsAndServices();
  }, [vendorData]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!vendorData) {
    return <div>Loading...</div>;
  }

  const handleEnquiryClick = (item) => {
    setSelectedProduct(item);
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
            <li><Link to={`/${vendorData.businessSlug}`}>Home</Link></li>
            <li><Link to={`/${vendorData.businessSlug}/about`}>About Us</Link></li>
            <li><Link to={`/${vendorData.businessSlug}/product`} style={{ color: '#00a2ab' }}>Product & Service</Link></li>
            <li><Link to={`/${vendorData.businessSlug}/contact`}>Contact</Link></li>
          </ul>
        </nav>

        <h2 className="pagetitle mt-4">Products & Service</h2>
        <div className="container">
          {vendorData.selectType === 'Product Based Company' ? (
            <div className="row container mt-4">
              {products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      {product.image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`}
                          className="card-img-top homeproductimage"
                          alt={product.name}
                        />
                      ) : (
                        <img
                          src="path_to_default_image.jpg"
                          className="card-img-top"
                          alt="default"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title ellipsis2">{product.name}</h5>
                        <button
                          type="submit"
                          name="Enquiry"
                          className="submit-btn"
                          onClick={() => handleEnquiryClick(product)}
                        >
                          <i className="fa fa-send-o"></i> Ask For Details
                        </button>
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
          ) : vendorData.selectType === 'Service Based Company' ? (
            <div className="row container mt-4">
              {services.length > 0 ? (
                services.map((service) => (
                  <div key={service._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      {service.image ? (
                        <img
                          src={`${process.env.REACT_APP_API_URL}/${service.image.replace('\\', '/')}`}
                          className="card-img-top homeproductimage"
                          alt={service.name}
                        />
                      ) : (
                        <img
                          src="path_to_default_image.jpg"
                          className="card-img-top"
                          alt="default"
                        />
                      )}
                      <div className="card-body">
                        <h5 className="card-title ellipsis2">{service.name}</h5>
                        <button
                          type="submit"
                          name="Enquiry"
                          className="submit-btn"
                          onClick={() => handleEnquiryClick(service)}
                        >
                          <i className="fa fa-send-o"></i> Ask For Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center">
                  <p>No services available.</p>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Enquiry Modal */}
        <EnquiryModal
          show={showModal}
          handleClose={handleModalClose}
          product={selectedProduct}
          userData={userData}
          vendorData={vendorData}
        />

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
            </div>
            <div className="col-sm-3"></div>
            <div className="col-sm-3">
              <h5 className="ourCompany">Contact Us</h5>
              <div className="footerReach">
                <i className='fas fa-phone'></i> {vendorData.number}<br />
                <i className='fas fa-envelope'></i> {vendorData.email}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default VendorWebProduct;
