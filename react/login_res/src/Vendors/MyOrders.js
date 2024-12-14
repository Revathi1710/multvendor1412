import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import './myorder.css';
import FeedbackModal from './feedbackmodel'; // Correctly import FeedbackModal

const MyOrders = () => {
  const [vendorData, setVendorData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState(0);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  useEffect(() => {
    const vendortoken = window.localStorage.getItem('vendortoken');

    if (!vendortoken) {
      setError('No token found');
      return;
    }

    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          const vendor = response.data.data;
          setVendorData(vendor);

          // Fetch vendor orders
          return axios.get(`${process.env.REACT_APP_API_URL}/vendorOrders/${vendor._id}`);
        } else {
          setError(response.data.message);
        }
      })
      .then(response => {
        if (response && response.data.status === 'ok') {
          setOrders(response.data.orders);
        } else if (response) {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, []);

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const handleFeedback = (order) => { // Corrected to accept order object
    setCurrentOrder(order);
    setShowFeedbackModal(true);
    console.log(`Send feedback for order: ${order._id}`);
  };

  const closeModal = () => {
    setShowFeedbackModal(false);
    setCurrentOrder(null);
  };

  return (
    <div className="update-profile-vendor">
      <VendorHeader />
      <div className="content row mt-5">
        <div className='col-sm-2 mt-5'>
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
                <li><Link to="/Vendor/BusinessProfile">Business Profile</Link></li>
                <li><Link to="/Vendor/BankDetails">Bank Details</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/AllCategory">All Categories</Link></li>
                <li><Link to="/Vendor/AddCategory">Add New Category</Link></li>
              </ul>
            </li>
            {vendorData && vendorData.selectType === "Product Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(3)}>
                  <i className="fa fa-cogs"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
                  <li><Link to="/Vendor/AllProduct">All Product</Link></li>
                  <li><Link to="/Vendor/AddProductVendor">Add Product</Link></li>
                </ul>
              </li>
            )}
            {vendorData && vendorData.selectType === "Service Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(1)}>
                  <i className="fa fa-cogs"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }}>
                  <li><Link to="/Vendor/AllService">All Service</Link></li>
                  <li><Link to="/Vendor/AddService">Add Service</Link></li>
                </ul>
              </li>
            )}
            <li className={`sub-menu list ${activeSubMenu === 2 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(2)}>
                <i className="fa fa-cogs"></i><span>Enquiry</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
                <li><Link to="/Vendor/AllEnquiry">All Enquiry</Link></li>
              </ul>
            </li>
            <ul className='VendorList'>
              <li className='list'><Link to="/Vendor/MyOrders" className='listout'><i className="fa fa-laptop"></i>My Orders</Link></li>
            </ul>
          </ul>
        </div>
        <div className='col-sm-10'>
          <h3>My Orders</h3>
          <div className='container'>
            {orders.length > 0 ? (
              <div className="allenquiry">
                {orders.map(order => (
                  <div className="row container ordercontainer" key={order._id}>
                    <div className='col-sm-4'>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${order.product_id?.image.replace('\\', '/')}`}
                        style={{ width: '200px', height: '200px' }}
                        alt={order.productname}
                      />
                    </div>
                    <div className='col-sm-8'>
                      <h4>Product Details</h4>
                      <div className="orderProductName">{order.productname}</div>
                      <div className="orderProductprice">₹{order.productPrice}</div>
                      <h4 className='mt-2'>Seller Details</h4>
                      <div className="ordersellerdetails"><i className="far fa-user-circle"></i>{order.vendorId.fname}</div>
                      <a href={`tel:${order.vendorId.number}`} className='sellernumber'>
                        <div className="ordersellerdetails"><i className="fa fa-phone"></i>{order.vendorId.number}</div>
                      </a>
                      <div className="ordersellerdetails"><i className='fas fa-map-marker-alt'></i>{order.vendorId.Address}</div>
                      {order.status === 'Completed' && (
                        <button
                          className="btn btn-primary mt-3"
                          onClick={() => handleFeedback(order)} // Pass the order object
                        >
                          Send Feedback
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No orders found.</p>
            )}
            {error && <p className="error">{error}</p>}
          </div>
        </div>
        <FeedbackModal 
          show={showFeedbackModal} 
          order={currentOrder} 
          onClose={closeModal} 
        />
      </div>
    </div>
  );
};

export default MyOrders;
