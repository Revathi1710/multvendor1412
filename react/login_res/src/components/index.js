import React, { Component } from 'react';
import Navbar from '../components/navbar';
import ImageSlider from '../components/ImageSlider';
import AllProducts from '../components/AllProductHome';
import AllCategory from "../components/AllCategoryHome";
import Allcate from "../components/AllCateHome";
import AllBanner from "../components/AllBanner";
import TwosectionHome from "../components/HomePageTwosec";
import TopCategory from '../components/TopCategories';
import Footer from '../components/Footer';
import './home.css';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: '',
    };
  }

  componentDidMount() {
    // Extract the 'search' query parameter from the URL
    const params = new URLSearchParams(window.location.search);
    const searchLocation = params.get('search') || '';
    
    // Set the location state with the search parameter
    this.setState({ location: searchLocation });
  }

  handleLocationChange = (e) => {
    this.setState({ location: e.target.value });
  };

  render() {
    return (
      <div>
        <Navbar />
        <div className="body">
          <div className="homebody">
            <div className="row bannerbox">
              <div className="col-md-2 categorysidehomeMain">
                <Allcate />
              </div>
              <div className="col-md-7">
                <ImageSlider />
                <div className="container locationbox">
                  <h2>Select Location</h2>
                  <form className='searchform'>
                    <input
                      id="location-search"
                      type="search"
                      name="search"
                      className='form-control searchfield'
                      placeholder="Select Location"
                      onChange={this.handleLocationChange}
                      value={this.state.location}
                    />
                    <button className='btn setlocation'>Set Location</button>
                  </form>
                </div>
              </div>
              <div className="col-md-3">
                <AllBanner />
              </div>
            </div>
            <div className="container1 mt-4">
              <h2 className="mb-4">All Services</h2>
              <AllCategory />
            </div>
            <div className="container1 productSection mt-4">
              <h2 className="mb-4">Products</h2>
              {/* Pass the selected location as a prop to AllProducts */}
              <AllProducts location={this.state.location} />
            </div>
          </div>
          <TwosectionHome />
        </div>
        <div className='container'>
        <h2 className="mb-4">Top Categories</h2>
        <TopCategory />
        </div>
       < Footer/>
      </div>
    );
  }
}

export default Index;
