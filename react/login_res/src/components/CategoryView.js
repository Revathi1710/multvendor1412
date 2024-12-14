import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from '../components/navbar';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]); // Separate state for subcategories
  const [message, setMessage] = useState('');
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');

  const { category } = useParams();

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
      if (!category) {
        setMessage('Category is not defined.');
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getProductsByCategory/${category}`);
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

    const fetchSubcategories = async () => {
      if (!category) {
        setMessage('Category is not defined.');
        return;
      }
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getSubCategory/${category}`);
        const data = response.data;
        if (data.status === 'ok') {
          setSubcategories(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    fetchUserData();
    fetchProducts();
    fetchSubcategories();
  }, [category]);

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
      const response = await axios.post('${process.env.REACT_APP_API_URL}/sendEnquiry', enquiryData, {
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
      <div className="container14 mt-4">
        {message && <p>{message}</p>}
        {error && <p>{error}</p>}
        <div className="row">
          {subcategories.length > 0 && (
            <div className="col-sm-2 subcategorylist">
              <h5>Subcategories</h5>
              <ul>
                {subcategories.map((subcategory, index) => (
                  <li key={index}>{subcategory.name}</li>
                ))}
              </ul>
            </div>
          )}
          <div className={subcategories.length > 0 ? 'col-sm-10' : 'col-12'}>
            <div className="row">
              {products.map((product, index) => (
                <div key={index} className="col-md-5 mb-4 productcardHome">
                  <div className="card h-100">
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
                    <div className="card-body">
                      <h5 className="card-title ellipsis2">{product.name}</h5>
                      <form onSubmit={handleEnquiry}>
                        <input type="hidden" name="name" value={product.name} />
                        <input type="hidden" name="id" value={product._id} />
                        <input type="hidden" name="price" value={product.sellingPrice} />
                        <input type="hidden" name="vendorId" value={product.vendorId} />
                        <button type="submit" name="Enquiry" className="submit-btn">
                          <i className="fa fa-send-o"></i> Enquiry
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllProducts;
