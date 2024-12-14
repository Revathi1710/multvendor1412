import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import Sidebar from './Vendorsidebar '; // Correct path and file name
import '../SuperAdmin/addcategory.css';

const AddProductvendor = () => {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState(''); // You can remove this if slug is generated in backend
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [active, setActive] = useState(true);
    const [vendorId, setVendorId] = useState('');
    const [pricerange, setPricerange] = useState(''); // Consistent with backend
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getcategories`);
        const data = response.data;
        if (data.status === 'ok') {
          setCategories(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
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
  
    const handleSubmit = (e) => {
      e.preventDefault();
  
      if (!vendorId) {
        alert("Invalid or missing vendorId. Please log in again.");
        return;
      }
  
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('image', image);
      formData.append('active', active);
      formData.append('vendorId', vendorId);
      formData.append('Pricerange', pricerange); // Consistent with backend
      formData.append('category', category);
  
      fetch(`${process.env.REACT_APP_API_URL}/addService`, {
        method: "POST",
        body: formData
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "addProduct");
        if (data.status === 'ok') {
          alert('Service added successfully!');
          window.location.href = "/Vendor/AllProduct";
        } else {
          alert(data.message || 'Service addition failed!');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    };
  
    return (
      <div className="add-category-container">
        <Sidebar />
        <div className="add-category-content">
          <h1 className="page-title">Add a New Service</h1>
          <form onSubmit={handleSubmit} className="category-form">
            <input type="hidden" id="vendorId" value={vendorId} />
            <div className='form-group  mb-4'>
              <label htmlFor="category">Category</label>
              <select id="category" className="form-control" onChange={(e) => setCategory(e.target.value)} value={category}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
                <option value="others">Others</option>
              </select>
            </div>
            <div className='form-row row'>
              <div className='form-group col-sm-6 mb-4'>
                <label htmlFor="name">Service Name</label>
                <input
                  type='text'
                  id='name'
                  placeholder='Service Name'
                  className='form-control'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='form-group col-sm-6 mb-4'>
                <label htmlFor="pricerange"> Price Range</label>
                <input
                  type='text'
                  id='pricerange'
                  placeholder='Price Range'
                  className='form-control'
                  value={pricerange}
                  onChange={(e) => setPricerange(e.target.value)}
                />
              </div>
              <div className='form-group mb-4'>
                <label htmlFor="description">Description</label>
                <textarea
                  id='description'
                  className='form-control'
                  placeholder='Description'
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className='form-group col-sm-6 mb-4'>
                <label htmlFor="image">Image</label>
                <input
                  type='file'
                  id='image'
                  className='form-control'
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className='form-group col-sm-6 mb-4'>
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
            </div>
            <button type="submit" className="submit-btn">Add Service</button>
          </form>
        </div>
      </div>
    );
  };
  
  export default AddProductvendor;
  