// EarnerDashboard.jsx
import React, { useState, useEffect } from 'react';
import './EarnerDashboard.css';

const EarnerDashboard = ({ onLogout, user }) => {
  const [earnings, setEarnings] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    completedTasks: 0,
    activeTasks: 0
  });
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    businessType: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    lat: null,
    lon: null
  });
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [profileErrors, setProfileErrors] = useState({});
  const [fetchingLocation, setFetchingLocation] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // All categories matching your ShopNest product categories
  const businessTypes = [
    'Food & Dining',
    'Medicines',
    'Automotive',
    'Services',
    'Jewellery',
    'Clothes',
    'Beauty',
    'Groceries',
    'Fruits',
    'Books',
    'Pet Food',
    'Musical Instruments',
    'Footwear',
    'Home Furniture',
    'Bags',
    'Kitchen Products',
    'Organic',
    'Sports & Fitness',
    'Watches',
    'Home Decor'
  ];

  useEffect(() => {
    fetchEarningsData();
  }, []);

  useEffect(() => {
    if (showSellerForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showSellerForm]);

  const fetchEarningsData = async () => {
    try {
      // Fetch seller registration count for this earner
      const registrationResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/earner/seller-registrations/${user?.email}`);
      const registrationData = await registrationResponse.json();
      const sellerRegistrationCount = registrationData.count || 0;

      setEarnings(2500.50);
      setTransactions([
        { id: 1, type: 'Commission', amount: 150.00, date: '2024-01-15', status: 'Completed' },
        { id: 2, type: 'Referral', amount: 75.50, date: '2024-01-14', status: 'Pending' },
        { id: 3, type: 'Bonus', amount: 200.00, date: '2024-01-13', status: 'Completed' }
      ]);
      setStats({
        totalEarnings: 2500.50,
        pendingEarnings: 125.50,
        completedTasks: sellerRegistrationCount,
        activeTasks: 8
      });
    } catch (error) {
      console.error('Error fetching earnings data:', error);
      // Fallback to default values if API fails
      setStats({
        totalEarnings: 2500.50,
        pendingEarnings: 125.50,
        completedTasks: 0,
        activeTasks: 8
      });
    }
  };

  const fetchProfileData = async () => {
    if (!user?.email) return;

    setLoadingProfile(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/profile?email=${user.email}&role=Earner`);
      const data = await response.json();

      if (response.ok && data.user) {
        setProfileFormData({
          name: data.user.fullname || '',
          phone: data.user.phone || '',
          email: data.user.email || '',
          address: data.user.addresses && data.user.addresses.length > 0 ? data.user.addresses[0] : ''
        });
      } else {
        // If no profile data exists, set defaults
        setProfileFormData({
          name: user.fullname || '',
          phone: '',
          email: user.email || '',
          address: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      // Set defaults if API fails
      setProfileFormData({
        name: user.fullname || '',
        phone: '',
        email: user.email || '',
        address: ''
      });
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddressGeocode = () => {
    if (navigator.geolocation) {
      setFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          try {
            // Fetch address from coordinates using Nominatim (OpenStreetMap)
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
              {
                headers: {
                  'Accept-Language': 'en'
                }
              }
            );
            
            if (response.ok) {
              const data = await response.json();
              
              // Format the address nicely
              const addressParts = [];
              if (data.address.house_number) addressParts.push(data.address.house_number);
              if (data.address.road) addressParts.push(data.address.road);
              if (data.address.suburb) addressParts.push(data.address.suburb);
              if (data.address.city) addressParts.push(data.address.city);
              if (data.address.state) addressParts.push(data.address.state);
              if (data.address.postcode) addressParts.push(data.address.postcode);
              
              const formattedAddress = addressParts.join(', ') || data.display_name;
              
              setFormData(prev => ({
                ...prev,
                lat: latitude,
                lon: longitude,
                address: formattedAddress
              }));
              
              alert(`✅ Location captured successfully!\n\nAddress: ${formattedAddress}\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            } else {
              // If reverse geocoding fails, still save coordinates
              setFormData(prev => ({
                ...prev,
                lat: latitude,
                lon: longitude
              }));
              alert(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            // Still save coordinates even if address fetch fails
            setFormData(prev => ({
              ...prev,
              lat: latitude,
              lon: longitude
            }));
            alert(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
          } finally {
            setFetchingLocation(false);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setFetchingLocation(false);
          
          let errorMessage = 'Unable to get your location. ';
          switch(error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += 'Please allow location access in your browser settings.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage += 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage += 'Location request timed out.';
              break;
            default:
              errorMessage += 'Please enter coordinates manually or check your browser permissions.';
          }
          alert(errorMessage);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }

    if (!formData.businessType) {
      newErrors.businessType = 'Please select a business type';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      console.log('📤 Submitting seller registration with data:', {
        name: formData.fullName,
        businessName: formData.businessName,
        address: formData.address,
        lat: formData.lat,
        lon: formData.lon
      });

      const response = await fetch('${process.env.REACT_APP_API_URL}/api/auth/register/seller', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.fullName,
          businessName: formData.businessName,
          businessType: formData.businessType,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          lat: formData.lat,
          lon: formData.lon,
          role: 'seller',
          earnerEmail: user?.email // Track which earner registered this seller
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success message with pending approval info
        alert(
          '✅ Seller Registration Submitted Successfully!\n\n' +
          '⏳ Your registration is now pending admin approval.\n\n' +
          'You will receive an email notification once your account is approved.\n\n' +
          'This usually takes 1-2 business days.\n\n' +
          'Thank you for your patience!'
        );
        setFormData({
          fullName: '',
          businessName: '',
          businessType: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          lat: null,
          lon: null
        });
        setShowSellerForm(false);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during registration');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (profileErrors[name]) {
      setProfileErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};

    if (!profileFormData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!profileFormData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(profileFormData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (!profileFormData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profileFormData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!profileFormData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    setProfileErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    try {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          role: 'Earner',
          profile: {
            name: profileFormData.name,
            phone: profileFormData.phone,
            addresses: [profileFormData.address]
          }
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Profile updated successfully!');
        setShowProfileModal(false);
        setProfileFormData({
          name: '',
          phone: '',
          email: '',
          address: ''
        });
      } else {
        alert(data.message || 'Profile update failed');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during profile update');
    }
  };

  const closeModal = () => {
    setShowSellerForm(false);
    setFormData({
      fullName: '',
      businessName: '',
      businessType: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      lat: null,
      lon: null
    });
    setErrors({});
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setProfileFormData({
      name: '',
      phone: '',
      email: '',
      address: ''
    });
    setProfileErrors({});
  };

  return (
    <div className="earner-dashboard">
      <div className="dashboard-header">
        <h1>Earner Dashboard</h1>
        <button className="logout-btn" onClick={onLogout}>Logout</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Earnings</h3>
          <p className="stat-value">${stats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Earnings</h3>
          <p className="stat-value">${stats.pendingEarnings.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Completed Tasks</h3>
          <p className="stat-value">{stats.completedTasks}</p>
        </div>
        <div className="stat-card">
          <h3>Active Tasks</h3>
          <p className="stat-value">{stats.activeTasks}</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="transactions-section">
          <h2>Recent Transactions</h2>
          <div className="transactions-list">
            {transactions.map(transaction => (
              <div key={transaction.id} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">{transaction.type}</span>
                  <span className="transaction-date">{transaction.date}</span>
                </div>
                <div className="transaction-amount">
                  <span className="amount">${transaction.amount.toFixed(2)}</span>
                  <span className={`status ${transaction.status.toLowerCase()}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="actions-section">
          <h2>Quick Actions</h2>
          <div className="action-buttons">
            <button className="action-btn" onClick={() => setShowSellerForm(true)}>
              🏪 Become a Seller
            </button>
            <button className="action-btn">💰 Withdraw Earnings</button>
            <button className="action-btn" onClick={() => {
              fetchProfileData();
              setShowProfileModal(true);
            }}>👤 Profile</button>
            <button className="action-btn">📞 Support</button>
          </div>
        </div>
      </div>

      {/* Seller Registration Modal */}
      {showSellerForm && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>

            <div className="modal-header">
              <h2>🏪 Seller Registration</h2>
              <p>Join ShopNest as a seller and start earning</p>
              <div style={{
                background: '#fff3e0',
                padding: '12px',
                borderRadius: '8px',
                marginTop: '15px',
                borderLeft: '4px solid #ff9800'
              }}>
                <p style={{ margin: 0, fontSize: '13px', color: '#e65100' }}>
                  ⏳ <strong>Note:</strong> Your registration will be reviewed by our admin team.
                  You'll receive an email once approved (usually 1-2 business days).
                </p>
              </div>
            </div>

            <form className="seller-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={errors.fullName ? 'error' : ''}
                />
                {errors.fullName && <span className="error-message">{errors.fullName}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="businessName"
                  placeholder="Business Name"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={errors.businessName ? 'error' : ''}
                />
                {errors.businessName && <span className="error-message">{errors.businessName}</span>}
              </div>

              <div className="form-group">
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className={errors.businessType ? 'error' : ''}
                >
                  <option value="">Select Business Type</option>
                  {businessTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
                {errors.businessType && <span className="error-message">{errors.businessType}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-group">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={errors.confirmPassword ? 'error' : ''}
                />
                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                  📍 Shop Address (Auto-detected):
                </label>
                <textarea
                  name="address"
                  placeholder="Your shop address will be automatically detected..."
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  style={{ resize: 'vertical', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                <small style={{ display: 'block', marginTop: '5px', color: '#666', fontSize: '12px' }}>
                  Click the button below to auto-detect your location and address
                </small>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                  Coordinates (for distance calculation):
                </label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={formData.lat || ''}
                    onChange={(e) => setFormData({...formData, lat: parseFloat(e.target.value) || null})}
                    style={{ flex: 1, minWidth: '120px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    readOnly
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={formData.lon || ''}
                    onChange={(e) => setFormData({...formData, lon: parseFloat(e.target.value) || null})}
                    style={{ flex: 1, minWidth: '120px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={handleAddressGeocode}
                    disabled={fetchingLocation}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: fetchingLocation ? '#ccc' : '#4CAF50',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: fetchingLocation ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      whiteSpace: 'nowrap',
                      fontWeight: '500'
                    }}
                  >
                    {fetchingLocation ? '🔄 Detecting...' : '📍 Get My Location & Address'}
                  </button>
                </div>
                {formData.lat && formData.lon && (
                  <small style={{ display: 'block', marginTop: '8px', color: '#4CAF50', fontSize: '12px', fontWeight: '500' }}>
                    ✅ Location captured: {formData.lat.toFixed(6)}, {formData.lon.toFixed(6)}
                  </small>
                )}
              </div>

              <button type="submit" className="submit-btn">
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Profile Update Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={closeProfileModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeProfileModal}>×</button>

            <div className="modal-header">
              <h2>👤 Update Profile</h2>
              <p>Update your personal information</p>
            </div>

            <form className="seller-form" onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={profileFormData.name}
                  onChange={handleProfileChange}
                  className={profileErrors.name ? 'error' : ''}
                />
                {profileErrors.name && <span className="error-message">{profileErrors.name}</span>}
              </div>

              <div className="form-group">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={profileFormData.phone}
                  onChange={handleProfileChange}
                  className={profileErrors.phone ? 'error' : ''}
                />
                {profileErrors.phone && <span className="error-message">{profileErrors.phone}</span>}
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Email ID"
                  value={profileFormData.email}
                  onChange={handleProfileChange}
                  className={profileErrors.email ? 'error' : ''}
                />
                {profileErrors.email && <span className="error-message">{profileErrors.email}</span>}
              </div>

              <div className="form-group">
                <textarea
                  name="address"
                  placeholder="Address"
                  value={profileFormData.address}
                  onChange={handleProfileChange}
                  rows="3"
                  className={profileErrors.address ? 'error' : ''}
                  style={{ resize: 'vertical', width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                />
                {profileErrors.address && <span className="error-message">{profileErrors.address}</span>}
              </div>

              <button type="submit" className="submit-btn">
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarnerDashboard;