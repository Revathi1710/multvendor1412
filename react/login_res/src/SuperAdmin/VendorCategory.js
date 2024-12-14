import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';

import '../SuperAdmin/addcategory.css';
import '../Vendors/sidebar2.css';
import Sidebar from './sidebar';
import '../Vendors/businessProfile.css';
import './Vendorview.css';
import '../Vendors/table.css';

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/AdminVendorCategory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id })
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          setCategories(data.data);
        } else {
          console.error('Error:', data.message);
          setMessage('Error fetching categories: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setMessage('Error fetching categories');
      });
  }, [id]);

  const handleUpdate = (categoryId) => {
    navigate(`/Vendor/UpdateCategory/${categoryId}`);
  };

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteCategoryVendor`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId })
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ok') {
            setCategories(categories.filter(category => category._id !== categoryId));
            alert('Category deleted successfully');
          } else {
            console.error('Error:', data.message);
            setMessage('Error deleting category: ' + data.message);
          }
        })
        .catch(error => {
          console.error('Delete error:', error);
          setMessage('Error deleting category');
        });
    }
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
          <div>
            <div className="title">
              <h2>All Categories</h2>
            </div>
            {message && <p>{message}</p>}
            {categories.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Slug</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.slug}</td>
                      <td>
                        <span className={`badge ${category.active ? 'bg-success' : 'bg-danger'}`}>
                          {category.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleUpdate(category._id)}
                        >
                          Update
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(category._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No Categories found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
