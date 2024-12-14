import React, { useState } from 'react';
import Navbar from '../components/navbar';

const LeadForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company_name, setCompanyName] = useState('');
  const [data_source, setDataSource] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = { name, email, company_name, data_source };

    fetch(`${process.env.REACT_APP_API_URL}/addLeadForm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data, "addlead");
        if (data.status === 'ok') {
          alert('Added successfully!');
          window.location.href = "/";
        } else {
          alert('Category addition failed!');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={handleSubmit}>
        <div className="container">
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Company Name"
              value={company_name}
              onChange={(e) => setCompanyName(e.target.value)}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Data Source"
              value={data_source}
              onChange={(e) => setDataSource(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default LeadForm;
