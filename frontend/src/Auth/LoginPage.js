// LoginPage.js
import React, { useState } from 'react';

const fontLink = document.createElement('link');
fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
fontLink.rel = 'stylesheet';
if (!document.querySelector('link[href*="Poppins"]')) document.head.appendChild(fontLink);

// API base (adjust if server runs on different host/port)
const API_URL = 'http://localhost:5000/api/auth';

const LoginPage = ({ onLoginSuccess = () => {}, onSellerRegister = () => {}, onAdminRegister = () => {} }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [error, setError] = useState('');
    const [activeRole, setActiveRole] = useState('Customer');
    const [loading, setLoading] = useState(false);
    const [forgotPasswordModal, setForgotPasswordModal] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [sellerFormData, setSellerFormData] = useState({
        address: '',
        lat: null,
        lon: null
    });
    const [fetchingLocation, setFetchingLocation] = useState(false);

    // Login handler - sends role capitalized, handles admin redirect
    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const email = e.target.elements['login-email'].value;
        const password = e.target.elements['login-password'].value;

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    role: activeRole.charAt(0).toUpperCase() + activeRole.slice(1)
                })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                onLoginSuccess(data.user.role, data.user);
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // Registration handler - sends role capitalized; seller extra fields
    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const fullname = e.target.elements.fullname.value;
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const confirmPassword = e.target.elements.confirmPassword.value;

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setLoading(false);
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            setLoading(false);
            return;
        }

        let requestBody = {
            fullname,
            email,
            password,
            role: activeRole.charAt(0).toUpperCase() + activeRole.slice(1),
            status: 'active'
        };

        if (activeRole === 'Seller') {
            const businessName = e.target.elements.businessName.value.trim();
            const businessType = e.target.elements.businessType.value;
            if (!businessName) {
                setError('Business name is required for sellers.');
                setLoading(false);
                return;
            }
            if (!businessType) {
                setError('Please select a business type.');
                setLoading(false);
                return;
            }
            requestBody.businessName = businessName;
            requestBody.businessType = businessType;
            requestBody.address = sellerFormData.address;
            requestBody.lat = sellerFormData.lat;
            requestBody.lon = sellerFormData.lon;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            const data = await response.json();
            if (response.ok) {
                const newUser = { fullname, email, role: activeRole, ...(activeRole === 'Seller' ? { businessName: requestBody.businessName, businessType: requestBody.businessType } : {}) };
                if (activeRole === 'Seller') { onSellerRegister(newUser); }
                else if (activeRole === 'Admin') { onAdminRegister(newUser); }

                alert('Registration successful! Please log in.');
                setIsLoginView(true);
                e.target.reset();
                if (activeRole === 'Seller') {
                    setSellerFormData({
                        address: '',
                        lat: null,
                        lon: null
                    });
                }
            } else {
                setError(data.message || 'Registration failed. Please try again.');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    // ✅ IMPROVED: Handle address geocode with automatic address fetching
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
                            
                            setSellerFormData(prev => ({
                                ...prev,
                                lat: latitude,
                                lon: longitude,
                                address: formattedAddress
                            }));
                            
                            alert(`✅ Location captured successfully!\n\nAddress: ${formattedAddress}\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                        } else {
                            // If reverse geocoding fails, still save coordinates
                            setSellerFormData(prev => ({
                                ...prev,
                                lat: latitude,
                                lon: longitude
                            }));
                            alert(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
                        }
                    } catch (error) {
                        console.error('Error fetching address:', error);
                        // Still save coordinates even if address fetch fails
                        setSellerFormData(prev => ({
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
                    
                    let errorMessage = 'Error getting location. ';
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

    // Forgot password - sends role lowercased (server accepts case-insensitively)
    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setResetMessage('');
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: forgotEmail,
                    role: activeRole.toLowerCase()
                })
            });
            const data = await response.json();
            if (response.ok) {
                setResetMessage('Password reset link has been sent to your email!');
                setTimeout(() => {
                    setForgotPasswordModal(false);
                    setForgotEmail('');
                    setResetMessage('');
                }, 3000);
            } else {
                setResetMessage(data.message || 'Error sending reset link.');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
            setResetMessage('Unable to connect to server. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.loginPage}>
            <div style={styles.loginContainer}>
                <div style={styles.loginHeader}>
                    <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="ShopNest Logo" style={styles.logo} />
                    <h1 style={styles.welcomeTitle}>Welcome to ShopNest</h1>
                </div>

                <div style={styles.roleSelector}>
                    <button style={{ ...styles.roleBtn, ...(activeRole === 'Customer' ? styles.roleBtnActive : {}) }} onClick={() => setActiveRole('Customer')} disabled={loading}>Customer</button>
                    <button style={{ ...styles.roleBtn, ...(activeRole === 'Seller' ? styles.roleBtnActive : {}) }} onClick={() => setActiveRole('Seller')} disabled={loading}>Seller</button>
                    <button style={{ ...styles.roleBtn, ...(activeRole === 'Earner' ? styles.roleBtnActive : {}) }} onClick={() => setActiveRole('Earner')} disabled={loading}>Earner</button>
                    <button style={{ ...styles.roleBtn, ...(activeRole === 'Admin' ? styles.roleBtnActive : {}) }} onClick={() => setActiveRole('Admin')} disabled={loading}>Admin</button>
                </div>

                {isLoginView ? (
                    <form style={styles.loginForm} onSubmit={handleLogin}>
                        <h2 style={styles.formTitle}>{activeRole} Login</h2>
                        {error && <p style={styles.errorMessage}>{error}</p>}

                        <div style={styles.inputGroup}>
                            <label htmlFor="login-email" style={styles.label}>Email</label>
                            <input id="login-email" type="email" placeholder="Email" style={styles.input} required disabled={loading} />
                        </div>

                        <div style={styles.inputGroup}>
                            <label htmlFor="login-password" style={styles.label}>Password</label>
                            <input id="login-password" type="password" placeholder="Password" style={styles.input} required disabled={loading} />
                        </div>

                        <div style={styles.forgotPasswordLink}>
                            <span onClick={() => !loading && setForgotPasswordModal(true)} style={{ ...styles.toggleLink, ...(loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}>Forgot Password?</span>
                        </div>

                        <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>

                        <p style={styles.toggleView}>
                            Don't have an account? {' '}
                            <span onClick={() => !loading && setIsLoginView(false)} style={{ ...styles.toggleLink, ...(loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}>Register</span>
                        </p>
                    </form>
                ) : (
                    <form style={styles.loginForm} onSubmit={handleRegister}>
                        <h2 style={styles.formTitle}>{activeRole} Registration</h2>
                        {error && <p style={styles.errorMessage}>{error}</p>}

                        <div style={styles.inputGroup}>
                            <input name="fullname" type="text" placeholder="Full Name" style={styles.input} required disabled={loading} />
                        </div>

                        {activeRole === 'Seller' && (
                            <>
                                <div style={styles.inputGroup}>
                                    <input name="businessName" type="text" placeholder="Business Name" style={styles.input} required disabled={loading} />
                                </div>
                                <div style={styles.inputGroup}>
                                    <select name="businessType" style={styles.input} required disabled={loading}>
                                        <option value="">Select Business Type</option>
                                        <option value="Food & Dining">Food & Dining</option>
                                        <option value="Medicines">Medicines</option>
                                        <option value="Automotive">Automotive</option>
                                        <option value="Services">Services</option>
                                        <option value="Jewellery">Jewellery</option>
                                        <option value="Clothing">Clothing</option>
                                        <option value="Beauty Products">Beauty Products</option>
                                        <option value="Footwear">Footwear</option>
                                        <option value="Groceries">Groceries</option>
                                        <option value="Fruits">Fruits</option>
                                        <option value="Books">Books</option>
                                        <option value="Pet Food">Pet Food</option>
                                        <option value="Musical Instruments">Musical Instruments</option>
                                        <option value="Home Furniture">Home Furniture</option>
                                        <option value="Bags">Bags</option>
                                        <option value="Kitchen Products">Kitchen Products</option>
                                        <option value="Sports & Fitness">Sports & Fitness</option>
                                        <option value="Home Decor">Home Decor</option>
                                        <option value="Watches">Watches</option>
                                        <option value="Organic Veggies & Fruits">Organic Veggies & Fruits</option>
                                    </select>
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                        📍 Shop Location (Auto-detected)
                                    </label>
                                    <textarea
                                        name="address"
                                        placeholder="Your shop address will be automatically detected..."
                                        value={sellerFormData.address}
                                        onChange={(e) => setSellerFormData(prev => ({ ...prev, address: e.target.value }))}
                                        rows="2"
                                        style={{ ...styles.input, resize: 'vertical' }}
                                        disabled={loading}
                                    />
                                    <small style={{ display: 'block', marginTop: '5px', color: '#666', fontSize: '12px' }}>
                                        Click the button below to auto-detect your location and address
                                    </small>
                                </div>

                                <div style={styles.inputGroup}>
                                    <button
                                        type="button"
                                        onClick={handleAddressGeocode}
                                        style={{
                                            width: '100%',
                                            padding: '14px',
                                            backgroundColor: fetchingLocation ? '#ccc' : '#4CAF50',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '10px',
                                            cursor: (loading || fetchingLocation) ? 'not-allowed' : 'pointer',
                                            fontSize: '15px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                            transition: 'all 0.3s ease'
                                        }}
                                        disabled={loading || fetchingLocation}
                                    >
                                        {fetchingLocation ? (
                                            <>🔄 Detecting Location...</>
                                        ) : (
                                            <>📍 Get My Location & Address</>
                                        )}
                                    </button>
                                    {sellerFormData.lat && sellerFormData.lon && (
                                        <small style={{ display: 'block', marginTop: '8px', color: '#4CAF50', fontSize: '12px', fontWeight: '500' }}>
                                            ✅ Location captured: {sellerFormData.lat.toFixed(6)}, {sellerFormData.lon.toFixed(6)}
                                        </small>
                                    )}
                                </div>
                            </>
                        )}

                        <div style={styles.inputGroup}>
                            <input name="email" type="email" placeholder="Email" style={styles.input} required disabled={loading} />
                        </div>

                        <div style={styles.inputGroup}>
                            <input name="password" type="password" placeholder="Password" style={styles.input} required disabled={loading} />
                        </div>

                        <div style={styles.inputGroup}>
                            <input name="confirmPassword" type="password" placeholder="Confirm Password" style={styles.input} required disabled={loading} />
                        </div>

                        <button type="submit" style={styles.submitBtn} disabled={loading || fetchingLocation}>
                            {loading ? 'Registering...' : fetchingLocation ? 'Wait for location...' : 'Register'}
                        </button>

                        <p style={styles.toggleView}>
                            Already have an account? {' '}
                            <span onClick={() => !loading && setIsLoginView(true)} style={{ ...styles.toggleLink, ...(loading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }}>Login</span>
                        </p>
                    </form>
                )}

                {/* Forgot password modal */}
                {forgotPasswordModal && (
                    <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setForgotPasswordModal(false)}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalHeader}>
                                <h3 style={styles.modalTitle}>Forgot Password</h3>
                                <button onClick={() => setForgotPasswordModal(false)} style={styles.closeBtn} disabled={loading}>✕</button>
                            </div>

                            <form onSubmit={handleForgotPassword}>
                                <p style={styles.modalDescription}>Enter your email address and we'll send you a link to reset your password.</p>
                                {resetMessage && <p style={resetMessage.includes('sent') ? styles.successMessage : styles.errorMessage}>{resetMessage}</p>}
                                <div style={styles.inputGroup}>
                                    <input type="email" placeholder="Enter your email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} style={styles.input} required disabled={loading} />
                                </div>

                                <div style={styles.modalActions}>
                                    <button type="button" onClick={() => setForgotPasswordModal(false)} style={styles.cancelBtn} disabled={loading}>Cancel</button>
                                    <button type="submit" style={styles.submitBtn} disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

const styles = {
    loginPage: { minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fb 0%, #e3e8f0 100%)', padding: '20px', fontFamily: "'Poppins', sans-serif" },
    loginContainer: { background: 'white', borderRadius: '20px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)', padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center' },
    loginHeader: { marginBottom: '30px' },
    logo: { width: '80px', height: '80px', marginBottom: '15px' },
    welcomeTitle: { fontSize: '28px', color: '#333', margin: '0', fontWeight: '600' },
    roleSelector: { display: 'flex', gap: '0', marginBottom: '30px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e0e0e0' },
    roleBtn: { flex: 1, padding: '12px 20px', border: 'none', background: '#f5f5f5', color: '#666', fontSize: '15px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', borderRight: '1px solid #e0e0e0' },
    roleBtnActive: { background: '#4a6cfa', color: 'white', borderRight: 'none' },
    loginForm: { textAlign: 'left' },
    formTitle: { fontSize: '24px', color: '#333', marginBottom: '20px', textAlign: 'center', fontWeight: '600' },
    errorMessage: { background: '#fee', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center', border: '1px solid #fcc' },
    successMessage: { background: '#d4edda', color: '#155724', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px', textAlign: 'center', border: '1px solid #c3e6cb' },
    inputGroup: { marginBottom: '18px' },
    label: { display: 'block', marginBottom: '8px', color: '#555', fontSize: '14px', fontWeight: '500' },
    input: { width: '100%', padding: '14px 16px', border: '1px solid #e0e0e0', borderRadius: '10px', fontSize: '15px', transition: 'all 0.3s ease', boxSizing: 'border-box', outline: 'none' },
    forgotPasswordLink: { textAlign: 'right', marginBottom: '10px' },
    submitBtn: { width: '100%', padding: '14px', background: '#4a6cfa', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.3s ease', marginTop: '10px', boxShadow: '0 4px 12px rgba(74, 108, 250, 0.3)' },
    toggleView: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
    toggleLink: { color: '#4a6cfa', cursor: 'pointer', fontWeight: '600', textDecoration: 'none' },
    modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modalContent: { background: 'white', borderRadius: '16px', padding: '30px', maxWidth: '450px', width: '90%', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)' },
    modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    modalTitle: { fontSize: '22px', fontWeight: '600', color: '#333', margin: 0 },
    closeBtn: { background: 'none', border: 'none', fontSize: '24px', color: '#999', cursor: 'pointer', padding: '0' },
    modalDescription: { fontSize: '14px', color: '#666', marginBottom: '20px', lineHeight: '1.5' },
    modalActions: { display: 'flex', gap: '10px', marginTop: '20px' },
    cancelBtn: { flex: 1, padding: '12px', background: '#f5f5f5', color: '#666', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }
};

export default LoginPage;