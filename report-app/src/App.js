// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import ReportScanner from './components/ReportScanner'; // Import ReportScanner
import DoctorDetails from './components/DoctorDetails';
import './styles.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to="/dashboard" /> : <AuthForm onLoginSuccess={handleLoginSuccess} />}
        />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} /> : <Navigate to="/" />}
        />
        <Route
          path="/report-scanner"
          element={user ? <ReportScanner /> : <Navigate to="/" />} // Add route for ReportScanner
        />
        <Route path="/doctor-details" element={<DoctorDetails />} />
        {/* Add routes for other components like history here */}
      </Routes>
    </Router>
  );
}

export default App;
