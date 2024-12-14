import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './plan.css'; // Assuming you are using a separate CSS file

import Navbar from '../components/navbar';

import { Link } from 'react-router-dom';
const PlanVendor = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [error, setError] = useState(null);

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

    // Fetch the currently selected plan for this vendor
    const vendorId = localStorage.getItem('vendorId');
    axios.get(`${process.env.REACT_APP_API_URL}/getSelectedPlan/${vendorId}`)
      .then(response => {
        if (response.data.status === 'ok') {
          setSelectedPlanId(response.data.data.planId);
        } else {
          setError(response.data.message);
        }
      })
      .catch(error => {
        console.error('Error:', error);
        setError(error.message);
      });
  }, []);

  const handleSelectPlan = async (planId, planPrice) => {
    const vendorId = localStorage.getItem('vendorId');

    // Check if the plan price is greater than 0 before initiating Razorpay
    if (planPrice > 0) {
      initiateRazorpay(planId, planPrice, vendorId);
    } else {
      try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/selectPlanVendor`, {
          planId,
          planPrice,
          vendorId,
          paymentId: null, // No payment ID since it's free
        });

        if (response.data.status === 'ok') {
          // Update the selected plan state
          setSelectedPlanId(planId);
          alert('Plan selected successfully without payment.');
          window.location.href = "./Dashboard";
        } else {
          setError(response.data.message);
        }
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      }
    }
  };

  const initiateRazorpay = (planId, planPrice, vendorId) => {
    const amountInPaise = planPrice * 100; // Convert the price to paise

    const options = {
      key: "rzp_live_fuifIDFQLxFGf3", // Replace with your Razorpay API key
      amount: amountInPaise,
      currency: "INR",
      name: "Market Fashion",
      description: "Payment",
      image: "path_to_your_logo",
      handler: async function (response) {
        try {
          const res = await axios.post(`${process.env.REACT_APP_API_URL}/selectPlanVendor`, {
            planId,
            planPrice,
            vendorId,
            paymentId: response.razorpay_payment_id, // Send the payment ID
          });

          if (res.data.status === 'ok') {
            setSelectedPlanId(planId);
            alert('Payment successful! Plan selected.');
            window.location.href = "./Dashboard";
          } else {
            setError(res.data.message);
          }
        } catch (error) {
          console.error('Error:', error);
          setError(error.message);
        }
      },
      theme: {
        color: "#528FF0",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <section id="Price_Plan">
     <Navbar />
     <div class="planboxVendor">
      <div className="container">
        <div className="pricePlanTitle">
         <div className='choosepara'>Choose Your Plan</div>
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="row ">
          {plans.map((plan) => (
            <div key={plan._id} className="col-md-4">
              <div className={`our_Plan ${selectedPlanId === plan._id ? 'selected' : ''}`}>
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
                  className="btn btn-success btn-3d"
                  onClick={() => handleSelectPlan(plan._id, plan.planPrice)}
                >
                  {selectedPlanId === plan._id ? 'Selected' : 'Get Started'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div></div>
    </section>
  );
};

export default PlanVendor;
