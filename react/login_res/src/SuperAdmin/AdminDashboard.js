import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import './addcategory.css';
import '../Vendors/dashboard.css';

const AlldetailsVendor = () => {
  const [productCount, setProductCount] = useState(0);
  const [vendorCount, setVendorCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [subCategoryCount, setsubCategoryCount] = useState(0);
  const [enquiryCount, setEnquiryCount] = useState(0); // Added state for enquiry count

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch product count
        const productResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getProductcount`);
        if (productResponse.data.status === 'ok') {
          setProductCount(productResponse.data.data.productCount);
        } else {
          console.error(productResponse.data.message);
        }

        // Fetch vendor count
        const vendorResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getVendorcount`);
        if (vendorResponse.data.status === 'ok') {
          setVendorCount(vendorResponse.data.data.vendorCount);
        } else {
          console.error(vendorResponse.data.message);
        }

        // Fetch category count
        const categoryResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getCategorycount`);
        if (categoryResponse.data.status === 'ok') {
          setCategoryCount(categoryResponse.data.data.MainCategoryCount);
        } else {
          console.error(categoryResponse.data.message);
        }

        const subcategoryResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getsubCategorycount`);
        if (subcategoryResponse.data.status === 'ok') {
            setsubCategoryCount(subcategoryResponse.data.data.SubCategoryCount);
        } else {
          console.error(subcategoryResponse.data.message);
        }

        // Fetch enquiry count
        const enquiryResponse = await axios.post(`${process.env.REACT_APP_API_URL}/getEnquirycount`);
        if (enquiryResponse.data.status === 'ok') {
          setEnquiryCount(enquiryResponse.data.data.enquiryCount); // Corrected the state update
        } else {
          console.error(enquiryResponse.data.message);
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
            <div className="row">
              <div className="col-sm-3 vendorlist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total Vendor</div>
                    <div className="count">{vendorCount}</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 categorylist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total User</div>
                    <div className="count">{vendorCount}</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 categorylist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total Category</div>
                    <div className="count">{categoryCount}</div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3 categorylist">
                <div className="alldetails">
                  <div>
                    <div className="total">Total Subcategory</div>
                    <div className="count">{subCategoryCount}</div>
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
                    <div className="count">{enquiryCount}</div> {/* Correctly display the enquiry count */}
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
