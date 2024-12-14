import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllCategoryHome.css'; // Import your CSS styles

const AllCategory = () => {
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

  const handleMouseEnter = async (categoryId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getSubCategory/${categoryId}`);
      const data = response.data;

      if (data.status === 'ok') {
        setSubCategories((prev) => ({
          ...prev,
          [categoryId]: data.data, // Store subcategories by category ID
        }));
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('An error occurred: ' + error.message);
    }
  };

  const handleMouseLeave = (categoryId) => {
    setSubCategories((prev) => ({
      ...prev,
      [categoryId]: [], // Clear subcategories on mouse leave
    }));
  };

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
      <div className="category-list">
        {categories.map((cat, index) => (
          <div
            key={index}
            className="homecategoryside mb-2"
            onMouseEnter={() => handleMouseEnter(cat._id)}
            onMouseLeave={() => handleMouseLeave(cat._id)}
          >
            <div className="sidecategoryHome" onClick={() => handleView(cat._id)}>
              {cat.image ? (
                <img
                  src={`${process.env.REACT_APP_API_URL}/${cat.image.replace('\\', '/')}`}
                  className="card-img-top categoryimageside"
                  alt={cat.name}
                />
              ) : (
                <img
                  src="path_to_default_image.jpg"
                  className="card-img-top categoryimage2"
                  alt="default"
                />
              )}
              <div className="card-body">
                <h5 className="card-title categorynameSide ellipsis">{cat.name}</h5>
              </div>
            </div>
            {subCategories[cat._id] && subCategories[cat._id].length > 0 && (
              <div className="subcategory-dropdown">
                <div className="row">
                  {subCategories[cat._id].map((subCat, subIndex) => (
                    <div key={subIndex} className="col-sm-4 subcategory-item">
                      {subCat.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllCategory;
