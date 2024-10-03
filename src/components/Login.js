import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Login.css';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and signup forms

  // React Hook Form setup for form validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Import w here
  } = useForm();

  // Toggle between login and signup forms
  const toggleForms = () => {
    setIsLogin(!isLogin);
  };

  // Placeholder for form submission logic
  const onSubmit = (data) => {
    console.log('Form data submitted:', data);
    // Add API call or other logic here
  };

  return (
    <div className="container">
      <div className={`frame ${!isLogin ? 'frame-long' : 'frame-short'}`}>
        <div className="nav">
          <ul className="links">
            <li className={isLogin ? 'signin-active' : 'signin-inactive'}>
              <button className="btn btn-primary1" onClick={toggleForms}>Login</button>
            </li>
            <li className={!isLogin ? 'signup-active' : 'signup-inactive'}>
              <button className="btn btn-secondary" onClick={toggleForms}>Sign Up</button>
            </li>
          </ul>
        </div>

        <div className="form-content">
          {isLogin ? (
            // Login Form from sushmab
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`form-signin ${!isLogin ? 'form-signin-left' : ''} needs-validation`}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  type="text"
                  name="username"
                  {...register('username', { required: 'Username is required' })}
                  placeholder="Enter your username"
                />
                {errors.username && <div className="invalid-feedback">{errors.username.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  type="password"
                  name="password"
                  {...register('password', { required: 'Password is required', minLength: 8 })}
                  placeholder="Enter your password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              <button type="submit" className="btn btn-success btn-block mt-4">Login</button>
            </form>
          ) : (
            // Sign Up Form
            <form
              onSubmit={handleSubmit(onSubmit)}
              className={`form-signup ${isLogin ? 'form-signup-left' : ''} needs-validation`}
              noValidate
            >
              <div className="form-group">
                <label htmlFor="fullname">Full Name</label>
                <input
                  className={`form-control ${errors.fullname ? 'is-invalid' : ''}`}
                  type="text"
                  name="fullname"
                  {...register('fullname', { required: 'Full name is required' })}
                  placeholder="Enter your full name"
                />
                {errors.fullname && <div className="invalid-feedback">{errors.fullname.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  type="email"
                  name="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                      message: 'Invalid email format',
                    },
                  })}
                  placeholder="Enter your email"
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  type="password"
                  name="password"
                  {...register('password', { required: 'Password is required', minLength: 8 })}
                  placeholder="Enter your password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <input
                  className={`form-control ${errors.confirmpassword ? 'is-invalid' : ''}`}
                  type="password"
                  name="confirmpassword"
                  {...register('confirmpassword', {
                    required: 'Confirm password is required',
                    validate: (value) => value === watch('password') || 'Passwords do not match',
                  })}
                  placeholder="Confirm your password"
                />
                {errors.confirmpassword && <div className="invalid-feedback">{errors.confirmpassword.message}</div>}
              </div>

              <button type="submit" className="btn btn-success btn-block mt-4">Sign Up</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
