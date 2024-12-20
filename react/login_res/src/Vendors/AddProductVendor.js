import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
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



const AddProductVendor = () => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [smalldescription, setSmallDescription] = useState('');
    const [image, setImage] = useState('');
    const [description, setDescription] = useState('');
    const [active, setActive] = useState('');
    const [vendorId, setVendorId] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [sellingPrice, setSellingPrice] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubCategories] = useState([]);
    const [galleryImage1, setGalleryImage1] = useState('');
    const [galleryImage2, setGalleryImage2] = useState('');
    const [galleryImage3, setGalleryImage3] = useState('');
    const [galleryImage4, setGalleryImage4] = useState('');
    const [filteredSubcategories, setFilteredSubCategories] = useState([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState('');
    const [profileCompleteness, setProfileCompleteness] = useState(0);
    const [activeSubMenu, setActiveSubMenu] = useState(null);
    const [vendorData, setVendorData] = useState({});
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');

    const [message, setMessage] = useState('');
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
        fetchSubCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getCategoryHome`);
            const data = response.data;
            if (data.status === 'ok') {
                setCategories(data.data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred: ' + error.message);
        }
    };

    const fetchSubCategories = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/getSubCategory`);
            const data = response.data;
            if (data.status === 'ok') {
                setSubCategories(data.data);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('An error occurred: ' + error.message);
        }
    };

    const handleCategoryChange = (e) => {
        const selectedCategoryId = e.target.value;
        const selectedCategoryName = categories.find(cat => cat._id === selectedCategoryId)?.name || '';
    
        setCategory(selectedCategoryId);
        setCategoryName(selectedCategoryName);

        // Filter subcategories based on the selected category
        const filtered = subcategories.filter(subcat => subcat.Category === selectedCategoryId);
        setFilteredSubCategories(filtered);
    };

    const handleSubCategoryChange = (e) => {
        setSelectedSubCategory(e.target.value);
    };

    useEffect(() => {
        const token = localStorage.getItem('vendortoken');
        const storedVendorId = localStorage.getItem('vendorId');
        if (token && storedVendorId) {
            try {
                const decoded = jwtDecode(token);
                setVendorId(storedVendorId);
            } catch (error) {
                console.error('Invalid token or failed to decode:', error);
            }
        } else {
            alert('Vendor not authenticated. Please log in.');
        }
    }, []);

    useEffect(() => {
        if (vendorId) {
            axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken: localStorage.getItem('vendortoken') })
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
        }
    }, [vendorId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!vendorId) {
            alert("Invalid or missing vendorId. Please log in again.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        formData.append('smalldescription', smalldescription);
        formData.append('image', image);
        formData.append('galleryImage1',galleryImage1);
        formData.append('galleryImage2',galleryImage2);
        formData.append('galleryImage3',galleryImage3);
        formData.append('galleryImage4',galleryImage4);
        formData.append('description', description);
        formData.append('active', active);
        formData.append('vendorId', vendorId);
        formData.append('originalPrice', originalPrice);
        formData.append('sellingPrice', sellingPrice);
        formData.append('category', category);
        formData.append('subcategory', selectedSubCategory);

        fetch(`${process.env.REACT_APP_API_URL}/addProduct`, {
            method: "POST",
            body: formData
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 'ok') {
                alert('Product added successfully!');
                window.location.href = "Vendor/AllProduct";
            } else {
                alert(data.message || 'Product addition failed!');
            }
        })
        .catch((error) => {
            console.error("Error:", error);
        });
    };

    const handleSubMenuToggle = (index) => {
        setActiveSubMenu(activeSubMenu === index ? null : index);
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
          <h1 className="title-vendorInfo">Add a New Product</h1>
                    <div className="col-sm-12 mt-2">
                       
                    <form onSubmit={handleSubmit} className="category-form">
             
              <div className="form-row row">
              <div className="form-group col-sm-6">
                                        <label>Category</label>
                                        <select
                                            className="form-control col-sm-6"
                                            value={category}
                                            onChange={handleCategoryChange}
                                            required
                                        >
                                            <option value="">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat._id} value={cat._id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group col-sm-6">
                                        <label>Subcategory</label>
                                        <select
                                            className="form-control"
                                            value={selectedSubCategory}
                                            onChange={handleSubCategoryChange}
                                           
                                        >
                                            <option value="">Select a subcategory</option>
                                            {filteredSubcategories.map((subcat) => (
                                                <option key={subcat._id} value={subcat._id}>
                                                    {subcat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Product Name"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="slug">Slug</label>
                  <input
                    type="text"
                    id="slug"
                    placeholder="Product Slug"
                    className="form-control"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="originalPrice">Original Price</label>
                  <input
                    type="number"
                    id="originalPrice"
                    placeholder="Original Price"
                    className="form-control"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6 ">
                  <label htmlFor="sellingPrice">Selling Price</label>
                  <input
                    type="number"
                    id="sellingPrice"
                    placeholder="Selling Price"
                    className="form-control"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="smalldescription">Small Description</label>
                  <textarea
                    id="smalldescription"
                    className="form-control"
                    placeholder="Small Description"
                    rows="3"
                    value={smalldescription}
                    onChange={(e) => setSmallDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    className="form-control"
                    placeholder="Product Description"
                    rows="5"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="image">Image</label>
                  <input
                    type="file"
                    id="image"
                    className="form-control"
                    onChange={(e) => setImage(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label>Status</label>
                  <div className="status-options">
                    <label className="mr-3">
                      <input
                        type="radio"
                        name="status"
                        value={true}
                        checked={active === true}
                        onChange={() => setActive(true)}
                      />{' '}
                      Active
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="status"
                        value={false}
                        checked={active === false}
                        onChange={() => setActive(false)}
                      />{' '}
                      Inactive
                    </label>
                  </div>
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="galleryImage1">Gallery Image</label>
                  <input
                    type="file"
                    id="galleryImage1"
                    className="form-control"
                    onChange={(e) => setGalleryImage1(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="galleryImage2">Gallery Image2</label>
                  <input
                    type="file"
                    id="galleryImage2"
                    className="form-control"
                    onChange={(e) => setGalleryImage2(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="galleryImage3">Gallery Image3</label>
                  <input
                    type="file"
                    id="galleryImage3"
                    className="form-control"
                    onChange={(e) => setGalleryImage3(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div>
                <div className="form-group col-sm-6">
                  <label htmlFor="galleryImage4">Gallery Image4</label>
                  <input
                    type="file"
                    id="galleryImage4"
                    className="form-control"
                    onChange={(e) => setGalleryImage4(e.target.files[0])}
                    accept="image/*"
                    required
                  />
                </div> 
                
                <div className="form-group col-12 mt-3">
                  <button type="submit" className="btn btn-primary submitbtn ">
                    Add Product
                  </button>
                </div>
              </div>
            </form>
          
                    </div>
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
            </div>
        </div>
    );
};

export default AddProductVendor;
