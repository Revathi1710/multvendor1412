import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Ensure the correct path
import './addcategory.css'; // Check path
import '../Vendors/table.css'; // Check path
import axios from 'axios';

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getProduct`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 'ok') {
          setProducts(data.data);
        } else {
          console.error('Error:', data.message);
          setMessage('Error fetching products: ' + data.message);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setMessage('Error fetching products');
      });
  }, []);

  const handleUpdateActive = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the current status
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateStatusProduct/${id}`, { active: updatedStatus });
      const data = response.data;

      if (data.status === 'ok') {
        setProducts(products.map(product => 
          product._id === id ? { ...product, active: updatedStatus } : product
        ));
        setMessage('Product status updated successfully.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };
  const handleUpdateFeature = async (id, currentStatus) => {
    try {
      const updatedStatus = !currentStatus; // Toggle the current status
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/updateFeatureProduct/${id}`, { active: updatedStatus });
      const data = response.data;

      if (data.status === 'ok') {
        setProducts(products.map(product => 
          product._id === id ? { ...product, active: updatedStatus } : product
        ));
        setMessage('Product status updated successfully.');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };


  const handleUpdate = (productId) => {
    window.location.href = `/SuperAdmin/UpdateProduct/${productId}`;
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteProductVendor`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status === 'ok') {
            setProducts(products.filter((product) => product._id !== productId));
            setMessage('Product deleted successfully');
          } else {
            console.error('Error:', data.message);
            setMessage('Error deleting product: ' + data.message);
          }
        })
        .catch((error) => {
          console.error('Delete error:', error);
          setMessage('Error deleting product');
        });
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="" style={{ marginLeft: '250px' }}>
        <div className="title">
          <h2>All Products</h2>
        </div>
        {message && <p>{message}</p>}
        {products.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Status</th>
                <th>Feacture</th>
                <th>Actions</th>
                
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>
                    {product.image ? (
                      <img
                        src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`}
                        alt={product.name}
                        style={{ width: '50px', height: '50px' }}
                      />
                    ) : (
                      <span>No Image</span>
                    )}
                  </td>
                  <td>{product.slug}</td>
                  <td>
  <div className="form-check form-switch">
    <input 
      className="form-check-input" 
      type="checkbox" 
      id={`statusSwitch${product._id}`} 
      checked={product.active} 
      onChange={() => handleUpdateActive(product._id, product.active)}
    />
    <label className="form-check-label" htmlFor={`statusSwitch${product._id}`}>
      {product.active}
    </label>
  </div>
</td>
<td>
  <div className="form-check form-switch">
    <input 
      className="form-check-input" 
      type="checkbox" 
      id={`featureSwitch${product._id}`} 
      checked={product.feature} 
      onChange={() => handleUpdateFeature(product._id, product.feature)}
    />
    <label className="form-check-label" htmlFor={`featureSwitch${product._id}`}>
      {product.feature}
    </label>
  </div>
</td>

                  <td>
                    <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleUpdate(product._id)}
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Products found</p>
        )}
      </div>
    </div>
  );
};

export default Allproducts;
