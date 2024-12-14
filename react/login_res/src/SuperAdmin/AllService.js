import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import axios from 'axios';
import '../Vendors/table.css';
const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch categories when the component mounts
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getServiceMain`);
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
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_API_URL}/deletecategory/${id}`);
      const data = response.data;

      if (data.status === 'ok') {
        setCategories(categories.filter(category => category._id !== id));
        setMessage('Category deleted successfully.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  const handleUpdate = (id) => {
    // Implement your update logic here
    // For example, navigate to an update page or open a modal with category details
    console.log(`Update category with id: ${id}`);
  };

  return (
    <div>
      <Sidebar />
      <div className="container table" style={{ marginLeft: '200px' }}>

        <h1>All Categories</h1>
        {message && <p>{message}</p>}
        {categories.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                
                
               
                <th>Status</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                     <td>
                    {category.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${category.image.replace('\\', '/')}`}
                        alt={category.name}
                        style={{ width: '50px', height: '50px' }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{category.name}</td>
                 
                  <td>
                    <span className={`badge ${category.active ? 'bg-success' : 'bg-danger'}`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdate(category._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(category._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </div>
  );
};

export default AllCategory;
