import React, { useState } from 'react';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import './addcategory.css';

const AddProductvendor = () => {
  const [name, setName] = useState('');
  const [URL, setURL] = useState('');

  const [image, setImage] = useState(null);
 

  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Prepare form data for submission
    const formData = new FormData();
    formData.append('name', name);
    formData.append('URL', URL);
    formData.append('image', image);
  
    fetch(`${process.env.REACT_APP_API_URL}`, {
      method: "POST",
      body: formData
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, "addcategory");
      if (data.status === 'ok') {
        alert('Slider added successfully!');
        window.location.href = "/SuperAdmin/AllCategory";
      } else {
        alert('Slider addition failed!');
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
        <h1 className="page-title">Add a New Slider</h1>
        <form onSubmit={handleSubmit} className="category-form">
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
              <label htmlFor="URL">URL</label>
              <input
                type='text'
                id='URL'
                placeholder='URL'
                className='form-control'
                value={URL}
                onChange={(e) => setURL(e.target.value)}
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
           
          </div>
          <button type="submit" className="submit-btn">Add Slider</button>
        </form>
      </div>
    </div>
  );
};

export default AddProductvendor;
