import React, { Component } from "react";
import Slider from "react-slick";
import axios from "axios";
import ProductCard from "./ProductCard";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./demo.css";

class ProductSlider extends Component {
  constructor() {
    super();
    this.state = {
      slides: [], // Empty array initially
      loading: true,
      error: ""
    };
  }

  componentDidMount() {
    this.fetchSlides();
  }

  fetchSlides = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/getServiceMain`);
      const data = response.data;

      if (data.status === "ok") {
        this.setState({ slides: data.data, loading: false }); // Set fetched data to slides
      } else {
        this.setState({ error: data.message, loading: false });
      }
    } catch (error) {
      this.setState({ error: "An error occurred while fetching data", loading: false });
    }
  };

  render() {
    const { slides, loading, error } = this.state;

    var settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 5,
      slidesToScroll: 5,
      initialSlide: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
            infinite: true,
            dots: true
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
            initialSlide: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
      ]
    };

    return (
      <div>
       
        {loading && <p>Loading...</p>}
        {error && <p>{error}</p>}
        {!loading && !error && (
          <Slider {...settings} className="homeserviceService">
            {slides.map((slide, index) => {
  console.log(slide); // Check if _id is present in slide
  return (
    <div key={index}>
      <ProductCard 
        _id={slide._id}  
        imgSrc={`${process.env.REACT_APP_API_URL}/${slide.image.replace('\\', '/')}`} 
        name={slide.name} 
        description={slide.description} 
      />
    </div>
  );
})}

          </Slider>
        )}
      </div>
    );
  }
}

export default ProductSlider;
