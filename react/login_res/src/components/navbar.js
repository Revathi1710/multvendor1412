import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

import logo from '../icons/aristostechlogo.png'; // Adjust path if needed
import shop from '../icons/shopping-cart.png'; // Adjust path if needed
import sell from '../icons/shop.png'; // Adjust path if needed
import help from '../icons/question.png'; // Adjust path if needed
import userIcon from '../icons/user1.png'; 


const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const cities = ['Mumbai', 'Delhi', 'Bengaluru', 'Chennai', 'Kolkata', 'Pune', 'Hyderabad']; // Add more cities as needed

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const vendorId = localStorage.getItem('vendorId');

        if (!userId && !vendorId) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/getName`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, vendorId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'ok' && result.data && result.data.fname) {
          setUserName(result.data.fname);
        } else {
          console.error('Error in API response:', result.message || 'No name found');
        }
      } catch (error) {
        console.error('Error fetching name:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    // You can also trigger an API call or update based on the selected city here
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchLocation = params.get('search') || '';
    setSelectedCity(searchLocation || 'All Cities');
  }, []);

  return (
    <nav className="navbar">
      <div className="container1">
        <div className="row header-row">
          <div className="col-sm-2">
            <Link to="/" className="navbar-brand">
            
           <p className='logoname'>Kada
           <span className='spanlogo'>Theru</span></p>
            </Link>
          </div>
          <div className="col-sm-2">
            <select className="form-select headerinputfield" value={selectedCity} onChange={handleCityChange}>
              <option value="All Cities">All Cities</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
          <div className="col-sm-4">
            <form className="d-flex mx-auto my-2 mt-2">
              <input
                className="form-control me-2 headerinputfield"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                className="btn searchheader"
                type="submit"
                aria-label="Search"
              >
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
          <div className="col-sm-4">
            <ul className="menulist">
              <li className="nav-item">
                <Link to="/" className="nav-link">
                  <i class='fas fa-shopping-bag iconsheader'></i>
                  Shopping
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/Vendor/Signup" className="nav-link">
                <i class='fas fa-store iconsheader'></i>
                  Sell
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/vendors" className="nav-link">
                <i class='far fa-question-circle iconsheader'></i>
                  Help
                </Link>
              </li>
              <li className="nav-item">
              <i class='fas fa-user-circle iconsheader'></i>
                {userName ? (
                  <Link to="/Vendor/UserProfile" className="nav-link">
                    Welcome, {userName}
                  </Link>
                ) : (
                  <Link to="/Vendor/Signup" className="nav-link">
                    Login/Signup
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
