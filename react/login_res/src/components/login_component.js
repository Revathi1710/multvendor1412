import React, { Component } from 'react';
import Navbar from '../components/navbar';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    const { email, password } = this.state;
    console.log(email, password);
    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    })
    .then((data) => {
      console.log(data, "userLogin");
      if (data.status === "ok") {
        alert("Login successful");
        window.localStorage.setItem("token", data.data.token);
        window.localStorage.setItem("userId", data.data.userId);
        window.localStorage.setItem("loggedIn", true);
        window.location.href = "./userDetails";
      }
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  }

  render() {
    return (
      <div>
        <Navbar/>
        <div className='toppage'>
          <div className='container'>
            <form onSubmit={this.handleSubmit}>
              <h3>Login</h3>
              <div className='formbox'>
              <div className="form-container loginregForm">
                <div className="mb-3">
                  <div className="labelcontainer mb-3">
                    <label>Email address</label>
                  </div>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter email"
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

                <div className="mb-3">
                  <div className="custom-control custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="customCheck1"
                    />
                    <label className="custom-control-label" htmlFor="customCheck1">
                      Remember me
                    </label>
                  </div>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn login">
                    Submit
                  </button>
                </div>
                <p className="forgot-password text-right">
                  <a href="/signup">Register</a>
                </p>
              </div></div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
