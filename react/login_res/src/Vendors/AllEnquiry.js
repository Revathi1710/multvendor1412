import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import '../SuperAdmin/addcategory.css';
import './table.css';
import './myorder.css';

const AllEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState({ selectType: '' });

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    const vendortoken = localStorage.getItem('vendortoken');

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

    fetch(`${process.env.REACT_APP_API_URL}/getVendorEnquiry`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        setEnquiries(data.data);
      } else {
        console.error('Error:', data.message);
        setMessage('Error fetching enquiries: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setMessage('Error fetching enquiries');
    });
  }, []);

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const updateStatus = (enquiryId, status) => {
    axios.post(`${process.env.REACT_APP_API_URL}/updateEnquiryStatus`, { enquiryId, status })
      .then(response => {
        if (response.data.status === 'ok') {
          setEnquiries(enquiries.map(enquiry =>
            enquiry._id === enquiryId ? { ...enquiry, status } : enquiry
          ));
        } else {
          console.error('Error updating status:', response.data.message);
          setMessage('Error updating status: ' + response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage('Error updating status');
      });
  };

  return (
    <div>
      <VendorHeader />
      <div className="content row mt-4">
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
            {vendorData.selectType === "Product Based Company" && (
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
  {vendorData.selectType === "Service Based Company" && (
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
                <li><Link to="/Vendor/AllEnquiryVendor">All Enquiry</Link></li>
              </ul>
             
            </li>
            <ul className='VendorList'>
            <li className='list'><Link to="/Vendor/MyOrders" className='listout'><i className="fa fa-laptop"></i>My Orders</Link></li>
          </ul>
          </ul>
        </div>
        <div className="col-sm-7">
          <div className="title">
            <h2>All Enquiries</h2>
          </div>
          <div className='allenquiry'>
            {message && <p>{message}</p>}
            {enquiries.length > 0 ? (
              <div>
                {enquiries.map((enquiry) => (
                  <div className="row container ordercontainer" key={enquiry._id}>
                    <div className='col-sm-4'>
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${enquiry.product_id?.image.replace('\\', '/')}`}
                        style={{ width: '200px', height: '200px' }}
                      />
                    </div>
                    <div className='col-sm-8'>
                      <div className="orderProductName">{enquiry.productname}</div>
                      <div className="orderProductprice">₹{enquiry.productPrice}</div>
                      <a href={`tel:${enquiry.UserNumber}`} className='sellernumber'>
                        <div className="ordersellerdetails"><i className="fa fa-phone"></i>{enquiry.UserNumber}</div>
                      </a>
                    </div>
                    <div className='row'>
                    <button
  className={`btn col-sm-4 ${enquiry.status === 'Completed' ? 'btn-success' : 'btn-light'}`}
  onClick={() => updateStatus(enquiry._id, 'Completed')}
>
  Completed
</button>
<button
  className={`btn col-sm-4 ${enquiry.status === 'Cancelled' ? 'btn-danger' : 'btn-light'}`}
  onClick={() => updateStatus(enquiry._id, 'Cancelled')}
>
  Cancelled
</button>
<button
  className={`btn col-sm-4 ${enquiry.status === 'Pending' ? 'btn-warning' : 'btn-light'}`}
  onClick={() => updateStatus(enquiry._id, 'Pending')}
>
  Pending
</button>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No Enquiries found</p>
            )}
          </div>
        </div>
        <div className='col-sm-3 mt-5'>
        </div>
      </div>
    </div>
  );
};

export default AllEnquiry;
