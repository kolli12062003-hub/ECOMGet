import React, { useState, useEffect } from 'react';
import './ProfilePage.css';

const ProfilePage = ({ currentUser, navigateTo, onProfileUpdate }) => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    addresses: [{ id: 1, label: 'Home', line: '' }]
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile data from server
    const loadProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/profile?email=${currentUser.details.email}&role=${currentUser.role}`);
        if (response.ok) {
          const data = await response.json();
          setProfile({
            name: data.user.fullname || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            gender: data.user.gender || '',
            dateOfBirth: data.user.dateOfBirth || '',
            addresses: data.user.addresses || [{ id: 1, label: 'Home', line: '' }]
          });
        } else {
          // Fallback to currentUser if API fails
          setProfile({
            name: currentUser.details.name || '',
            email: currentUser.details.email || '',
            phone: currentUser.details.phone || '',
            gender: currentUser.details.gender || '',
            dateOfBirth: currentUser.details.dateOfBirth || '',
            addresses: currentUser.details.addresses || [{ id: 1, label: 'Home', line: '' }]
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        // Fallback to currentUser
        setProfile({
          name: currentUser.details.name || '',
          email: currentUser.details.email || '',
          phone: currentUser.details.phone || '',
          gender: currentUser.details.gender || '',
          dateOfBirth: currentUser.details.dateOfBirth || '',
          addresses: currentUser.details.addresses || [{ id: 1, label: 'Home', line: '' }]
        });
      }
    };

    if (currentUser.details) {
      loadProfile();
    }
  }, [currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressChange = (index, value) => {
    const newAddresses = [...profile.addresses];
    if (typeof value === 'string') {
      newAddresses[index] = { ...newAddresses[index], line: value };
    } else {
      newAddresses[index] = value;
    }
    setProfile(prev => ({
      ...prev,
      addresses: newAddresses
    }));
  };

  const addAddress = () => {
    const newId = Math.max(...profile.addresses.map(a => a.id || 0), 0) + 1;
    setProfile(prev => ({
      ...prev,
      addresses: [...prev.addresses, { id: newId, label: 'New Address', line: '' }]
    }));
  };

  const removeAddress = (index) => {
    if (profile.addresses.length > 1) {
      const newAddresses = profile.addresses.filter((_, i) => i !== index);
      setProfile(prev => ({
        ...prev,
        addresses: newAddresses
      }));
    }
  };

  const handleSave = async () => {
    try {
      console.log('Sending profile update request:', {
        email: currentUser.details.email,
        role: currentUser.role,
        profile
      });

      // Save to server
      const response = await fetch('http://localhost:5000/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: currentUser.details.email,
          role: currentUser.role,
          profile
        })
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
        // Update local profile state with the returned data
        setProfile({
          name: responseData.user.fullname || '',
          email: responseData.user.email || '',
          phone: responseData.user.phone || '',
          gender: responseData.user.gender || '',
          dateOfBirth: responseData.user.dateOfBirth || '',
          addresses: responseData.user.addresses || [{ id: 1, label: 'Home', line: '' }]
        });
        // Update the parent App component's currentUser state
        onProfileUpdate({
          name: responseData.user.fullname,
          email: responseData.user.email,
          phone: responseData.user.phone,
          gender: responseData.user.gender,
          dateOfBirth: responseData.user.dateOfBirth,
          addresses: responseData.user.addresses
        });
      } else {
        alert(`Failed to update profile: ${responseData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Error updating profile: ${error.message}`);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>My Profile</h1>

        <div className="profile-section">
          <div className="profile-field">
            <label>Name:</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
            ) : (
              <span>{profile.name || 'Not provided'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Email:</label>
            <span>{profile.email}</span>
          </div>

          <div className="profile-field">
            <label>Phone Number:</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                placeholder="Enter your phone number"
              />
            ) : (
              <span>{profile.phone || 'Not provided'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Gender:</label>
            {isEditing ? (
              <select
                name="gender"
                value={profile.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            ) : (
              <span>{profile.gender || 'Not provided'}</span>
            )}
          </div>

          <div className="profile-field">
            <label>Date of Birth:</label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={profile.dateOfBirth}
                onChange={handleInputChange}
              />
            ) : (
              <span>{profile.dateOfBirth || 'Not provided'}</span>
            )}
          </div>

          <div className="profile-field addresses">
            <label>Addresses:</label>
            {profile.addresses.map((address, index) => (
              <div key={index} className="address-item">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={typeof address === 'string' ? address : address.line || ''}
                      onChange={(e) => handleAddressChange(index, e.target.value)}
                      placeholder="Enter address"
                    />
                    {profile.addresses.length > 1 && (
                      <button
                        type="button"
                        className="remove-address"
                        onClick={() => removeAddress(index)}
                      >
                        Remove
                      </button>
                    )}
                  </>
                ) : (
                  <span>{typeof address === 'string' ? address : address.line || 'Not provided'}</span>
                )}
              </div>
            ))}
            {isEditing && (
              <button
                type="button"
                className="add-address"
                onClick={addAddress}
              >
                + Add Address
              </button>
            )}
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
          <button className="back-btn" onClick={() => navigateTo('home')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
