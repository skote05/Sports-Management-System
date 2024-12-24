import React, { useState, useEffect } from 'react';
import './PaymentProcessing.css'; // Import the stylesheet

const PaymentProcessing = () => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [upiId, setUpiId] = useState('');
  const [transactionStatus, setTransactionStatus] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [amount, setAmount] = useState(5000); // Default amount (5000)
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [userData, setUserData] = useState({
    username: 'John Doe',  // Example username
    email: 'johndoe@gmail.com', // Example email
    paymentStatus: 'Not Paid',  // Payment status
  });

  // Load transaction history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('transactionHistory');
    if (savedHistory) {
      setTransactionHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Handle amount selection
  const handleAmountChange = (e) => {
    setAmount(Number(e.target.value));
  };

  // Handle Card Number Change
  const handleCardNumberChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
    setCardNumber(value);
  };

  // Handle Expiry Date Change
  const handleExpiryDateChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^0-9/]/g, ''); // Allow only numbers and a single slash
    if (value.indexOf('/') !== -1) {
      const parts = value.split('/');
      if (parts.length > 2) {
        value = parts[0] + '/' + parts[1].slice(0, 2); // Keep only two digits for year
      }
    }
    if (value.length <= 2) {
      value = value.replace(/(\d{2})(\d{0,2})/, '$1/$2');
    }
    setExpiryDate(value);
  };

  // Handle CVV Change
  const handleCvvChange = (e) => {
    let value = e.target.value;
    value = value.replace(/\D/g, '').slice(0, 3);
    setCvv(value);
  };

  // Handle UPI ID Change
  const handleUpiIdChange = (e) => {
    let value = e.target.value;
    setUpiId(value);
  };

  // Validate UPI ID format
  const validateUpiId = (upiId) => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/; // Regex for valid UPI ID format
    return upiRegex.test(upiId);
  };

  // Handle Form Submission
  const handleSubmit = () => {
    if (paymentMethod === 'card') {
      if (cardNumber.length !== 19) {
        setTransactionStatus('Failure: Invalid Card Number');
        return;
      }
      if (expiryDate.length !== 5 || !expiryDate.includes('/')) {
        setTransactionStatus('Failure: Invalid Expiry Date');
        return;
      }
      if (cvv.length !== 3) {
        setTransactionStatus('Failure: Invalid CVV');
        return;
      }
    } else if (paymentMethod === 'upi') {
      if (!validateUpiId(upiId)) {
        setTransactionStatus('Failure: Invalid UPI ID');
        return;
      }
    }

    const transactionDetails = {
      transactionId: `TXN${Math.floor(Math.random() * 1000000)}`,
      amountPaid: amount,
      paymentMethod,
      date: new Date().toLocaleString(),
    };

    setTransactionStatus('Success: Transaction Successful!');
    alert('Transaction Successful!');

    // Update payment success status and user data
    setPaymentSuccess(true);
    setUserData((prevData) => ({
      ...prevData,
      paymentStatus: 'Paid',
    }));

    // Add the transaction to history
    const updatedHistory = [...transactionHistory, transactionDetails];
    setTransactionHistory(updatedHistory);

    // Save the updated history to localStorage
    localStorage.setItem('transactionHistory', JSON.stringify(updatedHistory));
  };

  // Handle Payment Method Change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Display Transaction History
  const handleHistoryClick = () => {
    if (transactionHistory.length === 0) {
      alert('No transactions yet!');
      return;
    }

    let historyDetails = 'Transaction History:\n';
    transactionHistory.forEach((transaction, index) => {
      historyDetails += `
        Transaction ${index + 1}:
        ID: ${transaction.transactionId}
        Amount Paid: $${transaction.amountPaid}
        Payment Method: ${transaction.paymentMethod}
        Date: ${transaction.date}\n`;
    });

    alert(historyDetails);
  };

  // Clear Transaction History
  const handleClearHistory = () => {
    setTransactionHistory([]);
    localStorage.removeItem('transactionHistory');
    alert('Transaction history has been cleared.');
  };

  // Handle Invoice Generation
  const handleGenerateInvoice = () => {
    const invoiceDetails = `
      Invoice:
      Name: ${userData.username}
      Email: ${userData.email}
      Payment Status: ${userData.paymentStatus}
      Amount Paid: $${amount}
      Membership: ${amount === 5000 ? 'Silver' : amount === 10000 ? 'Gold' : 'Platinum'}
      Transaction ID: TXN${Math.floor(Math.random() * 1000000)}
      Date: ${new Date().toLocaleString()}
    `;
    const invoiceWindow = window.open();
    invoiceWindow.document.write('<pre>' + invoiceDetails + '</pre>');
  };

  return (
    <div className="payment-processing">
      <h2>Payment Processing</h2>

      {/* Payment Method Selection */}
      <div>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={paymentMethod === 'card'}
            onChange={handlePaymentMethodChange}
          />
          Card Payment
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="upi"
            checked={paymentMethod === 'upi'}
            onChange={handlePaymentMethodChange}
          />
          UPI Payment
        </label>
      </div>

      {/* Amount Selection */}
      <div>
        <label>
          <input
            type="radio"
            name="amount"
            value={5000}
            checked={amount === 5000}
            onChange={handleAmountChange}
          />
          Silver - $5000
        </label>
        <label>
          <input
            type="radio"
            name="amount"
            value={10000}
            checked={amount === 10000}
            onChange={handleAmountChange}
          />
          Gold - $10000
        </label>
        <label>
          <input
            type="radio"
            name="amount"
            value={15000}
            checked={amount === 15000}
            onChange={handleAmountChange}
          />
          Platinum - $15000
        </label>
      </div>

      {/* Card Payment Form */}
      {paymentMethod === 'card' && (
        <div className="card-payment-form">
          <div>
            <label>Card Number</label>
            <input
              type="text"
              maxLength="19" // Allow 16 digits + 3 spaces
              value={cardNumber}
              onChange={handleCardNumberChange}
              placeholder="1234 5678 1234 5678"
            />
          </div>

          <div>
            <label>Expiry Date</label>
            <input
              type="text"
              maxLength="5" // Format: MM/YY
              value={expiryDate}
              onChange={handleExpiryDateChange}
              placeholder="MM/YY"
            />
          </div>

          <div>
            <label>CVV</label>
            <input
              type="text"
              maxLength="3"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="CVV"
            />
          </div>
        </div>
      )}

      {/* UPI Payment Form */}
      {paymentMethod === 'upi' && (
        <div className="upi-payment-form">
          <div>
            <label>Enter UPI ID</label>
            <input
              type="text"
              value={upiId}
              onChange={handleUpiIdChange}
              placeholder="you@upi"
            />
          </div>
        </div>
      )}

      <button onClick={handleSubmit}>Submit Payment</button>

      {/* Transaction Status */}
      <div>{transactionStatus}</div>

      {/* Buttons */}
      <button onClick={handleGenerateInvoice}>Generate Invoice</button>
      <button onClick={handleHistoryClick}>View Transaction History</button>
      <button onClick={handleClearHistory}>Clear History</button>
    </div>
  );
};

export default PaymentProcessing;
