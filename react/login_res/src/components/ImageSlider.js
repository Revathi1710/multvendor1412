import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';

const ImageSlider = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/getSliderImages`)
      .then(response => response.json())
      .then(data => {
        const imageUrls = data.map(slider => slider.image);
        setImages(imageUrls);
      })
      .catch(error => console.error('Error fetching slider images:', error));
  }, []);

  const settings = {
    dots: false,               // Hide navigation dots
    infinite: true,            // Infinite scrolling
    speed: 500,                // Transition speed
    slidesToShow: 1,           // Show one slide at a time
    slidesToScroll: 1,         // Scroll one slide at a time
    autoplay: true,            // Enable automatic scrolling
    autoplaySpeed: 3000,       // Set autoplay speed (3 seconds)
    arrows: false,             // Hide navigation arrows (optional)
  };

  return (
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index} className='Container sliderimage col-sm-6'>
          <img src={`${process.env.REACT_APP_API_URL}/${image}`} alt={`Slide ${index + 1}`} style={{ width: '100%', height: '420px' }} />
        </div>
      ))}
    </Slider>
  );
};

export default ImageSlider;
