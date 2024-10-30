import React, { useState } from 'react';

const InitializeTransaction = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  
  // Define the API endpoint
  const url = "https://api.lahza.io/transaction/initialize";

  // Define the fields to be sent in the POST request
  const fields = {
    email: "customer@example.com",
    mobile: "059912313",
    amount: "20000",
    channel: ["qr"]
  };

  // Function to initialize the transaction
  const initializeTransaction = async () => {
    // Convert the fields object to a URL-encoded string
    const formBody = Object.keys(fields)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(fields[key]))
      .join('&');

    try {
      // Make the POST request using fetch
      const res = await fetch(url, {
        method: 'POST', // Equivalent to CURLOPT_POST
        headers: {
          "Authorization": "Bearer sk_test_pLQXlDSzGoLUoQo5tGXP5fufpeRzrxcvJ", // ⚠️ Do not expose SECRET_KEY in frontend
          "Cache-Control": "no-cache",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formBody // Equivalent to CURLOPT_POSTFIELDS
      });

      // Check if the response is OK (status code 200-299)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      // Parse the JSON response
      const data = await res.json();
      setResponse(data); // Update the response state
    } catch (err) {
      setError(err.message); // Update the error state
    }
  };

  return (
    <div style={styles.container}>
      <h1>Initialize Transaction</h1>
      <button style={styles.button} onClick={initializeTransaction}>Start Transaction</button>
      
      {response && (
        <div style={styles.response}>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div style={styles.error}>
          <h2>Error:</h2>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

// Optional: Inline styles for better presentation


export default InitializeTransaction;
