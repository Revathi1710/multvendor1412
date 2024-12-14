import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import './addcategory.css';

const UpdateProductVendor = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [URL, setURL] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSliderDetails();
  }, []);

  const fetchSliderDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/GetSliderId/${id}`);
      const data = response.data;

      if (data.status === 'ok') {
        const slider = data.data;
        setName(slider.name);
        setURL(slider.URL);
        if (slider.image) {
          setImagePreview(`${process.env.REACT_APP_API_URL}/${slider.image.replace('\\', '/')}`);
        }
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('_id', id);
    formData.append('name', name);
    formData.append('URL', URL);
    if (image) formData.append('image', image);

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateSlider`, formData);
      const data = response.data;

      if (data.status === 'ok') {
        alert('Slider updated successfully!');
        navigate('/SuperAdmin/AllSlider');
      } else {
        alert(data.message || 'Slider update failed!');
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An error occurred while updating the slider.');
    }
  };

  return (
    <div className="add-category-container">
      <Sidebar />
      <div className="add-category-content">
        <h1 className="page-title">Update Slider</h1>
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
                onChange={handleImageChange}
              />
              {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100px', marginTop: '10px' }} />}
            </div>
          </div>
          <button type="submit" className="submit-btn">Update Slider</button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProductVendor;
