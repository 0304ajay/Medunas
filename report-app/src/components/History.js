import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/history').then((response) => {
      setReports(response.data);
    });
  }, []);

  return (
    <div className="history">
      <h2>Your Report History</h2>
      {reports.map((report) => (
        <div key={report.id}>
          <p>{report.report_text}</p>
          <p>{report.analysis}</p>
        </div>
      ))}
    </div>
  );
}

export default History;
