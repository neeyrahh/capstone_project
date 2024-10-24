import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Styles.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    mode: "onSubmit", // Makes sure validation is triggered on submit
  });

  // Toggle between login and sign up forms
  const toggleForms = () => {
    setIsLogin(!isLogin);
    reset(); // Reset form fields when switching
  };

  // Placeholder for form submission logic (Sign Up and Login)
  const onSubmit = (data) => {
    console.log("Form data submitted:", data);
    if (!isLogin) {
      toggleForms();
    }
    // Add API call or other logic here for both Sign Up and Login
  };

  return (
    <div className="form-container">
      <div className="row">
        {/* Left Side */}
        <div className="col-md-6 welcome-back-section">
          <h2>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </h2>
          <p>
            {isLogin
              ? "Click Sign Up to create your account"
              : "Click Login to access your account"}
          </p>
          <button className="btn btn-primary" onClick={toggleForms}>
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>

        {/* Right Side */}
        <div className="col-md-6 form-section">
          {isLogin ? (
            // Login Form
            <form onSubmit={handleSubmit(onSubmit)} className="login-form">
              <h2>Login</h2>
              <div className="form">
                <div className="form-group">
                  <label htmlFor="username">
                    Username
                    {errors.username ? (
                      <span className="invalid-feedback">
                        {errors.username.message}
                      </span>
                    ) : (
                      <span className="mandatory">*</span>
                    )}
                  </label>
                  <input
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    type="text"
                    name="username"
                    {...register("username", {
                      required: "Username is required",
                    })}
                    placeholder="Enter your username"
                  />
                </div>
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
                    name="email"
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
                    Password
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
                    name="password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: 8,
                    })}
                    placeholder="Enter your password"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary">
                Login
              </button>
              <span>Did you forget your password? <a href="./forget-password">Click Here</a></span>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSubmit(onSubmit)} className="signup-form">
              <h2>Sign Up</h2>
              <div className="form">
              <div className="form-group">
                <label htmlFor="fullname">
                  Full Name
                  {errors.fullname ? (
                    <span className="invalid-feedback">
                      {errors.fullname.message}
                    </span>
                  ) : (
                    <span className="mandatory">*</span>
                  )}
                </label>
                <input
                  className={`form-control ${
                    errors.fullname ? "is-invalid" : ""
                  }`}
                  type="text"
                  name="fullname"
                  {...register("fullname", {
                    required: "Full name is required",
                  })}
                  placeholder="Enter your full name"
                />
              </div>

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
                  name="email"
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
                  Password
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
                  name="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: 8,
                  })}
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmpassword">
                  Confirm Password
                  {errors.confirmpassword ? (
                    <span className="invalid-feedback">
                      {errors.confirmpassword.message}
                    </span>
                  ) : (
                    <span className="mandatory">*</span>
                  )}
                </label>
                <input
                  className={`form-control ${
                    errors.confirmpassword ? "is-invalid" : ""
                  }`}
                  type="password"
                  name="confirmpassword"
                  {...register("confirmpassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === watch("password") || "Passwords do not match",
                  })}
                  placeholder="Confirm your password"
                />
              </div>
              </div>
              <button type="submit" className="btn">
                Sign Up
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
