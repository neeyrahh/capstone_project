import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti"; 
import "bootstrap/dist/css/bootstrap.min.css";
import { useAuth } from './Auth/AuthContext';


const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [confetti, setConfetti] = useState(false); 
  const { login } = useAuth(); 
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({ mode: "onSubmit" });

  // Toggle between login and sign-up forms
  const toggleForms = () => {
    setIsLogin(!isLogin);
    reset(); 
  };

  // Form submission logic for Login and Sign-up
  const onSubmit = async (data) => {
    
    const payload = isLogin
      ? {
          email: data.email,
          password: data.password,
        }
      : {
          email: data.email,
          password: data.password,
          username: data.fullname, 
        };

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload), 
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Success:", result);

        if (isLogin) {
          login();
          navigate("/dashboard"); 
        } else {
         
          setConfetti(true);
          setTimeout(() => {
            toggleForms(); 
            setConfetti(false); 
          }, 3000); 
        }
      } else {
        alert(result.message || "Something went wrong!");
      }
    } catch (error) {
      console.error("Network Error:", error);
      alert("Unable to reach the server. Please try again later.");
    }
  };

  return (
    <div className="form-container">
      {confetti && <Confetti />} 
     
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

          
            {isLogin && (
              <div className="mt-2">
                <span>
                  Did you forget your password?{" "}
                  <a href="./forget-password">Click Here</a>
                </span>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="col-md-6 form-section">
            <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
              <h2>{isLogin ? "Login" : "Sign Up"}</h2>
              <div className="form-group">
                <label htmlFor="email">
                  Email
                  {errors.email && (
                    <span className="invalid-feedback">
                      {errors.email.message}
                    </span>
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
                  Password
                  {errors.password && (
                    <span className="invalid-feedback">
                      {errors.password.message}
                    </span>
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
                  placeholder="Enter your password"
                />
              </div>
           
              {!isLogin && (
                <>
                  <div className="form-group">
                    <label htmlFor="confirmpassword">
                      Confirm Password
                      {errors.confirmpassword && (
                        <span className="invalid-feedback">
                          {errors.confirmpassword.message}
                        </span>
                      )}
                    </label>
                    <input
                      className={`form-control ${errors.confirmpassword ? "is-invalid" : ""}`}
                      type="password"
                      {...register("confirmpassword", {
                        required: "Confirm password is required",
                        validate: (value) =>
                          value === watch("password") || "Passwords do not match",
                      })}
                      placeholder="Confirm your password"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="fullname">
                      Full Name
                      {errors.fullname && (
                        <span className="invalid-feedback">
                          {errors.fullname.message}
                        </span>
                      )}
                    </label>
                    <input
                      className={`form-control ${errors.fullname ? "is-invalid" : ""}`}
                      type="text"
                      {...register("fullname", {
                        required: "Full name is required",
                      })}
                      placeholder="Enter your full name"
                    />
                  </div>
                </>
              )}

              <button type="submit" className="btn btn-primary">
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
    
    </div>
  );
};

export default LoginSignup;
