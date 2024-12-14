import React, { useState } from 'react';
import Navbar from '../components/navbar';
import { Link } from 'react-router-dom';
import forgotpassword from '../icons/forgotpassword.png';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`http://localhost:5000/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset link has been sent to your email.');
      } else {
        setMessage(data.message || 'An error occurred.');
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('An error occurred while sending the request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='forgotpassbackground'>
        <div className='container'>
          <div className='formbox'>
            <div className="imagesignup col-sm-6">
              <img src={forgotpassword}  alt="Background" />
            </div>
            <div className="form-container loginform col-sm-4">
              <h3 className="login-title text-center mt-2 mb-5">Forgot Password</h3>
              <form onSubmit={handleSubmit}>
                <div>
                <div className="mb-3 input-group">
                     <span className="input-group-text">
                     <i className="fa fa-user"></i> {/* Replace with your preferred icon */}
                     </span>
                    <input
                    type="email"
                    className="form-control signupinput"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                   />
                </div>
                </div>
                <button type="submit" disabled={loading} className="btn btn-3d">
                  {loading ? 'Sending...' : 'Send Reset Link'} 
                </button>
              </form>
              {message && <p>{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
