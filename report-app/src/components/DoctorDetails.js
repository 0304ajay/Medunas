import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './DoctorDetails.css';

function DoctorDetails() {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    // Load and parse the CSV file
    fetch('doctor_details.csv')
      .then(response => response.text())
      .then(data => {
        Papa.parse(data, {
          header: true,
          complete: (result) => {
            setDoctors(result.data);
          }
        });
      });
  }, []);

  const handleSearch = () => {
    if (searchTerm) {
      const lowerCaseTerm = searchTerm.toLowerCase();

      setFilteredDoctors(
        doctors.filter(doctor =>
          Object.entries(doctor).some(([key, value]) => {
            // Convert value to string and make lowercase
            const stringValue = value ? value.toString().toLowerCase() : '';

            // Check for exact match for numeric fields like registration number
            if (key.toLowerCase().includes("registration number") && !isNaN(searchTerm)) {
              return stringValue === lowerCaseTerm;
            }

            // Otherwise, check if the value contains the search term as a substring
            return stringValue.includes(lowerCaseTerm);
          })
        )
      );
    } else {
      setFilteredDoctors(doctors);
    }
  };

  return (
    <div className="doctor-details">
      <h2>Doctors Verification</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by Name or Registration ID"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="doctor-list">
        {filteredDoctors.map((doctor, index) => (
          <div key={index} className="doctor-card">
            <p><strong>Year of Info:</strong> {doctor['year of info']}</p>
            <p><strong>Registration Number:</strong> {doctor['Registration number']}</p>
            <p><strong>Medical Council:</strong> {doctor['Medical council']}</p>
            <p><strong>Name:</strong> {doctor['Name']}</p>
            <p><strong>Father's Name:</strong> {doctor['Father name']}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorDetails;
