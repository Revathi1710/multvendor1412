import React, { Component } from 'react';
import Navbar from '../components/navbar';
import Signupslider1 from '../icons/signupslider1.png';
import Signupslider2 from '../icons/signupslider2.2.png';
import Slider from 'react-slick';
import forgotpass from '../icons/forgotpass.png';

import { Link } from 'react-router-dom';

// Custom Previous Arrow
const PrevArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow prev-arrow`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};

// Custom Next Arrow
const NextArrow = (props) => {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-arrow next-arrow`}
      style={{ ...style }}
      onClick={onClick}
    />
  );
};
export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      email: "",
      number: "",
      password: "",
      cpassword: "",
      verifyButton: false,
      verifyOtp: false,
      Otp: "",
      emailOtp: "",
      otpSent: false,
      emailOtpVerified: false,
      formSubmitted: false,
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSendOtp = this.handleSendOtp.bind(this);
    this.handleVerifyOtp = this.handleVerifyOtp.bind(this);
    this.finalSubmit = this.finalSubmit.bind(this);
  }

  handleSendOtp() {
    const { email } = this.state;

    fetch(`${process.env.REACT_APP_API_URL}/Vendorsend-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    })
    .then(res => {
      if (res.status === 200) {
        this.setState({ otpSent: true });
        alert('OTP sent successfully!');
      } else {
        alert('Error sending OTP');
      }
    })
    .catch(err => console.error('Error:', err));
  }

  handleVerifyOtp() {
    const { email, emailOtp } = this.state;
    console.log("Sending OTP verification request:", { email, emailOtp }); // Add this line

    fetch(`${process.env.REACT_APP_API_URL}/VendorVerify-otp`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, otp: emailOtp })
    })
    .then(res => {
        console.log("OTP verification response status:", res.status); // Log response status
        if (res.status === 200) {
            this.setState({ emailOtpVerified: true }, this.finalSubmit);
        } else {
            alert('Invalid OTP');
        }
    })
    .catch(err => console.error('Error:', err));
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password, cpassword } = this.state;

    if (!email || !password || !cpassword) {
      alert('Please fill in all required fields.');
      return;
    }

    if (password !== cpassword) {
      alert('Passwords do not match.');
      return;
    }

    this.setState({ formSubmitted: true }, this.handleSendOtp);
  }

  finalSubmit() {
    const { fname, email, number, businessName, password, cpassword } = this.state;
  
    if (!fname || !email || !number || !businessName || !password || !cpassword) {
      alert('Please fill in all required fields.');
      return;
    }
  
    fetch(`${process.env.REACT_APP_API_URL}/VendorRegister`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fname, email, number, businessName, password, cpassword })
    })
    .then((res) => {
      console.log("Response status:", res.status); // Log response status
      return res.json();
    })
    .then((data) => {
      console.log(data, "userRegister");
      if (data.status === 'ok') {
        alert('Registration successful!');
        // Store vendor ID in local storage or state
        localStorage.setItem('vendorId', data.vendorId);
        window.location.href="./Login";
      } else {
        alert('Registration failed: ' + data.message);
      }
    })
    
    .catch((error) => {
      console.error("Error:", error);
    });
  }
  

  render() {
   
    const { formSubmitted, otpSent, emailOtpVerified } = this.state;
    const sliderSettings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000,
      prevArrow: <PrevArrow />,
      nextArrow: <NextArrow />,
    };
    return (
      
     <div >

         <Navbar />
         <div
        style={{
          backgroundColor: '#E6BBAB', // Use backgroundColor for solid colors
         
        }}
        className="backgroundImagesignuppage"
      >
    
      
      
       
          {!formSubmitted ? (
            <form onSubmit={this.handleSubmit} className='formbox'>
             
             
             <div className="form-container signupform col-sm-6">
              <h3 className='mt-2 signup-title'>Signup</h3>

  <div className="mb-3 input-group">
    <span className="input-group-text">
      <i className="fa fa-user"></i> {/* Replace with your preferred icon */}
    </span>
    <input
      type="text"
      className="form-control signupinput"
      placeholder="First name"
      onChange={(e) => this.setState({ fname: e.target.value })}
    />
  </div>

  <div className="mb-3 input-group">
    <span className="input-group-text">
      <i className="fa fa-envelope"></i> {/* Replace with your preferred icon */}
    </span>
    <input
      type="email"
      className="form-control signupinput"
      placeholder="Enter email"
      onChange={(e) => this.setState({ email: e.target.value })}
    />
  </div>

  <div className="mb-3 input-group">
    <span className="input-group-text">
      <i className="fa fa-phone"></i> {/* Replace with your preferred icon */}
    </span>
    <input
      type="number"
      className="form-control signupinput"
      placeholder="Enter phone number"
      onChange={(e) => this.setState({ number: e.target.value })}
    />
  </div>

  <div className="mb-3 input-group">
    <span className="input-group-text">
      <i className="fa fa-building"></i> {/* Replace with your preferred icon */}
    </span>
    <input
      type="text"
      className="form-control signupinput"
      placeholder="Enter Company/Business/Shop Name"
      onChange={(e) => this.setState({ businessName: e.target.value })}
    />
  </div>

  <div className="mb-3 input-group">
    <span className="input-group-text">
      <i className="fa fa-lock"></i> {/* Replace with your preferred icon */}
    </span>
    <input
      type="password"
      className="form-control signupinput"
      placeholder="Enter password"
      onChange={(e) => this.setState({ password: e.target.value })}
    />
  </div>

  <div className="mb-3 input-group">
    <span className="input-group-text">
      <i className="fa fa-lock"></i> {/* Replace with your preferred icon */}
    </span>
    <input
      type="password"
      className="form-control signupinput"
      placeholder="Confirm password"
      onChange={(e) => this.setState({ cpassword: e.target.value })}
    />
  </div>

  <div className="d-grid">
    <button type="submit" className="btn  btn-primary btn-signup">
      Sign Up
    </button>
  </div>

  <p className="forgot-password text-right">
   Have an Account? <Link to="/vendor/login">Login</Link>
  </p>
</div>

              <div className="imagesignup col-sm-6 signupdot">
              <Slider {...sliderSettings}>
                <div>
                  <img src={Signupslider1} alt="Slide 1" className="slider-image" />
                  <h6 className='slidertitlesign'> Start Selling – Create Your Vendor Account!</h6>
                  <p className='mb-3'>Sign up today to showcase your products, manage orders, and grow your business on our platform.</p>
                </div>
                <div>
                  <img src={Signupslider2} alt="Slide 2" className="slider-image" />
                  <h6 className='slidertitlesign'> Launch Your Store – Join as a Vendor Today!</h6>
                  <p className='mb-3'> Sign up now to manage and grow your online store effortlessly.</p>
                </div>
              </Slider>
              
              </div>
             
            </form>
          ) : (
            <div className='verifybackground' style={{
              backgroundColor: 'rgb(193 217 251)', // Use backgroundColor for solid colors
             
            }}>
              <div className='formbox container'>
              <div className="imagesignup col-sm-6">
                <img src={forgotpass} className="forgotimage" />
              </div>
              <div className="form-container  otpform col-sm-4">
              <h3 className='mt-3 mb-3'>OTP Verification</h3>
                <div className="mb-3">
                <div className="mb-3 input-group">
                        <span className="input-group-text">
                          <i className="fa fa-key"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control signupinput"
                          placeholder="Enter OTP"
                          onChange={(e) => this.setState({ emailOtp: e.target.value })}
                        />
                      </div>
                  <button type="button"  className="btn btn-3d"onClick={this.handleVerifyOtp}>
                    Verify & Proceed
                  </button>
                </div>
              </div>
             
              </div>
            </div>
          )}
       </div>
      </div>
    );
  }
}
