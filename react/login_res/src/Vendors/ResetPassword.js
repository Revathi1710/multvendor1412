import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import resetpass from '../icons/resetpass.png';

const ResetPassword = () => {
  const { token } = useParams(); // Get token from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  useEffect(() => {
    console.log('Token from URL:', token); // Add this for debugging
    const verifyToken = async () => {
      if (!token) {
        setMessage('Invalid or missing reset token');
        return;
      }
      try {
        const response = await axios.post(`http://localhost:5000/verify-token/${token}`);
        if (response.data.success) {
          setIsTokenValid(true);
        } else {
          setMessage('Invalid or expired reset token');
        }
      } catch (error) {
        setMessage('Invalid or expired reset token');
        console.error('Token verification error:', error);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/reset-password/${token}`, { password });
      setMessage(response.data.message);
      if (response.data.success) {
        navigate('/login'); // Redirect to login after successful reset
      }
    } catch (error) {
      setMessage('Error resetting password. Please try again.');
      console.error('Reset password error:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className='resetsbackground'>
        <div className='container'>
          <div className='formbox'>
            <div className="imagesignup col-sm-6">
              <img src={resetpass}  />
            </div>
            <div className="form-container loginform col-sm-4">
              <h3 className="login-title text-center mt-2 mb-5">Reset Password</h3>
              {isTokenValid ? (
                <form onSubmit={handleSubmit}>
                  
                  <div className="mb-3 input-group">
                  <span className="input-group-text">
                   <i className="fa fa-lock"></i> {/* Replace with your preferred icon */}
                  </span>
                      <input
                    type="password"
                      id="password"
                    className="form-control signupinput"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                 </div>
                  
                 <div className="mb-3 input-group">
                  <span className="input-group-text">
                   <i className="fa fa-lock"></i> {/* Replace with your preferred icon */}
                  </span>
                      <input
                    type="password"
                      id="password"
                    className="form-control signupinput"
                    placeholder="Enter Confirm password"
                  
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                 </div>
                 
                  <button type="submit" className="btn btn-3d">Reset Password</button>
                </form>
              ) : (
                <p>{message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
