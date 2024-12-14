import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import axios from 'axios';

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getMaincategories`);
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
  const handleDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteCategorySuperAdmin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          // Remove the deleted category from the state
          setCategories(categories.filter(category => category._id !== categoryId));
          alert('Category deleted successfully');
        } else {
          console.error('Error:', data.message);
          setMessage('Error deleting category: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Delete error:', error);
        setMessage('Error deleting category');
      });
    }
  };

  const handleUpdateActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the current status
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateStatusCategory/${id}`, { active: updatedStatus });
      const data = response.data;

      if (data.status === 'ok') {
        setCategories(categories.map(category => 
          category._id === id ? { ...category, active: updatedStatus } : category
        ));
        setMessage('Category status updated successfully.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  const handleUpdate = (categoryId) => {
    window.location.href = `/SuperAdmin/UpdateCategory/${categoryId}`;
  };
  return (
    <div>
      <Sidebar />
      <div className="container" style={{ marginLeft: '250px' }}>
        <h1>All Categories</h1>
        {message && <p>{message}</p>}
        {categories.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Slug</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category.slug}</td>
                  <td>
                    <div className="form-check form-switch">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`statusSwitch${category._id}`} 
                        checked={category.active} 
                        onChange={() => handleUpdateActive(category._id, category.active)}
                      />
                      <label className="form-check-label" htmlFor={`statusSwitch${category._id}`}>
                        {category.active}
                      </label>
                    </div>
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
