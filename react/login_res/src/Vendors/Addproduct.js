import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import
import Sidebar from './Vendorsidebar '; // Correct path and file name
import '../SuperAdmin/addcategory.css';

const AddProductvendor = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [smalldescription, setSmallDescription] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [category, setCategory] = useState(''); // Add category state
  const [categories, setCategories] = useState([]); // State for categories
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
    formData.append('slug', slug);
    formData.append('smalldescription', smalldescription);
    formData.append('image', image);
    formData.append('description', description);
    formData.append('active', active);
    formData.append('vendorId', vendorId);
    formData.append('originalPrice', originalPrice);
    formData.append('sellingPrice', sellingPrice);
    formData.append('category', category); // Add category to formData

    fetch(`${process.env.REACT_APP_API_URL}/addProduct`, {
      method: "POST",
      body: formData
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "addProduct");
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


  return (
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Add a New Product</h1>
        <form onSubmit={handleSubmit} className="category-form">
          <input
            type="hidden"
            id="vendorId"
            value={vendorId}
          />
          <div className='form-group  mb-4'>
            <label htmlFor="category">Category</label>
            <select id="category" className="form-control" onChange={(e) => setCategory(e.target.value)} value={category}>
              <option value="">Select Category</option>
              {categories.map((category) => (
               <option key={category._id} value={category._id}>
               {category.name}
             </option>
                
              ))}
              <option value="others">Others</option>
            </select>
          </div>
          <div className='form-row row'>
            <div className='form-group col-sm-6 mb-4'>
              <label htmlFor="name">Name</label>
              <input
                type='text'
                id='name'
                placeholder='Product Name'
                className='form-control'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className='form-group col-sm-6 mb-4'>
              <label htmlFor="slug">Slug</label>
              <input
                type='text'
                id='slug'
                placeholder='Product Slug'
                className='form-control'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <div className='form-group col-sm-6 mb-4'>
              <label htmlFor="originalPrice">Original Price</label>
              <input
                type='text'
                id='originalPrice'
                placeholder='Original Price'
                className='form-control'
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
            <div className='form-group col-sm-6 mb-4'>
              <label htmlFor="sellingPrice">Selling Price</label>
              <input
                type='text'
                id='sellingPrice'
                placeholder='Selling Price'
                className='form-control'
                value={sellingPrice}
                onChange={(e) => setSellingPrice(e.target.value)}
              />
            </div>
            <div className='form-group mb-4'>
              <label htmlFor="smalldescription">Small Description</label>
              <textarea
                id='smalldescription'
                className='form-control'
                placeholder='Small Description'
                rows="3"
                value={smalldescription}
                onChange={(e) => setSmallDescription(e.target.value)}
              />
            </div>
            <div className='form-group mb-4'>
              <label htmlFor="description">Description</label>
              <textarea
                id='description'
                className='form-control'
                placeholder='Product Description'
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
          <button type="submit" className="submit-btn">Add Product</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductvendor;
