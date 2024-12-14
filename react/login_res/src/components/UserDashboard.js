
import React, { Component } from "react";
import Navbar from '../components/navbar';
export default class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null, // Initialize userData state
      error: null,
    };
  }

  componentDidMount() {
    const token = window.localStorage.getItem("token");

    if (!token) {
      this.setState({ error: "No token found" });
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/userData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ token }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "userdetails");
        if (data.status === "ok") {
          this.setState({ userData: data.data });
        } else {
          this.setState({ error: data.message });
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        this.setState({ error: error.message });
      });
  }
logOut=()=>{
    window.localStorage.clear();
    window.location.href="./signup";
}
  render() {
    const { userData, error } = this.state;

    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <div>
                <Navbar />
        {userData ? (
          <>
            <h2>Name: {userData.fname}</h2>
            <h3>Email: {userData.email}</h3>
          </>
        ) : (
            <div>Loading</div>
        )}
         <div><button onClick={this.logOut} class="btn login">Logout</button></div>
      </div>
    );
  }
}
