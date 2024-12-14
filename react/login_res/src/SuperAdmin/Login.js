import React, { Component } from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate from react-router-dom

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      redirect: false // State to handle redirection
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();

    // Check if the email and password are both "aristos"
    if (this.state.email === 'aristos' && this.state.password === 'aristos') {
      this.setState({ redirect: true }); // Set redirect state to true
    } else {
      // Handle incorrect credentials (e.g., show an error message)
      alert('Invalid email or password');
    }
  };

  render() {
    if (this.state.redirect) {
      return <Navigate to="/SuperAdmin/AdminDashboard" />; // Redirect to dashboard
    }

    return (
      <div className='toppage' style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className='container'>
        <div className='box' style={{  display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <form onSubmit={this.handleSubmit} style={{ width: '35%' }}>
          <div className="form-container2" style={{ width: '100%',padding:'20px', boxShadow: 'rgba(100, 100, 111, 0.2) 0px 7px 29px 0px' }}>
              <h3>SuperAdmin Login</h3>
              <div className="mb-3">
                <div className="labelcontainer mb-3">
                  <label>User Name</label>
                </div>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter Username"
                  value={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <div className="labelcontainer mb-3">
                  <label>Password</label>
                </div>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </div>

              <div className="d-grid">
                <button type="submit" className="btn login">
                  Submit
                </button>
              </div>
            </div>
          </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
