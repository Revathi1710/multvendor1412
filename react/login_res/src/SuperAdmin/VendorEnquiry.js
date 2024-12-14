import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

import '../SuperAdmin/addcategory.css';
import '../Vendors/sidebar2.css';
import Sidebar from './sidebar';
import '../Vendors/businessProfile.css';
import './Vendorview.css';
import '../Vendors/table.css';

const AllVendorEnquiry = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [message, setMessage] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState({});
  const { id } = useParams();

  useEffect(() => {
    if (!id) return; // Check if ID exists

    const fetchEnquiries = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/AdminVendorEnquiry`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });

        const data = await response.json();

        if (data.status === 'ok') {
          setEnquiries(data.data);
        } else {
          setMessage('Error fetching enquiries: ' + data.message);
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setMessage('Error fetching enquiries');
      }
    };

    fetchEnquiries();
  }, [id]);

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  return (
    <div>
      <Sidebar />
      <div className="content content2 row mt-5">
        <div className='col-sm-4 mt-5'>
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
                <li><Link to={`/SuperAdmin/VendorBusiness/${id}`}>Business Profile</Link></li>
                <li><Link to={`/SuperAdmin/VendorBank/${id}`}>Bank Profile</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }}>
                <li><Link to={`/SuperAdmin/VendorCategory/${id}`}>All Category</Link></li>
              </ul>
            </li>
            {vendorData.selectType === "Product Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(3)}>
                  <i className="fa fa-cogs"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }}>
                  <li><Link to={`/SuperAdmin/VendorProduct/${id}`}>All Product</Link></li>
                </ul>
              </li>
            )}
            {vendorData.selectType === "Service Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(1)}>
                  <i className="fa fa-cogs"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }}>
                  <li><Link to={`/SuperAdmin/VendorService/${id}`}>All Service</Link></li>
                </ul>
              </li>
            )}
            <li className={`sub-menu list ${activeSubMenu === 2 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(2)}>
                <i className="fa fa-cogs"></i><span>Enquiry</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 2 ? 'block' : 'none' }}>
                <li><Link to={`/SuperAdmin/VendorEnquiry/${id}`}>All Enquiry</Link></li>
              </ul>
            </li>
          </ul>
        </div>
        <div className='col-sm-7'>
          <div className="">
            <div className="title">
              <h2>All Enquiries</h2>
            </div>
            {message && <p>{message}</p>}
            {enquiries.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Customer Name</th>
                    <th>Customer Number</th>
                    <th>Product Price</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.map((enquiry) => (
                    <tr key={enquiry._id}>
                      <td>{enquiry.productname}</td>
                      <td>{enquiry.Username}</td>
                      <td>{enquiry.UserNumber}</td>
                      <td>{enquiry.productPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Enquiries found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllVendorEnquiry;
