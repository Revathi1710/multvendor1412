import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';// Correct import

import '../SuperAdmin/addcategory.css'; // CSS for styling
import axios from 'axios'; // Ensure axios is imported

import { Link } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import infogif from '../icons/gifinfo.gif';
import noimg from '../icons/noimg.png';
import loginlearn1 from '../icons/loginlearn1.png';
import profilelearn from '../icons/profilelearn.png';
import loginlearn from '../icons/productlearn.png';
import orderlearn from '../icons/orderlearn.png';
import securelearn from '../icons/securelearn.png';
const AddCategoryvendor = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [categories, setCategories] = useState([]); // State for categories
  const [category, setCategory] = useState(''); // State for selected category
  const [image, setImage] = useState(null); // State for image file
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState({ selectType: '' }); // Define vendorData state
  const [message, setMessage] = useState('');
  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };
  useEffect(() => {
    const token = localStorage.getItem('vendortoken');
    const storedVendorId = localStorage.getItem('vendorId');
    if (token && storedVendorId) {
      try {
        const decoded = jwtDecode(token); // Correct function name
        setVendorId(storedVendorId); // Set the vendorId from localStorage
      } catch (error) {
        console.error('Invalid token or failed to decode:', error);
      }
    } else {
      alert('Vendor not authenticated. Please log in.');
      // Redirect to login page or show an error
    }
  }, []);

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    // You need to define vendortoken or remove this request if not used
    const vendortoken =  localStorage.getItem('vendortoken'); // Define or get vendortoken if needed

    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setMessage(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setMessage(error.message);
      });
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getcategoriesMain`);
      const data = response.data;

      if (data.status === 'ok') {
        setCategories(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!vendorId) {
      alert("Invalid or missing vendorId. Please log in again.");
      return;
    }
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('active', active);
    formData.append('vendorId', vendorId);
    formData.append('MainCategoryId', category);
    if (image) formData.append('image', image); // Append the image file
  
    try {
      const response = await axios.post(`http://localhost:5000/addcategoryVendor`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const data = response.data;
      if (data.status === 'ok') {
        alert('Category added successfully!');
        window.location.href = "/Vendor/AllCategory";
      } else {
        alert(data.message || 'Category addition failed!');
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      alert('An error occurred: ' + (error.response ? error.response.data.message : error.message));
    }
  };
  

  return (
    <div className="update-profile-vendor">
      <VendorHeader />
      <div className="content row mt-4">
        <div className='col-sm-3'>
          <ul className='VendorList'>
            <li className='list'><i className="fa fa-laptop sidebaricon"></i> Dashboard</li>
          </ul>
          <ul className="nano-content VendorList">
            <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/UserProfile" className='listsidebar'>User Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BusinessProfile" className='listsidebar'>Business Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BankDetails" className='listsidebar'>Bank Details</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/AllCategory" className='listsidebar'>All Categories</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/AddCategory" className='listsidebar'>Add New Category</Link></li>
              </ul>
            </li>
            {vendorData && vendorData.selectType === "Product Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(3)}>
                  <i className="fa fa-cogs sidebaricon"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                  <li className='list_sidebar'><Link to="/Vendor/AllProduct" className='listsidebar'>All Products</Link></li>
                  <li className='list_sidebar'><Link to="/Vendor/AddProductVendor" className='listsidebar'>Add Product</Link></li>
                </ul>
              </li>
            )}
            {vendorData && vendorData.selectType === "Service Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(1)}>
                  <i className="fa fa-cogs sidebaricon"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                  <li className='list_sidebar'><Link to="/Vendor/AllService" className='listsidebar'>All Services</Link></li>
                  <li className='list_sidebar'><Link to="/Vendor/AddService" className='listsidebar'>Add Service</Link></li>
                </ul>
              </li>
            )}
            <ul className='VendorList'>
              <li className='list'><Link to="/Vendor/MyOrders" className='listout listsidebar'><i className="fa fa-laptop sidebaricon"></i>My Orders</Link></li>
            </ul>
          </ul>
          <img 
            src={infogif} 
            alt="Loading..." 
            style={{ height: 'auto', borderRadius: '10px' }} 
          />
        </div>
      <div className="col-sm-6 add-category-content">
        <h1 className="title-vendorInfo">Add a New Category</h1>
        <form onSubmit={handleSubmit} className="category-form">
          <div className='form-row row'>
            <div className='form-group mb-2'>
              <label htmlFor="category">Category</label>
              <select id="category" className="form-control" onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
                <option value="others">Others</option>
              </select>
            </div>
            <div className='form-group col-sm-6 mb-2'>
              <label htmlFor="name">Name</label>
              <input
                type='text'
                id='name'
                placeholder='Category Name'
                className='form-control'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='form-group col-sm-6 mb-2'>
              <label htmlFor="slug">Slug</label>
              <input
                type='text'
                id='slug'
                placeholder='Category Slug'
                className='form-control'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className='form-group mb-2'>
              <label htmlFor="description">Description</label>
              <textarea
                id='description'
                className='form-control'
                placeholder='Category Description'
                rows="5"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className='form-group col-sm-6 '>
              <label>Status</label>
              <div className="status-options">
                <label>
                  <input
                    type='radio'
                    name="status"
                    value={true}
                    checked={active === true}
                    onChange={() => setActive(true)}
                  /> Active
                </label>
                <label>
                  <input
                    type='radio'
                    name="status"
                    value={false}
                    checked={active === false}
                    onChange={() => setActive(false)}
                  /> Inactive
                </label>
              </div>
            </div>
            <div className='form-group col-sm-6 mb-2'>
              <label htmlFor="image">Image</label>
              <input
                type='file'
                id='image'
                className='form-control'
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-primary submitbtn">Add Category</button>
        </form>
      </div>

      <div className='col-sm-3'>
          <div className='learning-container'>
          <h2 className='title-vendorInfo'>Learning Center</h2>
          <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Login</span>
              <div class="card-content">
                <span class=" learncontent">
                Simply enter your username and password to log in and get started!</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={loginlearn1} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Create Your Vendor Profile </span>
              <div class="card-content">
                <span class=" learncontent">
                Set up your vendor profile by providing your details to start selling on our platform.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={profilelearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Add Your Products</span>
              <div class="card-content">
                <span class=" learncontent">
                Easily list your products with descriptions, images, and prices to attract customers.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={loginlearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Manage Orders</span>
              <div class="card-content">
                <span class=" learncontent">
                Track and manage your orders with real-time updates for a smooth selling experience.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={orderlearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Get Paid Securely</span>
              <div class="card-content">
                <span class=" learncontent">
                Receive payments directly to your account with our secure and reliable payment system.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={securelearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
      </div>
    </div>
    </div>  </div>
  );
};

export default AddCategoryvendor;
