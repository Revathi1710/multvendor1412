import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Ensure axios is imported
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import './addcategory.css';

const AddsubCategory = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [active, setActive] = useState(true);
  const [message, setMessage] = useState('');
  const [categories, setCategories] = useState([]); // Initialize categories state
  const [category, setCategory] = useState(''); // Initialize category state

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getCategoryHome`);
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

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Prepare form data for submission
    const formData = new FormData();
    formData.append('CategoryId', category); // Ensure this is the ObjectId
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('image', image);
    formData.append('active', active);
  
    axios.post(`${process.env.REACT_APP_API_URL}/addMainSubCategory`, formData)
      .then((response) => {
        console.log(response); // Log the response
        const data = response.data;
        if (data.status === 'ok') {
          alert('SubCategory added successfully!');
          window.location.href = "/SuperAdmin/AllCategory";
        } else {
          alert('SubCategory addition failed!');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage('An error occurred while adding the subcategory.');
      });
  };

  return (
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Add a New Sub Category</h1>
        {message && <div className="alert alert-danger">{message}</div>}
        <form onSubmit={handleSubmit} className="category-form">
          <div className='form-group mb-4'>
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
                placeholder='Name'
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
                placeholder='Slug'
                className='form-control'
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
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
          <button type="submit" className="submit-btn">Add Sub Category</button>
        </form>
      </div>
    </div>
  );
};

export default AddsubCategory;
