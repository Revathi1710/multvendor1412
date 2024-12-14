import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './Vendorsidebar '; // Ensure this path is correct
import '../SuperAdmin/addcategory.css';

const UpdateCategoryVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProductDetails();
    fetchCategories();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/GetCategoryVendor/${id}`);
      const data = response.data;

      if (data.status === 'ok') {
        const product = data.data;
        setName(product.name);
        setSlug(product.slug);
        setDescription(product.description);
        setActive(product.active);
        setCategory(product.category);
        setImagePreview(`${process.env.REACT_APP_API_URL}/uploads/${product.image}`); // Set image preview URL
      } else {
        setMessage('Failed to fetch category details.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getCategories`); // Assuming endpoint for categories
      setCategories(response.data.data);
    } catch (error) {
      setMessage('Failed to fetch categories.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Set preview URL
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('_id', id);
    formData.append('category', category);
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('description', description);
    formData.append('active', active);
   
    if (image) {
      formData.append('image', image);
    }
  
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateCategoryVendor`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.data.status === 'ok') {
        alert('Category updated successfully!');
        navigate('/Vendor/AllCategory');
      } else {
        alert(response.data.message || 'Category update failed!');
      }
    } catch (error) {
      console.error('Error:', error); // Logs the error object
      if (error.response) {
        console.error('Error Response:', error.response); // Logs detailed response
        alert(`Update failed: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        console.error('Error Request:', error.request); // Logs the request that was sent
        alert('No response received from server.');
      } else {
        console.error('Error Message:', error.message); // Logs general error message
        alert('An error occurred: ' + error.message);
      }
    }
  };
  

  return (
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Update Category</h1>
        <form onSubmit={handleSubmit} className="category-form">
          <div className='form-group mb-4'>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              className="form-control"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
          </div>
          <div className='form-group mb-4'>
            <label htmlFor="image">Image</label>
            <input
              type='file'
              id='image'
              className='form-control'
              onChange={handleImageChange}
            />
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Image preview" style={{ width: '100px', height: '100px' }} />
              </div>
            )}
          </div>
          <div className='form-row row'>
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
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className='form-group'>
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
          <button type="submit" className="submit-btn">Update Category</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default UpdateCategoryVendor;
