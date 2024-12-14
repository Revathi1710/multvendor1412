import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '../components/navbar';
import '../components/service.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const { service } = useParams();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_URL}/userData`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ token }),
          });
          const data = await response.json();
          if (data.status === "ok") {
            setUserData(data.data);
          } else {
            setError(data.message);
          }
        } catch (error) {
          console.error("Error:", error);
          setError(error.message);
        }
      }
    };

    const fetchProducts = async () => {
      if (!service) {
        setMessage('Service is not defined.');
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getServiceByMain/${service}`);
        const data = response.data;
        if (data.status === 'ok') {
          setProducts(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    fetchUserData();
    fetchProducts();
  }, [service]);

  const handleEnquiry = async (e) => {
    e.preventDefault();
    if (!userData) {
      window.localStorage.setItem('redirectAfterLogin', window.location.pathname);
      window.location.href = '/login';
      return;
    }

    const form = e.target;
    const formData = new FormData(form);
    const enquiryData = {
      productname: formData.get('name'),
      product_id: formData.get('id'),
      productPrice: formData.get('price'),
      vendorId: formData.get('vendorId'),
      UserId: userData._id,
      Username: userData.fname,
      UserNumber: userData.number,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/sendEnquiryService`, enquiryData, {
        headers: { 'Content-Type': 'application/json' },
      });
      const data = response.data;
      if (data.status === 'ok') {
        setMessage('Enquiry sent successfully!');
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage('An error occurred: ' + error.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <div className="row">
          {products.map((product, index) => (
            <div key={index} className="mb-4 servicecard">
              <div className="row h-100 serviceCard">
                <div className='cardImage col-sm-3'>
                  {product.image ? (
                    <img 
                      src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`} 
                      className="card-img-top homeproductimage" 
                      alt={product.name}
                    />
                  ) : (
                    <img 
                      src="path_to_default_image.jpg" 
                      className="card-img-top" 
                      alt="default"
                    />
                  )}
                </div>
                <div className="card-body col-sm-8">
                  <h2 className="card-title mt-2 mb-3">{product.name}</h2>
                  <div className="location">{product.vendorId.Address}</div>
                  {product.vendorId.establishment} Years in Business
                  <form onSubmit={handleEnquiry}>
                    <input type="hidden" name="name" value={product.name} />
                    <input type="hidden" name="id" value={product._id} />
                    <input type="hidden" name="price" value={product.Pricerange} />
                    <input type="hidden" name="vendorId" value={product.vendorId._id} /> {/* Corrected to store vendor ID */}
                    <a href={`tel:${product.vendorId.OfficeContact}`}>
                      <button type="button" name="Enquiry" className="callservice">
                        <i className="fa fa-phone"></i> {product.vendorId.OfficeContact}
                      </button>
                    </a>
                    <button type="submit" name="Enquiry" className="servicesubmit-btn">
                      <i className="fa fa-send-o"></i> Send Enquiry
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
