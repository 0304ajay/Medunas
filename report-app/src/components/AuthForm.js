import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AuthForm({ onLoginSuccess }) {
  const [isSignup, setIsSignup] = useState(true);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', age: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? 'http://localhost:5000/signup' : 'http://localhost:5000/login';
    try {
      const res = await axios.post(url, formData);
      toast.success(res.data.message);

      if (!isSignup) {
        onLoginSuccess(res.data.user);  // Assuming the server sends back user data on successful login
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="auth-form">
      <ToastContainer />
      <h2>{isSignup ? 'Sign Up' : 'Log In'}</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        {isSignup && (
          <>
            <input 
              placeholder="First Name" 
              onChange={(e) => setFormData({...formData, first_name: e.target.value})} 
              required 
              autoComplete="off" 
            />
            <input 
              placeholder="Last Name" 
              onChange={(e) => setFormData({...formData, last_name: e.target.value})} 
              required 
              autoComplete="off" 
            />
            <input 
              type="number" 
              placeholder="Age" 
              onChange={(e) => setFormData({...formData, age: e.target.value})} 
              required 
              autoComplete="off" 
            />
          </>
        )}
        <input 
          type="email" 
          placeholder="Email" 
          onChange={(e) => setFormData({...formData, email: e.target.value})} 
          required 
          autoComplete="off" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          onChange={(e) => setFormData({...formData, password: e.target.value})} 
          required 
          autoComplete="off" 
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Log In'}</button>
        <p onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Log in' : 'Don’t have an account? Sign up'}
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
