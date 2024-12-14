import React, { useState, useEffect } from 'react';
import axios from 'axios';
 // Import your CSS styles

const TopCategory = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getCategoryHome`);
        const data = response.data;

        if (data.status === 'ok') {
          setCategories(data.data); // Set data to 'categories' state
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    fetchCategories();
  }, []);



  const handleView = (categoryId) => {
    if (categoryId) {
      window.location.href = `/CategoryView/${categoryId}`;
    } else {
      setMessage('Category ID is undefined');
    }
  };

  return (
    <div className="container2">
      {message && <p>{message}</p>}
      <div className="">
        {categories.map((cat, index) => (
          <span
            key={index}
            className="topcategory"
           
          >
           
             
              <a className="topcate-card"  onClick={() => handleView(cat._id)}>
               {cat.name}
              </a>
           
            
          </span>
        ))}
      </div>
    </div>
  );
};

export default TopCategory;
