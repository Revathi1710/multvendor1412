import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';
import EnquiryModal from './EnquiryMode';
import { Link } from 'react-router-dom';
const AllProducts = ({ location }) => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const vendortoken = window.localStorage.getItem("vendortoken");
    if (vendortoken) {
      fetch(`${process.env.REACT_APP_API_URL}/vendorData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ vendortoken }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "ok") {
            setUserData(data.data);
          } else {
            setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          setError(error.message);
        });
    }
    
    const fetchProducts = async () => {
      try {
        let url = `${process.env.REACT_APP_API_URL}/getProductsRelatedPlan`;
        if (location) {
          url = `${process.env.REACT_APP_API_URL}/getLocationRelatedProduct/${location}`;
        }
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === 'ok') {
          setProducts(data.data);
          setMessage('');
        } else {
          setProducts([]);
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [location]);

  const handleEnquiryClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  return (
    <div className="container14 mt-4">
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <div className="row">
        {products.map((product, index) => (
          <div key={index} className="col-md-3 mb-4 productcardHome">
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
              <Link to={`/ProductView/${product._id}`} className="card-title ellipsis2">
                  <h5>{product.name}</h5>
                </Link>
                <div className='companydetails mt-4'>{product.vendorDetails.businessName}</div>
                <div className='companydetails mt-4'>{product.vendorDetails.City},{product.vendorDetails.State}</div>
                <a className="viewnumber-btn">
                  {product.vendorDetails.number}
                  </a>
                  <button type="submit" name="Enquiry" className="submit-btn"  onClick={() => handleEnquiryClick(product)}>
                    <i className="fa fa-send-o"></i> Enquiry
                  </button>
                
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal 
  show={showModal} 
  handleClose={handleModalClose} 
  product={selectedProduct} 
  userData={userData}
/>

    </div>
  );
};

export default AllProducts;
