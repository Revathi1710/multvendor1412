import React, { useState, useEffect } from 'react';
import Sidebar from './Vendorsidebar '; // Ensure the correct path
import '../SuperAdmin/addcategory.css';
import './table.css';
const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/getVendorService`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vendorId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'ok') {
        setProducts(data.data);
      } else {
        console.error('Error:', data.message);
        setMessage('Error fetching products: ' + data.message);
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
      setMessage('Error fetching products');
    });
  }, []);

  const handleUpdate = (productId) => {
    window.location.href = `/Vendor/UpdateService/${productId}`;
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteServiceVendor`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          // Remove the deleted product from the state
          setProducts(products.filter(product => product._id !== productId));
          setMessage('Service deleted successfully');
        } else {
          console.error('Error:', data.message);
          setMessage('Error deleting product: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Delete error:', error);
        setMessage('Error deleting product');
      });
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="" style={{ marginLeft: '250px' }}>
      <div class="title"> <h2>All Products</h2></div>
        {message && <p>{message}</p>}
        {products.length > 0 ? (
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
                  <td>{product.name}</td>
                  <td>
                    <span className={`badge ${product.active ? 'bg-success' : 'bg-danger'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
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
