import React, { useState } from 'react';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import './addcategory.css'; // Import a CSS file for styling

const AddCategory = () => {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState(''); // Uncomment and include this in the form
  const [active, setActive] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/addcategory`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, slug, description, active })
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.status === 'ok') {
        alert('Category added successfully!');
        window.location.href = "/SuperAdmin/AllCategories";
      } else {
        alert(data.message || 'Category addition failed!');
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert('An error occurred! Please try again later.');
    });
  };

  return (
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Add a New Category</h1>
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
                required
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
                required
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
          <button type="submit" className="submit-btn">Add Category</button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
