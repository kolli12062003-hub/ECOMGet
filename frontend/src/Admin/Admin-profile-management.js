import React, { useState, useEffect } from 'react';

const AdminProfileManagement = ({ navigateTo }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [state, setState] = useState({
    selectedUserId: null,
    currentTab: 'profile',
    searchQuery: '',
    roleFilter: '',
    statusFilter: ''
  });

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('${process.env.REACT_APP_API_URL}/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const usersData = await response.json();
          
          // Fetch branches for sellers
          const usersWithBranches = await Promise.all(usersData.map(async (user) => {
            let branches = [];
            if (user.role === 'Seller') {
              try {
                const branchResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches?email=${user.email}`);
                if (branchResponse.ok) {
                  branches = await branchResponse.json();
                }
              } catch (error) {
                console.error('Error fetching branches for seller:', user.email, error);
              }
            }
            
            return {
              id: user._id,
              name: user.fullname,
              email: user.email,
              phone: user.phone || '',
              role: user.role,
              status: user.status,
              registered: user.createdAt ? new Date(user.createdAt).toISOString().slice(0, 10) : '',
              lastLogin: user.lastActive ? new Date(user.lastActive).toISOString() : '',
              addresses: user.addresses || [],
              orders: user.orders || [],
              businessName: user.businessName,
              businessType: user.businessType,
              address: user.address,
              lat: user.lat,
              lon: user.lon,
              gender: user.gender,
              dateOfBirth: user.dateOfBirth,
              branches: branches
            };
          }));
          
          setUsers(usersWithBranches);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [refreshTrigger]);

  // Fetch branches when a seller is selected
  useEffect(() => {
    if (selectedUser && selectedUser.role === 'Seller' && !selectedUser.branches) {
      fetchBranches();
    }
  }, [state.selectedUserId]);

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [editingAddr, setEditingAddr] = useState(null);

  const [newUserData, setNewUserData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const [addrFormData, setAddrFormData] = useState({
    label: '',
    line: ''
  });

  const [branchModalOpen, setBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [branchFormData, setBranchFormData] = useState({
    name: '',
    address: '',
    lat: null,
    lon: null,
    isMain: false
  });
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const selectedUser = users.find(u => u.id === state.selectedUserId);

  const filteredUsers = users.filter(user => {
    const matchesSearch = !state.searchQuery || 
      user.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
      user.phone.includes(state.searchQuery);
    const matchesRole = !state.roleFilter || user.role === state.roleFilter;
    const matchesStatus = !state.statusFilter || user.status === state.statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const openProfile = (userId) => {
    setState({ ...state, selectedUserId: userId, currentTab: 'profile' });
  };

  const updateProfile = (field, value) => {
    if (!selectedUser) return;
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, [field]: value } : u));
  };

  const saveProfile = async () => {
    try {
      const selectedUser = users.find(u => u.id === state.selectedUserId);
      if (!selectedUser) return;

      const token = localStorage.getItem('token');
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/admin/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: selectedUser.id,
          email: selectedUser.email,
          role: selectedUser.role,
          profile: {
            name: selectedUser.name,
            phone: selectedUser.phone,
            gender: selectedUser.gender,
            dateOfBirth: selectedUser.dateOfBirth,
            addresses: selectedUser.addresses
          }
        })
      });

      if (response.ok) {
        const responseData = await response.json();
        // Update the local users state with the response data
        setUsers(users.map(u => u.id === selectedUser.id ? {
          ...u,
          name: responseData.user.fullname,
          phone: responseData.user.phone,
          gender: responseData.user.gender,
          dateOfBirth: responseData.user.dateOfBirth,
          addresses: responseData.user.addresses
        } : u));
        setRefreshTrigger(prev => prev + 1); // Trigger refresh
        toast('Profile saved successfully');
      } else {
        const errorData = await response.json();
        toast(`Failed to save profile: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast('Error saving profile');
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const newId = Math.max(...users.map(u => u.id), 0) + 1;
    setUsers([
      ...users,
      {
        id: newId,
        ...newUserData,
        role: 'Customer',
        status: 'active',
        registered: new Date().toISOString().slice(0, 10),
        lastLogin: new Date().toISOString(),
        addresses: [],
        orders: []
      }
    ]);
    setUserModalOpen(false);
    setNewUserData({ name: '', email: '', phone: '' });
    toast('User added');
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    if (editingAddr) {
      setUsers(users.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            addresses: u.addresses.map(a =>
              a.id === editingAddr.id ? { ...a, ...addrFormData } : a
            )
          };
        }
        return u;
      }));
      toast('Address updated');
    } else {
      const newId = Math.max(0, ...users.flatMap(u => u.addresses.map(a => a.id))) + 1;
      setUsers(users.map(u => {
        if (u.id === selectedUser.id) {
          return {
            ...u,
            addresses: [...u.addresses, { id: newId, ...addrFormData }]
          };
        }
        return u;
      }));
      toast('Address added');
    }

    setAddrModalOpen(false);
    setAddrFormData({ label: '', line: '' });
    setEditingAddr(null);
  };

  const deleteAddress = (addrId) => {
    if (!selectedUser) return;
    setUsers(users.map(u => {
      if (u.id === selectedUser.id) {
        return {
          ...u,
          addresses: u.addresses.filter(a => a.id !== addrId)
        };
      }
      return u;
    }));
    toast('Address deleted');
  };

  const editAddress = (addr) => {
    setEditingAddr(addr);
    setAddrFormData({ label: addr.label, line: addr.line });
    setAddrModalOpen(true);
  };

  // Branch management functions
  const fetchBranches = async () => {
    if (!selectedUser || selectedUser.role !== 'Seller') return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches?email=${selectedUser.email}`);
      if (response.ok) {
        const branches = await response.json();
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, branches } : u));
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const handleBranchSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || selectedUser.role !== 'Seller') return;

    try {
      const method = editingBranch ? 'PUT' : 'POST';
      const url = editingBranch
        ? `${process.env.REACT_APP_API_URL}/api/seller/branches/${editingBranch._id}`
        : '${process.env.REACT_APP_API_URL}/api/seller/branches';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: selectedUser.email,
          name: branchFormData.name,
          address: branchFormData.address,
          lat: parseFloat(branchFormData.lat),
          lon: parseFloat(branchFormData.lon),
          isMain: branchFormData.isMain
        }),
      });

      if (response.ok) {
        toast(editingBranch ? 'Branch updated successfully' : 'Branch added successfully');
        setBranchModalOpen(false);
        setBranchFormData({ name: '', address: '', lat: null, lon: null, isMain: false });
        setEditingBranch(null);
        fetchBranches();
      } else {
        toast('Failed to save branch');
      }
    } catch (error) {
      console.error('Error saving branch:', error);
      toast('Error saving branch');
    }
  };

  const deleteBranch = async (branchId) => {
    if (!selectedUser || selectedUser.role !== 'Seller') return;
    if (!window.confirm('Are you sure you want to delete this branch?')) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches/${branchId}?email=${selectedUser.email}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast('Branch deleted successfully');
        fetchBranches();
      } else {
        toast('Failed to delete branch');
      }
    } catch (error) {
      console.error('Error deleting branch:', error);
      toast('Error deleting branch');
    }
  };

  const editBranch = (branch) => {
    setEditingBranch(branch);
    setBranchFormData({
      name: branch.name,
      address: branch.address,
      lat: branch.lat,
      lon: branch.lon,
      isMain: branch.isMain
    });
    setBranchModalOpen(true);
  };

  const handleBranchAddressGeocode = () => {
    if (navigator.geolocation) {
      setFetchingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
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

              const addressParts = [];
              if (data.address.house_number) addressParts.push(data.address.house_number);
              if (data.address.road) addressParts.push(data.address.road);
              if (data.address.suburb) addressParts.push(data.address.suburb);
              if (data.address.city) addressParts.push(data.address.city);
              if (data.address.state) addressParts.push(data.address.state);
              if (data.address.postcode) addressParts.push(data.address.postcode);

              const formattedAddress = addressParts.join(', ') || data.display_name;

              setBranchFormData(prev => ({
                ...prev,
                lat: latitude,
                lon: longitude,
                address: formattedAddress
              }));

              toast(`✅ Branch location captured successfully!\n\nAddress: ${formattedAddress}\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
            } else {
              setBranchFormData(prev => ({
                ...prev,
                lat: latitude,
                lon: longitude
              }));
              toast(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
            }
          } catch (error) {
            console.error('Error fetching address:', error);
            setBranchFormData(prev => ({
              ...prev,
              lat: latitude,
              lon: longitude
            }));
            toast(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
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
              errorMessage += 'An unknown error occurred.';
              break;
          }
          toast(errorMessage);
        }
      );
    } else {
      toast('Geolocation is not supported by this browser.');
    }
  };

  const blockUnblockUser = () => {
    if (!selectedUser) return;
    const newStatus = selectedUser.status === 'blocked' ? 'active' : 'blocked';
    setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
    toast(newStatus === 'blocked' ? 'User blocked' : 'User unblocked');
  };

  const exportCSV = () => {
    const csv = ['id,name,email,phone,role,status'].concat(
      users.map(u => `${u.id},"${u.name}","${u.email}","${u.phone}",${u.role},${u.status}`)
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast('Exported users.csv');
  };

  const toast = (msg) => {
    alert(msg);
  };

  const styles = {
    container: {
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(180deg, #0b1020, #0d1226)',
      color: '#e6eef8',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 24px rgba(2,6,23,0.45)',
      position: 'sticky',
      top: 0,
      padding: '12px',
      zIndex: 30
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '16px'
    },
    card: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '12px'
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '10px',
      padding: '8px 12px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer'
    },
    btnPrimary: {
      background: '#6366f1',
      color: 'white'
    },
    btnGhost: {
      background: 'rgba(255,255,255,0.04)',
      color: '#e6eef8'
    },
    btnDanger: {
      background: '#ef4444',
      color: 'white'
    },
    input: {
      background: 'rgba(30, 41, 59, 0.6)',
      padding: '8px 12px',
      borderRadius: '12px',
      border: 'none',
      color: '#e5e7eb',
      width: '100%'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(2,6,23,0.6)',
      zIndex: 50
    },
    modalContent: {
      background: '#0f162e',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '480px',
      width: '100%'
    },
    avatar: {
      height: '64px',
      width: '64px',
      borderRadius: '12px',
      display: 'grid',
      placeItems: 'center',
      background: 'rgba(99, 102, 241, 0.12)',
      fontWeight: '700',
      color: '#c7d2fe',
      fontSize: '1.5rem'
    },
    tab: {
      padding: '8px 16px',
      borderRadius: '10px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      color: '#e6eef8',
      fontWeight: '500'
    },
    tabActive: {
      background: 'rgba(255,255,255,0.03)'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button
          onClick={() => navigateTo('admin-dashboard')}
          style={{ ...styles.btn, ...styles.btnPrimary, marginRight: '20px' }}
        >
          ← Back to Admin Home
        </button>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontWeight: 'bold' }}>User Profiles</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Search, view and manage user accounts and security</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => navigateTo('admin-users')} style={{ ...styles.btn, ...styles.btnGhost }}>Users</button>
            <button onClick={() => navigateTo('admin-orders')} style={{ ...styles.btn, ...styles.btnGhost }}>Orders</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={{ ...styles.card, marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              placeholder="Search by name, email, phone or id"
              value={state.searchQuery}
              onChange={(e) => setState({ ...state, searchQuery: e.target.value })}
              style={{ ...styles.input, width: '320px' }}
            />
            <select
              value={state.roleFilter}
              onChange={(e) => setState({ ...state, roleFilter: e.target.value })}
              style={styles.input}
            >
              <option value="">All Roles</option>
              <option>Customer</option>
              <option>Seller</option>
              <option>Earner</option>
              <option>Admin</option>
            </select>
            <select
              value={state.statusFilter}
              onChange={(e) => setState({ ...state, statusFilter: e.target.value })}
              style={styles.input}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              <button onClick={() => setUserModalOpen(true)} style={{ ...styles.btn, ...styles.btnPrimary }}>
                + Add User
              </button>
              <button onClick={exportCSV} style={{ ...styles.btn, ...styles.btnGhost }}>
                Export CSV
              </button>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          <div style={styles.card}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '8px' }}>Users</h3>
            <div style={{ overflowY: 'auto', maxHeight: '520px' }}>
              {loading ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                  Loading users...
                </div>
              ) : error ? (
                <div style={{ textAlign: 'center', padding: '48px', color: '#ef4444' }}>
                  Error: {error}
                </div>
              ) : (
                <ul style={{ display: 'grid', gap: '8px' }}>
                  {filteredUsers.map(user => (
                    <li key={user.id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontWeight: '600' }}>
                            {user.name} <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({user.role})</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
                        </div>
                        <button
                          onClick={() => openProfile(user.id)}
                          style={{ ...styles.btn, ...styles.btnGhost, padding: '4px 8px', fontSize: '0.75rem' }}
                        >
                          Open
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={styles.card}>
            {selectedUser ? (
              <>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={styles.avatar}>
                    {selectedUser.name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{selectedUser.name}</div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{selectedUser.email}</div>
                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                      <button style={{ ...styles.btn, ...styles.btnGhost, fontSize: '0.875rem' }} onClick={() => toast('Impersonating user (demo)')}>
                        Impersonate
                      </button>
                      <button style={{ ...styles.btn, ...styles.btnDanger, fontSize: '0.875rem' }} onClick={blockUnblockUser}>
                        {selectedUser.status === 'blocked' ? 'Unblock' : 'Block'}
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
                    <button
                      onClick={() => setState({ ...state, currentTab: 'profile' })}
                      style={{ ...styles.tab, ...(state.currentTab === 'profile' ? styles.tabActive : {}) }}
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => setState({ ...state, currentTab: 'addresses' })}
                      style={{ ...styles.tab, ...(state.currentTab === 'addresses' ? styles.tabActive : {}) }}
                    >
                      Addresses
                    </button>
                    {selectedUser.role === 'Seller' && (
                      <button
                        onClick={() => setState({ ...state, currentTab: 'branches' })}
                        style={{ ...styles.tab, ...(state.currentTab === 'branches' ? styles.tabActive : {}) }}
                      >
                        Branches
                      </button>
                    )}
                    <button
                      onClick={() => setState({ ...state, currentTab: 'orders' })}
                      style={{ ...styles.tab, ...(state.currentTab === 'orders' ? styles.tabActive : {}) }}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setState({ ...state, currentTab: 'security' })}
                      style={{ ...styles.tab, ...(state.currentTab === 'security' ? styles.tabActive : {}) }}
                    >
                      Security
                    </button>
                  </div>

                  {state.currentTab === 'profile' && (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <label style={{ display: 'grid', gap: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Full Name</span>
                          <input
                            value={selectedUser.name}
                            onChange={(e) => updateProfile('name', e.target.value)}
                            style={styles.input}
                          />
                        </label>
                        <label style={{ display: 'grid', gap: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email</span>
                          <input
                            value={selectedUser.email}
                            onChange={(e) => updateProfile('email', e.target.value)}
                            style={styles.input}
                          />
                        </label>
                        <label style={{ display: 'grid', gap: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone</span>
                          <input
                            value={selectedUser.phone}
                            onChange={(e) => updateProfile('phone', e.target.value)}
                            style={styles.input}
                          />
                        </label>
                        <label style={{ display: 'grid', gap: '4px' }}>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Role</span>
                          <select
                            value={selectedUser.role}
                            onChange={(e) => updateProfile('role', e.target.value)}
                            style={styles.input}
                          >
                            <option>Customer</option>
                            <option>Seller</option>
                            <option>Earner</option>
                            <option>Admin</option>
                          </select>
                        </label>
                        {selectedUser.role === 'Seller' && (
                          <>
                            <label style={{ display: 'grid', gap: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Business Name</span>
                              <input
                                value={selectedUser.businessName || ''}
                                onChange={(e) => updateProfile('businessName', e.target.value)}
                                style={styles.input}
                              />
                            </label>
                            <label style={{ display: 'grid', gap: '4px' }}>
                              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Business Type</span>
                              <input
                                value={selectedUser.businessType || ''}
                                onChange={(e) => updateProfile('businessType', e.target.value)}
                                style={styles.input}
                              />
                            </label>

                          </>
                        )}

                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={saveProfile} style={{ ...styles.btn, ...styles.btnPrimary }}>
                          Save Profile
                        </button>
                      </div>
                    </div>
                  )}

                  {state.currentTab === 'addresses' && (
                    <div>
                      {selectedUser.role === 'Earner' || selectedUser.role === 'Seller' ? (
                        <div style={{ display: 'grid', gap: '12px' }}>
                          <label style={{ display: 'grid', gap: '4px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Address</span>
                            <input
                              value={selectedUser.role === 'Seller' ? (selectedUser.address || '') : (selectedUser.addresses && selectedUser.addresses.length > 0 ? selectedUser.addresses[0] : '')}
                              onChange={(e) => {
                                if (selectedUser.role === 'Seller') {
                                  updateProfile('address', e.target.value);
                                } else {
                                  const newAddresses = [...(selectedUser.addresses || [])];
                                  newAddresses[0] = e.target.value;
                                  updateProfile('addresses', newAddresses);
                                }
                              }}
                              style={styles.input}
                              placeholder="Enter address"
                            />
                          </label>
                          {selectedUser.role === 'Seller' && (
                            <>
                              <label style={{ display: 'grid', gap: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Latitude</span>
                                <input
                                  type="number"
                                  step="any"
                                  value={selectedUser.lat || ''}
                                  onChange={(e) => updateProfile('lat', parseFloat(e.target.value) || null)}
                                  style={styles.input}
                                  placeholder="17.3850"
                                />
                              </label>
                              <label style={{ display: 'grid', gap: '4px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Longitude</span>
                                <input
                                  type="number"
                                  step="any"
                                  value={selectedUser.lon || ''}
                                  onChange={(e) => updateProfile('lon', parseFloat(e.target.value) || null)}
                                  style={styles.input}
                                  placeholder="78.4867"
                                />
                              </label>
                            </>
                          )}
                          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button onClick={saveProfile} style={{ ...styles.btn, ...styles.btnPrimary }}>
                              Save Address
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                            {selectedUser.addresses.map(addr => (
                              <div key={addr.id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                                <div style={{ fontWeight: '600' }}>{addr.label}</div>
                                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{addr.line}</div>
                                <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                                  <button onClick={() => editAddress(addr)} style={{ ...styles.btn, ...styles.btnGhost, padding: '4px 8px', fontSize: '0.75rem' }}>
                                    Edit
                                  </button>
                                  <button onClick={() => deleteAddress(addr.id)} style={{ ...styles.btn, ...styles.btnDanger, padding: '4px 8px', fontSize: '0.75rem' }}>
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <button onClick={() => { setEditingAddr(null); setAddrFormData({ label: '', line: '' }); setAddrModalOpen(true); }} style={{ ...styles.btn, ...styles.btnGhost }}>
                            Add Address
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {state.currentTab === 'branches' && selectedUser.role === 'Seller' && (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, color: '#fff' }}>Seller Branches</h3>
                        <button
                          onClick={() => {
                            setBranchFormData({ name: '', address: '', lat: null, lon: null, isMain: false });
                            setEditingBranch(null);
                            setBranchModalOpen(true);
                          }}
                          style={{ ...styles.btn, ...styles.btnPrimary }}
                        >
                          Add Branch
                        </button>
                      </div>

                      <div style={{ display: 'grid', gap: '12px' }}>
                        {selectedUser.branches && selectedUser.branches.length > 0 ? (
                          selectedUser.branches.map((branch) => (
                            <div key={branch._id} style={{ ...styles.card, padding: '16px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                    <h4 style={{ margin: 0, color: '#fff' }}>{branch.name}</h4>
                                    {branch.isMain && (
                                      <span style={{
                                        backgroundColor: '#4CAF50',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                        fontWeight: 'bold'
                                      }}>
                                        MAIN
                                      </span>
                                    )}
                                  </div>
                                  <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '4px' }}>
                                    📍 {branch.address}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                    Coordinates: {branch.lat?.toFixed(6)}, {branch.lon?.toFixed(6)}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    onClick={() => editBranch(branch)}
                                    style={{ ...styles.btn, ...styles.btnGhost, padding: '6px 12px' }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => deleteBranch(branch._id)}
                                    style={{ ...styles.btn, ...styles.btnDanger, padding: '6px 12px' }}
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                            No branches added yet. Click "Add Branch" to get started.
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {state.currentTab === 'orders' && (
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedUser.orders.length > 0 ? (
                        selectedUser.orders.map(order => (
                          <div key={order.id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                              <div style={{ fontWeight: '600' }}>{order.id}</div>
                              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{order.date}</div>
                            </div>
                            <div>₹ {order.total}</div>
                          </div>
                        ))
                      ) : (
                        <div style={{ color: '#94a3b8' }}>No orders</div>
                      )}
                    </div>
                  )}

                  {state.currentTab === 'security' && (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      <div><strong>Last Login:</strong> {new Date(selectedUser.lastLogin).toLocaleString()}</div>
                      <div><strong>Account Status:</strong> {selectedUser.status}</div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button onClick={() => toast('Password reset link sent (demo)')} style={{ ...styles.btn, ...styles.btnGhost }}>
                          Reset Password
                        </button>
                        <button onClick={() => toast('User will be forced to change password (demo)')} style={{ ...styles.btn, ...styles.btnGhost }}>
                          Force Password Change
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '8px' }}>Select a user</h3>
                <p style={{ fontSize: '0.875rem' }}>Choose a user from the list to view and edit their profile</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Add User Modal */}
      {userModalOpen && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setUserModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Add User</h3>
              <button onClick={() => setUserModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddUser} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Full name</span>
                <input
                  value={newUserData.name}
                  onChange={(e) => setNewUserData({ ...newUserData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email</span>
                <input
                  type="email"
                  value={newUserData.email}
                  onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone</span>
                <input
                  value={newUserData.phone}
                  onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setUserModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {addrModalOpen && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setAddrModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>{editingAddr ? 'Edit Address' : 'Add Address'}</h3>
              <button onClick={() => setAddrModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleAddressSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Label</span>
                <input
                  value={addrFormData.label}
                  onChange={(e) => setAddrFormData({ ...addrFormData, label: e.target.value })}
                  style={styles.input}
                  placeholder="Home, Work, etc."
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Address</span>
                <textarea
                  value={addrFormData.line}
                  onChange={(e) => setAddrFormData({ ...addrFormData, line: e.target.value })}
                  style={{ ...styles.input, fontFamily: 'inherit' }}
                  rows="3"
                  required
                />
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setAddrModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                  {editingAddr ? 'Update' : 'Add'} Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Branch Modal */}
      {branchModalOpen && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setBranchModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>{editingBranch ? 'Edit Branch' : 'Add Branch'}</h3>
              <button onClick={() => setBranchModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleBranchSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Branch Name *</span>
                <input
                  value={branchFormData.name}
                  onChange={(e) => setBranchFormData({ ...branchFormData, name: e.target.value })}
                  style={styles.input}
                  placeholder="Enter branch name"
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Branch Address *</span>
                <textarea
                  value={branchFormData.address}
                  onChange={(e) => setBranchFormData({ ...branchFormData, address: e.target.value })}
                  style={{ ...styles.input, fontFamily: 'inherit' }}
                  rows="3"
                  placeholder="Enter branch address"
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Coordinates (Latitude, Longitude) *</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input
                    type="number"
                    step="any"
                    value={branchFormData.lat || ''}
                    onChange={(e) => setBranchFormData({ ...branchFormData, lat: parseFloat(e.target.value) || null })}
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Latitude"
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    value={branchFormData.lon || ''}
                    onChange={(e) => setBranchFormData({ ...branchFormData, lon: parseFloat(e.target.value) || null })}
                    style={{ ...styles.input, flex: 1 }}
                    placeholder="Longitude"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleBranchAddressGeocode}
                    disabled={fetchingLocation}
                    style={{
                      ...styles.btn,
                      ...styles.btnPrimary,
                      padding: '8px 12px',
                      whiteSpace: 'nowrap',
                      opacity: fetchingLocation ? 0.6 : 1
                    }}
                  >
                    {fetchingLocation ? '🔄' : '📍'}
                  </button>
                </div>
                {branchFormData.lat && branchFormData.lon && (
                  <div style={{ fontSize: '0.75rem', color: '#4CAF50' }}>
                    ✅ Coordinates: {branchFormData.lat.toFixed(6)}, {branchFormData.lon.toFixed(6)}
                  </div>
                )}
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  checked={branchFormData.isMain}
                  onChange={(e) => setBranchFormData({ ...branchFormData, isMain: e.target.checked })}
                  style={{ margin: 0 }}
                />
                <span style={{ fontSize: '0.875rem', color: '#e6eef8' }}>Set as Main Branch</span>
              </label>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Main branch is used as the default location for products without specific branch assignment.
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setBranchModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                  {editingBranch ? 'Update' : 'Add'} Branch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProfileManagement;