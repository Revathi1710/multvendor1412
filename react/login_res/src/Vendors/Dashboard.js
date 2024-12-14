import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './Vendorsidebar '; // Ensure the correct path
import '../SuperAdmin/addcategory.css';
import './dashboard.css';

const AlldetailsVendor = () => {
  const [productCount, setProductCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const vendorId = localStorage.getItem('vendorId'); // Assuming vendorId is stored in local storage

        const productResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getVendorProductcount`, { vendorId });
        if (productResponse.data.status === 'ok') {
          setProductCount(productResponse.data.data.productCount);
        } else {
          console.error(productResponse.data.message);
        }

        const categoryResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getVendorCategorycount`, { vendorId });
        if (categoryResponse.data.status === 'ok') {
          setCategoryCount(categoryResponse.data.data.categoryCount);
        } else {
          console.error(categoryResponse.data.message);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="add-category-container" style={{ marginLeft: '250px' }}>
        <section className="fullpage">
          <div className="container">
            <div className="hello"></div>
            <div className="row">
              <div className="col-sm-3 categorylist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total Category</div>
                    <div className="count">{categoryCount}</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 productlist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total Product</div>
                    <div className="count">{productCount}</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 enquirylist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total Enquiry</div>
                    <div className="count">0</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AlldetailsVendor;
