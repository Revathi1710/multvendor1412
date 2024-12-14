import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProducts = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Fetch categories when the component mounts
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

    fetchCategories();

    // Fetch user information (mocked for this example)
    // Replace with actual user fetching logic
    setUser({
      email: 'user@example.com',
      name: 'John Doe',
    });
  }, []);

  const handleSelectChange = (e) => {
    if (e.target.value === 'others') {
      setShowNewCategoryInput(true);
    } else {
      setShowNewCategoryInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('slug', slug);
    formData.append('category', showNewCategoryInput ? newCategory : e.target.category.value);
    formData.append('image', image);
    formData.append('userEmail', user.email);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/addproduct`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.status === 'ok') {
        setProducts([...products, response.data.product]);
        setMessage('Product added successfully!');
      } else {
        setMessage('Failed to add product: ' + response.data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div className="">
      <div className="">
        <h1 className="page-title">Add a New Category</h1>
        {message && <p className="message">{message}</p>}
        <form onSubmit={handleSubmit} className="category-form">
          <div className='form-row row'>
            <div className='form-group col-sm-6 mb-4'>
              <label htmlFor="category">Category</label>
              <select id="category" className="form-control" onChange={handleSelectChange}>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
                <option value="others">Others</option>
              </select>
            </div>
            {showNewCategoryInput && (
              <div className='form-group col-sm-6 mb-4'>
                <label htmlFor="newCategory">New Category</label>
                <input
                  type='text'
                  id='newCategory'
                  placeholder='New Category Name'
                  className='form-control'
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              </div>
            )}
            <button type="button" className="btn btn-primary" onClick={() => setProducts([...products, {}])}>
              +Add Products
            </button>
          </div>

          {products.map((_, index) => (
            <div key={index} className="product-details">
              <div className='form-group col-sm-6 mb-4'>
                <label htmlFor={`name-${index}`}>Name</label>
                <input
                  type='text'
                  id={`name-${index}`}
                  placeholder='Product Name'
                  className='form-control'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className='form-group col-sm-6 mb-4'>
                <label htmlFor={`image-${index}`}>Image</label>
                <input
                  type='file'
                  id={`image-${index}`}
                  placeholder='Product Image'
                  className='form-control'
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
            </div>
          ))}

          <button type="submit" className="submit-btn">Add Details</button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;
