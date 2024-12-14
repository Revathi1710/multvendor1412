import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from './sidebar'; 
import './addcategory.css';

const UpdateCategoryVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [active, setActive] = useState(true);
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log('Category ID:', id); // Debug: Ensure this logs the correct ID
    fetchProductDetails();
    
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/GetCategory/${id}`);
      const data = response.data;

      if (data.status === 'ok') {
        const product = data.data;
        setName(product.name);
        setSlug(product.slug);
        setDescription(product.description);
        setActive(product.active);
        setCategory(product.category);
        setImagePreview(`http://localhost:5000/${product.image}`);
      } else {
        setMessage('Failed to fetch category details.');
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!id) {
      alert('Invalid category ID');
      return;
    }

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
      const response = await axios.put('http://localhost:5000/updateCategory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'ok') {
        alert('Category updated successfully!');
        navigate('/SuperAdmin/AllCategories');
      } else {
        alert(response.data.message || 'Category update failed!');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response) {
        alert(`Update failed: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        alert('No response received from server.');
      } else {
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
