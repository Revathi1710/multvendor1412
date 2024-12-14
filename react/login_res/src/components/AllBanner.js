import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AllCategory = () => {
  const [category, setCategory] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/getBannerImages`);
        const data = response.data;

        if (data.status === 'ok') {
          setCategory(data.data); // Set data to 'category' state
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    fetchCategory();
  }, []);

  return (
    <div className="">
      {message && <p>{message}</p>}
      {error && <p>{error}</p>}
      <div className="row">
        {category.map((cat, index) => (
          <div key={index} className="
           mb-4">
            <div className="">
              {cat.image ? (
                <img 
                  src={`${process.env.REACT_APP_API_URL}/${cat.image.replace('\\', '/')}`} 
                  className="bannerimage"  
                  alt={cat.name}
                />
              ) : (
                <img 
                  src="path_to_default_image.jpg" 
                  className="card-img-top" 
                  alt="default"
                />
              )}
            
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategory;
