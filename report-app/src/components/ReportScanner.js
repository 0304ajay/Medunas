import React, { useState } from 'react';
import axios from 'axios';
import './ReportScanner.css';
import { GoogleGenerativeAI } from "@google/generative-ai";

function ReportScanner() {
  const [file, setFile] = useState(null);
  const [processingResult, setProcessingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Read the file as base64 (for sending to Azure API)
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result.split(',')[1];  // Get base64 part of the file
        
        try {
          // Step 1: Send the base64-encoded file to the Azure API for text extraction
          const response = await fetch("https://altesseract.cognitiveservices.azure.com/vision/v3.2/read/analyze", {
            method: "POST",
            headers: {
              "Content-Type": "application/octet-stream",
              "Ocp-Apim-Subscription-Key": "83ua0ucXj5lDd0iiQnep0ZdzGxW6qYlBRReOuJrHaA9HV4lyhpGJJQQJ99AKACYeBjFXJ3w3AAAFACOGj3Ii",
            },
            body: base64Data,
          });

          const operationUrl = response.headers.get('operation-location');

          // Poll for the result from Azure
          let extractedText = "";
          while (true) {
            const pollResponse = await axios.get(operationUrl, {
              headers: {
                "Ocp-Apim-Subscription-Key": "83ua0ucXj5lDd0iiQnep0ZdzGxW6qYlBRReOuJrHaA9HV4lyhpGJJQQJ99AKACYeBjFXJ3w3AAAFACOGj3Ii",
              },
            });
            const pollData = pollResponse.data;
            if (pollData.status === 'succeeded') {
              extractedText = pollData.analyzeResult.readResults
                .map(result => result.lines.map(line => line.text).join(' '))
                .join('\n');
              break;
            }
            await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for a second before polling again
          }

          // Step 2: Summarize the extracted text using Google Generative AI
          const genAI = new GoogleGenerativeAI(process.env.API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
          const prompt = `Please summarize the report in simple words as I am a non-medical background student and also compare the parameters with ideal values:\n\n${extractedText}`;

          const summaryResponse = await model.generateContent(prompt);
          const summary = summaryResponse.data;

          // Step 3: Translate the summary using Google Generative AI
          const translationPrompt = `Translate the following text to Telugu:\n\n${summary}`;
          const translatedResponse = await model.generateContent(translationPrompt);
          const translatedSummary = translatedResponse.data;

          // Set processing results
          setProcessingResult({
            extracted_text: extractedText,
            summary,
            translated_summary: translatedSummary,
          });

          setFile(null);
        } catch (error) {
          console.error('Error processing file:', error);
          alert('Failed to process file');
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file); // Read file as base64
    } catch (error) {
      console.error('Error reading file:', error);
      alert('Error processing file');
      setLoading(false);
    }
  };

  return (
    <div className="report-scanner">
      <div className="scanner-header">
        <h2>Report Scanner</h2>
        <p>Upload a PDF or image report to scan and analyze.</p>
      </div>
      <div className="file-upload-section">
        <label className="custom-file-upload">
          <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />
          {file ? file.name : 'Choose a file'}
        </label>
        <button onClick={handleUpload} disabled={loading}>
          {loading ? 'Processing...' : 'Upload and Scan'}
        </button>
      </div>
      {processingResult && (
        <div className="result-section">
          <h3>Processing Result:</h3>
          <div>
            <h4>Extracted Text:</h4>
            <p>{processingResult.extracted_text}</p>
          </div>
          <div>
            <h4>Summary:</h4>
            <p>{processingResult.summary}</p>
          </div>
          <div>
            <h4>Translated Summary (Telugu):</h4>
            <p>{processingResult.translated_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportScanner;
