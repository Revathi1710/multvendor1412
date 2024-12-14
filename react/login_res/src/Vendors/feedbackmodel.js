import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import axios from 'axios';

const FeedbackModal = ({ show, order, onClose }) => {
  const [rating, setRating] = useState(0);
  const [responseFeedback, setResponseFeedback] = useState(null);
  const [qualityFeedback, setQualityFeedback] = useState(null);
  const [deliveryFeedback, setDeliveryFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [image, setImage] = useState(null);

  if (!order) return null;

  const handleStarClick = (index) => {
    setRating(index + 1);
  };

  const handleFeedbackClick = (type, value) => {
    if (type === 'response') setResponseFeedback(value);
    if (type === 'quality') setQualityFeedback(value);
    if (type === 'delivery') setDeliveryFeedback(value);
  };

  const handleImageUpload = (event) => {
    setImage(event.target.files[0]);
  };

  const handleSubmitFeedback = async () => {
    try {
      const formData = new FormData();
      formData.append('order_id', order._id);
      formData.append('starRate', rating);
      formData.append('Response', responseFeedback ? 'Positive' : 'Negative');
      formData.append('Quality', qualityFeedback ? 'Positive' : 'Negative');
      formData.append('Delivery', deliveryFeedback ? 'Positive' : 'Negative');
      formData.append('feedbackText', feedbackText);
      if (image) {
        formData.append('image', image);
      }

      const response = await axios.post(`${process.env.REACT_APP_API_URL}/submitFeedback`, formData);

      if (response.data.status === 'ok') {
        alert('Feedback submitted successfully!');
        onClose(); // Close the modal after submission
      } else {
        alert('Failed to submit feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Leave a Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>{order.productname}</h4>
        <div className="mb-3">
          <div className="star-rating">
            {[...Array(5)].map((_, index) => (
              <i
                key={index}
                className={`fa fa-star ${index < rating ? 'text-warning' : ''}`}
                onClick={() => handleStarClick(index)}
                style={{ cursor: 'pointer' }}
              ></i>
            ))}
          </div>
        </div>
        <div className="mb-3 feedbackicons">
          <div className="d-flex align-items-center mb-2 feedbackicons">
            <label className="me-2">Response:</label>
            <i
              className={`fa fa-thumbs-up me-2 ${responseFeedback === true ? 'text-success' : ''}`}
              onClick={() => handleFeedbackClick('response', true)}
              style={{ cursor: 'pointer' }}
            ></i>
            <i
              className={`fa fa-thumbs-down ${responseFeedback === false ? 'text-danger' : ''}`}
              onClick={() => handleFeedbackClick('response', false)}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
          <div className="d-flex align-items-center mb-2">
            <label className="me-2">Quality:</label>
            <i
              className={`fa fa-thumbs-up me-2 ${qualityFeedback === true ? 'text-success' : ''}`}
              onClick={() => handleFeedbackClick('quality', true)}
              style={{ cursor: 'pointer' }}
            ></i>
            <i
              className={`fa fa-thumbs-down ${qualityFeedback === false ? 'text-danger' : ''}`}
              onClick={() => handleFeedbackClick('quality', false)}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
          <div className="d-flex align-items-center mb-2">
            <label className="me-2">Delivery:</label>
            <i
              className={`fa fa-thumbs-up me-2 ${deliveryFeedback === true ? 'text-success' : ''}`}
              onClick={() => handleFeedbackClick('delivery', true)}
              style={{ cursor: 'pointer' }}
            ></i>
            <i
              className={`fa fa-thumbs-down ${deliveryFeedback === false ? 'text-danger' : ''}`}
              onClick={() => handleFeedbackClick('delivery', false)}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
        </div>
        <textarea
          className="form-control mb-3"
          placeholder="Add a review"
          value={feedbackText}
          onChange={(e) => setFeedbackText(e.target.value)}
        ></textarea>
        <div className="mb-3">
          <label>Add Product/Service Photos</label>
          <input type="file" className="form-control" onChange={handleImageUpload} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmitFeedback}>
          Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
