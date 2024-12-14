import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Vendors/plan.css';
import './addPlan.css';

const PlanVendor = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(''); // Added message state

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/getAllPlan`)
      .then(response => {
        if (response.data.status === 'ok') {
          setPlans(response.data.data);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, []);

  const handleSelectPlan = (planId) => {
    setSelectedPlans((prevSelectedPlans) =>
      prevSelectedPlans.includes(planId)
        ? prevSelectedPlans.filter((id) => id !== planId)
        : [...prevSelectedPlans, planId]
    );
  };

  const handleEditPlan = (planId) => {
    window.location.href = `/SuperAdmin/EditPlan/${planId}`;
  };

  const handleDeletePlan = (planId) => {
    if (window.confirm("Are you sure you want to delete this plan?")) {
      fetch(`${process.env.REACT_APP_API_URL}/deletePlanSuperAdmin`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId })
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ok') {
          // Remove the deleted plan from the state
          setPlans(plans.filter(plan => plan._id !== planId)); // Fixed variable names
          setMessage('Plan deleted successfully'); // Updated message state
        } else {
          console.error('Error:', data.message);
          setMessage('Error deleting plan: ' + data.message);
        }
      })
      .catch(error => {
        console.error('Delete error:', error);
        setMessage('Error deleting plan');
      });
    }
  };

  return (
    <section id="Price_Plan">
      <Sidebar />
      <div className="container">
        <div className="pricePlanTitle">
          <h1>PRICE PLAN</h1>
          {error && <p className="error-message">{error}</p>}
          {message && <p className="success-message">{message}</p>} {/* Display message */}
        </div>
        <Link to="superAdmin/AddPlan" className='btn btn-primary'>Add New Plan</Link>
        <div className="row planbox">
          {plans.map((plan) => (
            <div key={plan._id} className="col-md-4">
              <div className={`our_Plan ${selectedPlans.includes(plan._id) ? 'selected' : ''}`}>
                <h3>{plan.planName}</h3>
                <h1>{plan.planPrice}</h1>
                <ul className="Plan_list_Item">
                  {plan.planList.map((feature, index) => (
                    <li key={index}>
                      <i className="fas fa-check"></i> {feature}
                    </li>
                  ))}
                </ul>
                <button
                  className="btn btn-success"
                  onClick={() => handleEditPlan(plan._id)}
                >
                  Edit Plan
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeletePlan(plan._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanVendor;
