import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';// Correct import
import Sidebar from './Vendorsidebar '; // Ensure the correct path
import '../SuperAdmin/addcategory.css'; // CSS for styling
import axios from 'axios'; // Ensure axios is imported

const AddCategoryvendor = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [vendorId, setVendorId] = useState('');
  const [categories, setCategories] = useState([]); // State for categories
  const [category, setCategory] = useState(''); // State for selected category
  const [image, setImage] = useState(null); // State for image file

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
    formData.append('category', category);
    if (image) formData.append('image', image); // Append the image file
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addcategoryVendor`, formData, {
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
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Add a New Category</h1>
        <form onSubmit={handleSubmit} className="category-form">
          <div className='form-row row'>
            <div className='form-group mb-4'>
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
            <div className='form-group col-sm-6 mb-4'>
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
            <div className='form-group col-sm-6 mb-4'>
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
            <div className='form-group mb-4'>
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
            <div className='form-group col-sm-6 mb-4'>
              <label htmlFor="image">Image</label>
              <input
                type='file'
                id='image'
                className='form-control'
                onChange={(e) => setImage(e.target.files[0])}
              />
            </div>
          </div>
          <button type="submit" className="submit-btn">Add Category</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategoryvendor;
