import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; 
import { API_BASE_URL } from './Config';

const Forget = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onSubmit", 
  });

  const navigate = useNavigate(); 
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          new_password: data.password,
          confirm_password: data.confirmPassword
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Password reset successful:", result);
        setModalMessage("Password reset successful!"); 
        setShowModal(true); 
        reset(); 
      } else {
        setModalMessage(result.message || "Failed to reset password.");
        setShowModal(true); 
      }
    } catch (error) {
      console.error("Error:", error);
      setModalMessage("An error occurred. Please try again later.");
      setShowModal(true); 
    }
  };

  // Function to handle modal button click
  const handleModalClose = () => {
    setShowModal(false); 
    navigate('/login'); 
  };

  return (
    <div className="form-container">
      <div className="row">
        {/* Left Side */}
        <div className="col-md-6 welcome-back-section">
          <h2>🔑 Forgot your password?</h2> 
          <p>No worries! Enter your new desired password.</p>
          <p style={{ fontStyle: 'italic', color: '#007bff' }}>
            *Ensure your password is strong for better security!
          </p>
        </div>

        {/* Right Side */}
        <div className="col-md-6 form-section">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2>Forget Password</h2>

            <div className="form-group">
              <label htmlFor="email">
                Email
                {errors.email ? (
                  <span className="invalid-feedback">
                    {errors.email.message}
                  </span>
                ) : (
                  <span className="mandatory">*</span>
                )}
              </label>
              <input
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                New Password
                {errors.password ? (
                  <span className="invalid-feedback">
                    {errors.password.message}
                  </span>
                ) : (
                  <span className="mandatory">*</span>
                )}
              </label>
              <input
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                type="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                placeholder="Enter your new password"
              />
            </div>

            
            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm New Password
                {errors.confirmPassword ? (
                  <span className="invalid-feedback">
                    {errors.confirmPassword.message}
                  </span>
                ) : (
                  <span className="mandatory">*</span>
                )}
              </label>
              <input
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                type="password"
                {...register("confirmPassword", {
                  required: "Confirm password is required",
                  validate: (value) =>
                    value === watch("password") || "Passwords do not match",
                })}
                placeholder="Confirm your new password"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Modal  */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Forget;
