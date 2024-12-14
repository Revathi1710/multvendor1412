import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import axios from 'axios';
import "../Vendors/table.css";
import { Link } from 'react-router-dom'; 

const Alluser = () => {
  const [vendors, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/allVendor`);
        const data = response.data;

        if (data.status === 'ok') {
          setUsers(data.data);
        } else {
          setMessage(data.message);
        }
      } catch (error) {
        setMessage('An error occurred: ' + error.message);
      }
    };

    fetchUsers();
  }, []);
  const handleView = (VendorId) => {
    window.location.href = `/SuperAdmin/ViewVendor/${VendorId}`;
  };

  return (
    <div>
      <Sidebar />
      <div style={{ marginLeft: '250px' }}>
        <h1>All Vendors</h1>
        {message && <p>{message}</p>}
        {vendors.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Number</th>
                <th>Business Type</th>
                <th>View</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td>{vendor.fname}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.number}</td>
                  <td>{vendor.selectType}</td>
                  <td>
                  <button
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => handleView(vendor._id)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No vendors found</p>
        )}
      </div>
    </div>
  );
};

export default Alluser;
