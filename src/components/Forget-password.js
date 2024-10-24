import React from 'react';
import { useForm } from "react-hook-form";

const Forget = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onSubmit", // Trigger validation on form submit
  });

  // Handle form submission
  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
    // Perform any additional logic (like API calls)
    reset(); // Reset form fields
  };

  return (
    <div className="form-container">
      <div className="row">
        {/* Left Side */}
        <div className="col-md-6 welcome-back-section">
          <h2>Forgot your password?</h2>
          <p>No worries! Enter your email and reset it now.</p>
        </div>

        {/* Right Side - Form Section */}
        <div className="col-md-6 form-section">
          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <h2>Forget Password</h2>

            {/* Email Field */}
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
                className={`form-control ${
                  errors.email ? "is-invalid" : ""
                }`}
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

            {/* Password Field */}
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
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
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
              <label htmlFor="password">
                Confirm New Password
                {errors.password ? (
                  <span className="invalid-feedback">
                    {errors.password.message}
                  </span>
                ) : (
                  <span className="mandatory">*</span>
                )}
              </label>
              <input
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
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

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Forget;
