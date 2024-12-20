import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import VendorHeader from './vendorHeader';
import '../SuperAdmin/addcategory.css';
import './sidebar2.css';
import './UserProfile.css';
import './allproduct.css';
import infogif from '../icons/gifinfo.gif';
import noimg from '../icons/noimg.png';
import loginlearn1 from '../icons/loginlearn1.png';
import profilelearn from '../icons/profilelearn.png';
import loginlearn from '../icons/productlearn.png';
import orderlearn from '../icons/orderlearn.png';
import securelearn from '../icons/securelearn.png';

const Allproducts = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [activeSubMenu, setActiveSubMenu] = useState(null);
  const [vendorData, setVendorData] = useState({ selectType: '' }); // Define vendorData state
  const [productCount, setproductCount] = useState(0); 
  useEffect(() => {
    const vendorId = localStorage.getItem('vendorId');
    if (!vendorId) {
      alert('Vendor ID not found in local storage');
      return;
    }

    // You need to define vendortoken or remove this request if not used
    const vendortoken =  localStorage.getItem('vendortoken'); // Define or get vendortoken if needed

    axios.post(`${process.env.REACT_APP_API_URL}/vendorData`, { vendortoken })
      .then(response => {
        if (response.data.status === 'ok') {
          setVendorData(response.data.data);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });

    fetch(`http://localhost:5000/getVendorProduct`, {
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

  axios.post(`http://localhost:5000/getVendorProductcount`, { vendorId })
  .then(response => {
    if (response.data.status === 'ok') {
      setproductCount(response.data.data.productCount); // Set the count
    } else {
      setMessage('Error fetching category count: ' + response.data.message);
    }
  })
  .catch(error => {
    console.error('Error fetching category count:', error);
    setMessage('Error fetching category count');
  });
}, []);

  const handleUpdate = (productId) => {
    window.location.href = `/Vendor/UpdateProduct/${productId}`;
  };

  const handleSubMenuToggle = (index) => {
    setActiveSubMenu(activeSubMenu === index ? null : index);
  };

  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deleteProductVendor`, {
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
          setMessage('Product deleted successfully');
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
    <div className="update-profile-vendor">
      <VendorHeader />
      <div className="content row mt-4">
        <div className='col-sm-3'>
          <ul className='VendorList'>
            <li className='list'><i className="fa fa-laptop sidebaricon"></i> Dashboard</li>
          </ul>
          <ul className="nano-content VendorList">
            <li className={`sub-menu list ${activeSubMenu === 5 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(5)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Profile</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 5 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/UserProfile" className='listsidebar'>User Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BusinessProfile" className='listsidebar'>Business Profile</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/BankDetails" className='listsidebar'>Bank Details</Link></li>
              </ul>
            </li>
            <li className={`sub-menu list ${activeSubMenu === 0 ? 'active' : ''}`}>
              <a href="#!" onClick={() => handleSubMenuToggle(0)}>
                <i className="fa fa-cogs sidebaricon"></i><span>Category</span><i className="arrow fa fa-angle-right pull-right"></i>
              </a>
              <ul style={{ display: activeSubMenu === 0 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                <li className='list_sidebar'><Link to="/Vendor/AllCategory" className='listsidebar'>All Categories</Link></li>
                <li className='list_sidebar'><Link to="/Vendor/AddCategory" className='listsidebar'>Add New Category</Link></li>
              </ul>
            </li>
            {vendorData && vendorData.selectType === "Product Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 3 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(3)}>
                  <i className="fa fa-cogs sidebaricon"></i><span>Product</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 3 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                  <li className='list_sidebar'><Link to="/Vendor/AllProduct" className='listsidebar'>All Products</Link></li>
                  <li className='list_sidebar'><Link to="/Vendor/AddProductVendor" className='listsidebar'>Add Product</Link></li>
                </ul>
              </li>
            )}
            {vendorData && vendorData.selectType === "Service Based Company" && (
              <li className={`sub-menu list ${activeSubMenu === 1 ? 'active' : ''}`}>
                <a href="#!" onClick={() => handleSubMenuToggle(1)}>
                  <i className="fa fa-cogs sidebaricon"></i><span>Service</span><i className="arrow fa fa-angle-right pull-right"></i>
                </a>
                <ul style={{ display: activeSubMenu === 1 ? 'block' : 'none' }} className='vendorsidebarmenu'>
                  <li className='list_sidebar'><Link to="/Vendor/AllService" className='listsidebar'>All Services</Link></li>
                  <li className='list_sidebar'><Link to="/Vendor/AddService" className='listsidebar'>Add Service</Link></li>
                </ul>
              </li>
            )}
            <ul className='VendorList'>
              <li className='list'><Link to="/Vendor/MyOrders" className='listout listsidebar'><i className="fa fa-laptop sidebaricon"></i>My Orders</Link></li>
            </ul>
          </ul>
          <img 
            src={infogif} 
            alt="Loading..." 
            style={{ height: 'auto', borderRadius: '10px' }} 
          />
        </div>
        <div className='col-sm-6 userinfo-container'>
          <div >
            <h2 className='title-vendorInfo'>All Products</h2>
            <div className='total_addbtn'>
            <span>{productCount} Product</span> 
            <Link to="/Vendor/AddProductVendor" className='btn addbtn'>Add New Product</Link>
            </div>
            {message && <p>{message}</p>}
            {products.length > 0 ? (
  <div>
    {products.map((product) => (
      <div className="productDetailsvendor d-flex" key={product._id}>
        <div className="">
          {product.image ? (
            <img
            src={`${process.env.REACT_APP_API_URL}/${product.image.replace('\\', '/')}`}
            alt={product.name}
            style={{ width: '84px', height: '84px' }}
          />
          
          ) : (
            <img
            src={noimg}
            alt={product.name}
            style={{ width: '84px', height: '84px' }}
          />
            
           
          )}
        </div>
        <div className="product-details">
          <h5>{product.name}</h5>
          <s>₹{product.originalPrice}</s>
          <span className='m-2'>₹{product.sellingPrice}</span>
          <div>
          <span className='pending-items'>
          {product.active ? 'Active' : 'Inactive'}
            </span>
            <span className='category-items m-2'> 
  {product.category?.name || 'Category Not Available'}
</span>
<span className='subcategory-items'> 
  {product.subcategory?.name || 'Subcategory Not Available'}
</span>
</div>

       
       
        </div>
        <div className="edit-deleteflex">
          <button
            onClick={() => handleUpdate(product._id)}
            className="edit-delete"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={() => handleDelete(product._id)}
            className="edit-delete"
          >
            <i className="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    ))}
  </div>
) : (
  <p>No Categories Found</p>
)}

 
          </div>
        </div>
        <div className='col-sm-3'>
          <div className='learning-container'>
          <h2 className='title-vendorInfo'>Learning Center</h2>
          <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Login</span>
              <div class="card-content">
                <span class=" learncontent">
                Simply enter your username and password to log in and get started!</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={loginlearn1} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Create Your Vendor Profile </span>
              <div class="card-content">
                <span class=" learncontent">
                Set up your vendor profile by providing your details to start selling on our platform.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={profilelearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Add Your Products</span>
              <div class="card-content">
                <span class=" learncontent">
                Easily list your products with descriptions, images, and prices to attract customers.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={loginlearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Manage Orders</span>
              <div class="card-content">
                <span class=" learncontent">
                Track and manage your orders with real-time updates for a smooth selling experience.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={orderlearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
        <div class=" d-flex learning-cards">
            <div class="card-body mr-4">
             
                <span class="about">Get Paid Securely</span>
              <div class="card-content">
                <span class=" learncontent">
                Receive payments directly to your account with our secure and reliable payment system.</span></div>
               </div>
                    <div class="card-logo d-flex align-items-center"><div class="imgBox">
                      <img src={securelearn} alt="logo" loading="eager" width="80" height="auto" class="logo"/>
                      </div></div>
          
         
        </div>
      </div>
    </div>
    </div>
    </div>
    
  );
};
export default Allproducts;
