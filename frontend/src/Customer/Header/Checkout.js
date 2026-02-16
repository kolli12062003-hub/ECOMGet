import React, { useState, useEffect } from 'react';
import './Checkout.css';

const Checkout = ({ cartItems, navigateTo, currentUser }) => {
  const [step, setStep] = useState(1); // 1: Address, 2: Payment
  const [selectedAddress, setSelectedAddress] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [useLocation, setUseLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [upiMethod, setUpiMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: ''
  });
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Check authentication - redirect to login if not authenticated as customer
  if (!currentUser.isAuthenticated || currentUser.role?.toLowerCase() !== 'customer') {
    navigateTo('login');
    return null;
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      const price = item.discountedPrice || item.price || 0;
      return total + (price * item.quantity);
    }, 0);
    const commission = subtotal * 0.05;
    return subtotal + commission;
  };

  const handleAddressContinue = () => {
    if (selectedAddress || newAddress || useLocation) {
      setStep(2);
    } else {
      alert('Please select or add a delivery address');
    }
  };

  const handlePayment = () => {
    if (paymentMethod === 'upi' && !upiMethod) {
      alert('Please select a UPI method');
      return;
    }
    if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv)) {
      alert('Please fill all card details');
      return;
    }

    // Simulate payment processing
    setTimeout(() => {
      setOrderPlaced(true);
    }, 1000);
  };

  const handleOrderComplete = () => {
    // Clear cart and redirect to home
    navigateTo('home');
  };

  if (orderPlaced) {
    return (
      <div className="checkout-container">
        <div className="order-success">
          <h2>Order Placed Successfully!</h2>
          <p>Your order has been confirmed and will be delivered soon.</p>
          <button className="btn" onClick={handleOrderComplete}>Continue Shopping</button>
        </div>
      </div>
    );
  }

  return (
    <section className="section checkout-section">
      <div className="container">
        <div className="section-title">
          <h2>Checkout</h2>
        </div>

        <div className="checkout-container">
          {step === 1 && (
            <div className="checkout-step">
              <h3>Delivery Address</h3>

              {/* Existing Addresses */}
              {currentUser.details?.addresses && currentUser.details.addresses.length > 0 && (
                <div className="address-options">
                  <h4>Select Existing Address</h4>
                  {currentUser.details.addresses.map((address, index) => (
                    <div key={index} className="address-option">
                      <input
                        type="radio"
                        name="address"
                        value={address}
                        checked={selectedAddress === address}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                      />
                      <label>{address}</label>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Address */}
              <div className="address-options">
                <h4>Add New Address</h4>
                <textarea
                  placeholder="Enter your delivery address"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  rows="3"
                />
              </div>

              {/* Use Current Location */}
              <div className="address-options">
                <div className="address-option">
                  <input
                    type="radio"
                    name="address"
                    checked={useLocation}
                    onChange={() => {
                      setUseLocation(true);
                      setSelectedAddress('');
                      setNewAddress('');
                    }}
                  />
                  <label>Use My Current Location</label>
                </div>
              </div>

              <button className="btn continue-btn" onClick={handleAddressContinue}>
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="checkout-step">
              <h3>Payment Method</h3>

              {/* Order Summary */}
              <div className="order-summary">
                <h4>Order Summary</h4>
                {cartItems.map(item => (
                  <div key={item._id || item.id} className="summary-item">
                    <span>{item.name} x {item.quantity}</span>
                    <span>₹{((item.discountedPrice || item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="summary-item total">
                  <span>Total Amount</span>
                  <span>₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Options */}
              <div className="payment-options">
                {/* UPI */}
                <div className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label>UPI</label>
                  {paymentMethod === 'upi' && (
                    <div className="payment-details">
                      <select
                        value={upiMethod}
                        onChange={(e) => setUpiMethod(e.target.value)}
                      >
                        <option value="">Select UPI Method</option>
                        <option value="paytm">Paytm</option>
                        <option value="googlepay">Google Pay</option>
                        <option value="phonepe">PhonePe</option>
                      </select>
                      <button className="btn pay-btn" onClick={handlePayment}>
                        Pay ₹{calculateTotal().toLocaleString()}
                      </button>
                    </div>
                  )}
                </div>

                {/* Credit/Debit Card */}
                <div className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label>Credit/Debit/ATM Card</label>
                  {paymentMethod === 'card' && (
                    <div className="payment-details card-details">
                      <input
                        type="text"
                        placeholder="Card Number"
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                        maxLength="16"
                      />
                      <div className="card-row">
                        <input
                          type="text"
                          placeholder="Valid Thru (MM/YY)"
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                          maxLength="5"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardDetails.cvv}
                          onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                          maxLength="3"
                        />
                      </div>
                      <button className="btn pay-btn" onClick={handlePayment}>
                        Pay ₹{calculateTotal().toLocaleString()}
                      </button>
                    </div>
                  )}
                </div>

                {/* Cash on Delivery */}
                <div className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <label>Cash on Delivery</label>
                  {paymentMethod === 'cod' && (
                    <div className="payment-details">
                      <button className="btn pay-btn" onClick={handlePayment}>
                        Pay ₹{calculateTotal().toLocaleString()}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Checkout;
