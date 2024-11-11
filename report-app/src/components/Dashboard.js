// src/components/Dashboard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';


function Dashboard({ user }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard">
      <h2>Hello, {user.first_name}</h2>
      <p>Welcome to your dashboard</p>
      <div className="cards-container">
        
        <div className="card" onClick={() => navigate('/report-scanner')}>
          <img src="images/report.png" alt="Report Scanner" />
          <p>Report Scanner</p>
        </div>

        <div className="card" onClick={()=>navigate('/medicine-details')}>
          <img src="images/Medicines.jpg" alt="Medicine Details" />
          <p>Medicine Details</p>
        </div>

        <div className="card" onClick={()=>navigate('/doctor-details')}>
          <img src="images/Doctors.png" alt="Doctors Verification" />
          <p>Doctors Verification</p>
        </div>

        <div className="card">
          <img src="images/sos.jpg" alt="Emergency Contact" />
          <p>Emergency Contact</p>
        </div>

        <div className="card">
          <img src="images/near_by.png" alt="Nearby Clinics" />
          <p>Nearby Clinics</p>
        </div>

        <div className="card">
          <img src="images/Hospital.jpg" alt="Medicine Recommendation" />
          <p>Medicine Recommendation</p>
        </div>

      </div>
      <button onClick={() => navigate('/history')}>View History</button>
    </div>
  );
}

export default Dashboard;
