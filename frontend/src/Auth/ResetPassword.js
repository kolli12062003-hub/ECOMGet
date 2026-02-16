import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/auth';

const ResetPassword = ({ navigateTo }) => {
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);

        if (newPassword !== confirmPassword) {
            setMessage('Passwords do not match');
            setMessageType('error');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setMessageType('error');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    newPassword,
                    confirmPassword
                })
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Password reset successful!');
                setMessageType('success');
                setTimeout(() => {
                    navigateTo('login');
                }, 2000);
            } else {
                setMessage(data.message || 'Failed to reset password');
                setMessageType('error');
            }
        } catch (error) {
            console.error('Reset password error:', error);
            setMessage('An error occurred. Please try again.');
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <img 
                        src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" 
                        alt="ShopNest Logo" 
                        style={styles.logo}
                    />
                    <h2 style={styles.title}>Reset Password</h2>
                    <p style={styles.subtitle}>Enter your new password</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    {message && (
                        <div style={messageType === 'error' ? styles.errorMessage : styles.successMessage}>
                            {message}
                        </div>
                    )}

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            style={styles.input}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            style={styles.input}
                            required
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" style={styles.submitBtn} disabled={loading}>
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>

                    <div style={styles.footer}>
                        <span 
                            onClick={() => navigateTo('login')}
                            style={styles.link}
                        >
                            Back to Login
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px',
        fontFamily: 'Arial, sans-serif'
    },
    card: {
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)',
        padding: '40px',
        width: '100%',
        maxWidth: '400px'
    },
    header: {
        textAlign: 'center',
        marginBottom: '30px'
    },
    logo: {
        width: '80px',
        height: '80px',
        marginBottom: '15px'
    },
    title: {
        color: '#333',
        fontSize: '24px',
        marginBottom: '10px',
        fontWeight: '600'
    },
    subtitle: {
        color: '#666',
        fontSize: '14px',
        margin: 0
    },
    form: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputGroup: {
        marginBottom: '20px'
    },
    label: {
        display: 'block',
        marginBottom: '8px',
        color: '#555',
        fontSize: '14px',
        fontWeight: '500'
    },
    input: {
        width: '100%',
        padding: '15px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        fontSize: '16px',
        boxSizing: 'border-box',
        transition: 'border-color 0.3s',
        outline: 'none'
    },
    submitBtn: {
        width: '100%',
        padding: '15px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'transform 0.2s'
    },
    errorMessage: {
        background: '#f8d7da',
        color: '#721c24',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #f5c6cb',
        fontSize: '14px'
    },
    successMessage: {
        background: '#d4edda',
        color: '#155724',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '20px',
        textAlign: 'center',
        border: '1px solid #c3e6cb',
        fontSize: '14px'
    },
    footer: {
        textAlign: 'center',
        marginTop: '20px'
    },
    link: {
        color: '#667eea',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        textDecoration: 'none'
    }
};

export default ResetPassword;