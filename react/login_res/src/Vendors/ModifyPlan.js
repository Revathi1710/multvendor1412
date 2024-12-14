import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './plan.css'; // Assuming you are using a separate CSS file
import Sidebar from './Vendorsidebar ';

const PlanVendor = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlans, setSelectedPlans] = useState([]);
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
  }, []);

  const handleSelectPlan = async (planId, planPrice) => {
    const vendorId = localStorage.getItem('vendorId'); // Assuming vendorId is stored in local storage
  
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
          setSelectedPlans((prevSelectedPlans) =>
            prevSelectedPlans.includes(planId)
              ? prevSelectedPlans.filter((id) => id !== planId)
              : [...prevSelectedPlans, planId]
          );
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
      
     // key: "rzp_live_ILgsfZCZoFIKMb", // Replace with your Razorpay API key
     
     key: "rzp_live_fuifIDFQLxFGf3",
      amount: amountInPaise,
      currency: "INR",
      name: "Market Fashion",
      description: "Payment",
      image: "path_to_your_logo",
      handler: async function (response) {
        try {
          // Send the plan details and payment ID to your backend
          const res = await axios.post(`${process.env.REACT_APP_API_URL}/selectPlanVendor`, {
            planId,
            planPrice,
            vendorId,
            paymentId: response.razorpay_payment_id, // Send the payment ID
          });
  
          if (res.data.status === 'ok') {
            setSelectedPlans((prevSelectedPlans) =>
              prevSelectedPlans.includes(planId)
                ? prevSelectedPlans.filter((id) => id !== planId)
                : [...prevSelectedPlans, planId]
            );
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
      <Sidebar />
      <div className="container">
        <div className="pricePlanTitle">
          <h1>PRICE PLAN</h1>
          {error && <p className="error-message">{error}</p>}
        </div>
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
                  onClick={() => handleSelectPlan(plan._id, plan.planPrice)}
                >
                  {selectedPlans.includes(plan._id) ? 'Selected' : 'Get Started'}
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
