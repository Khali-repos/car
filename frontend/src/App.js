import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardPage from './pages/DashboardPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import VehiclePage from './pages/VehiclePage';
import Navbar from './components/Navbar';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');

  // Check for token on page load
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        email,
        password,
      });
      setMessage(response.data.message);
      alert('Registration successful!'); // Notify the user
    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Registration failed');
      alert('Registration failed. Please try again.'); // Notify the user
    }
  };
  
  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setMessage(response.data.message);
      setToken(response.data.token);
  
      // Store the token and user data in local storage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user data
      alert('Login successful!'); // Notify the user
    } catch (error) {
      console.error('Login error:', error.response?.data || error.message);
      setMessage(error.response?.data?.message || 'Login failed');
      alert('Login failed. Please try again.'); // Notify the user
    }
  };

  return (
    <Router>
      <Navbar />
      <Routes>
      <Route
  path="/"
  element={
    <div>
      <h1>Frontend</h1>
      <p>Backend says: {message}</p>
      {token && <p>Token: {token}</p>}
      <p>Welcome to the home page! Use the navbar to navigate.</p>
    </div>
  }
/>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/vehicles" element={<VehiclePage />} />
      </Routes>
    </Router>
  );
}

export default App;