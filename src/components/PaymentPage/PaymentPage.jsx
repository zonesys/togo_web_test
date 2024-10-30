import React, { useState, useEffect, useRef } from 'react';
import styles from './PaymentPage.module.css';

export default function PaymentPage() {
  const [email, setEmail] = useState('test@test.com');
  const [amount, setAmount] = useState(100);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null); // New state for tracking info
  const formRef = useRef(null);

  // Function to dynamically load external scripts
  const loadScript = (src, onLoad, onError) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;

    script.onload = onLoad;
    script.onerror = onError;

    document.body.appendChild(script);
  };

  useEffect(() => {
    // Load the LahzaPopup script
    loadScript(
      'https://js.lahza.io/inline.min.js',
      () => {
        console.log('LahzaPopup script loaded');
        setIsScriptLoaded(true);
      },
      () => {
        console.error('Failed to load LahzaPopup script');
      }
    );

    // Attach event listener to the form
    const form = formRef.current;
    if (form) {
      form.addEventListener('submit', pay);
    }

    // Cleanup on unmount
    return () => {
      if (form) {
        form.removeEventListener('submit', pay);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, amount]);

  // Function to get tracking info from backend
  const getOrderInfo = async (orderId) => {
    try {
      const response = await fetch(`http:localhost:3000/api/v1/orders/${orderId}/track`);
      if (!response.ok) {
        throw new Error(`Failed to fetch tracking info: ${response.statusText}`);
      }
      const data = await response.json();
      setOrderInfo(data); // Save tracking info in state
    } catch (error) {
      console.error('Error fetching order info:', error);
    }
  };

  function pay(e) {
    e.preventDefault();

    if (!window.LahzaPopup) {
      console.error('LahzaPopup is not loaded.');
      alert('Payment service is not available at the moment. Please try again later.');
      return;
    }

    const lahza = new window.LahzaPopup();

    try {
      lahza.newTransaction({
        key: 'pk_test_UV0df5yCPdTBXjPXhaQ2hdnxg84yp31U4', // Consider moving this to environment variables
        email: email,
        currency: 'ILS',
        amount: orderInfo.cod, // Assuming amount is in the smallest currency unit
        onSuccess: (transaction) => {
          const message = `Payment complete! Reference: ${transaction.reference}`;
          alert(message);
          // Optionally, redirect or perform other actions here

          // Fetch tracking info after successful payment
          const orderId = transaction.reference; // Assuming the transaction reference is the order ID
          getTrackingInfo(orderId);
        },
        onCancel: () => {
          alert('Payment window closed.');
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      alert('An error occurred during the payment process. Please try again.');
    }
  }

  return (
    <div className={styles.payment}>
     
      <form ref={formRef}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-submit">
          <button type="submit" disabled={!isScriptLoaded}>
            {isScriptLoaded ? 'Pay' : 'Loading...'}
          </button>
        </div>
      </form>

      {/* Display tracking info if available */}
      {trackingInfo && (
        <div className={styles.trackingInfo}>
          <h3>Order Tracking Information</h3>
          <pre>{JSON.stringify(trackingInfo, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
