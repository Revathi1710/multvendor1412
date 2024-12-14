import React, { Component } from 'react';
import Navbar from '../components/navbar';
import ImageSlider from '../components/ImageSlider';
import AllProducts from '../components/AllProductHome';
import AllCategory from "../components/AllCategoryHome";
 

 import './home.css';

class Index extends Component {
  render() {
    return (
      <div>
        <Navbar />
        <ImageSlider />
        <div className="container1 mt-4">
          <h2 className="mb-4">All Categories</h2>
            <AllCategory />
        </div>
        <div className="container mt-4">
          <h2 className="mb-4">Products</h2>
          <AllProducts />
        </div>
        
      </div>
    );
  }
}

export default Index;
