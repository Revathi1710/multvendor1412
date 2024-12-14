import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar'; // Adjust the path according to your directory structure
import axios from 'axios';
import '../Vendors/table.css';


const Alluser = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/alluser`);
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

  return (
    <div>
      <Sidebar />
      <div className="container table" style={{ marginLeft: '250px' }}>
        <h1>All Users</h1>
        {message && <p>{message}</p>}
        {users.length > 0 ? (
          <table className="table table-striped">
            <thead>
              <tr>
                <th style={{ width:'25%' }}>Name</th>
                <th style={{ width:'25%' }}>Email</th>
                <th style={{ width:'25%' }}>Number</th>
               
                
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td style={{ width:'25%' }}> {user.fname}</td>
                  <td style={{ width:'25%' }}>{user.email}</td>
                  <td style={{ width:'25%' }}>{user.number}</td>
                  
                  
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users found</p>
        )}
      </div>
    </div>
  );
};

export default Alluser;
