import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/admin';

const AdminUserManagement = ({ navigateTo }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [state, setState] = useState({
    search: '',
    role: '',
    status: '',
    page: 1,
    selected: new Set()
  });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmText, setConfirmText] = useState('');

  const [userFormData, setUserFormData] = useState({
    id: '',
    fullname: '',
    email: '',
    phone: '',
    role: 'Customer',
    address: '',
    businessName: '',
    businessType: ''
  });

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      
      const formattedUsers = data.map(user => ({
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone || '-',
        role: user.role,
        status: user.status,
        lastActive: user.lastActive ? new Date(user.lastActive).toISOString().slice(0, 16).replace('T', ' ') : '-',
        orders: user.orders || 0,
        address: user.address || '-',
        businessName: user.businessName || '-',
        businessType: user.businessType || '-'
      }));
      
      setUsers(formattedUsers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast('Error fetching users');
      setLoading(false);
    }
  };

  const getKPIs = () => {
    return {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      blocked: users.filter(u => u.status === 'blocked').length,
      newToday: 0
    };
  };

  const getFiltered = () => {
    return users.filter(u => {
      const matchesSearch = !state.search ||
        u.fullname.toLowerCase().includes(state.search.toLowerCase()) ||
        u.email.toLowerCase().includes(state.search.toLowerCase()) ||
        u.phone.includes(state.search);
      const matchesRole = !state.role || u.role === state.role;
      const matchesStatus = !state.status || u.status === state.status;
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  const paginate = (list) => {
    const start = (state.page - 1) * ITEMS_PER_PAGE;
    return list.slice(start, start + ITEMS_PER_PAGE);
  };

  const openDrawer = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const openUserModal = (user = null) => {
    if (user) {
      setUserFormData({
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        role: user.role,
        address: user.address || '',
        businessName: user.businessName || '',
        businessType: user.businessType || ''
      });
    } else {
      setUserFormData({
        id: '',
        fullname: '',
        email: '',
        phone: '',
        role: 'Customer',
        address: '',
        businessName: '',
        businessType: ''
      });
    }
    setUserModalOpen(true);
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (userFormData.id) {
        const response = await fetch(`${API_URL}/users/${userFormData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullname: userFormData.fullname,
            email: userFormData.email,
            phone: userFormData.phone,
            address: userFormData.address,
            businessName: userFormData.businessName,
            businessType: userFormData.businessType
          })
        });

        if (response.ok) {
          toast('User updated');
          fetchUsers();
        } else {
          toast('Error updating user');
        }
      }
      
      setUserModalOpen(false);
    } catch (error) {
      console.error('Error saving user:', error);
      toast('Error saving user');
    }
  };

  const deleteUsers = async (userIds) => {
    try {
      for (const id of userIds) {
        // Find the user to get their role
        const user = users.find(u => u.id === id);
        if (!user) {
          console.error('User not found:', id);
          continue;
        }

        const response = await fetch(`${API_URL}/users/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: user.role })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to delete user:', id, errorData);
          throw new Error(`Failed to delete user ${user.fullname}: ${errorData.message || 'Unknown error'}`);
        }
      }

      toast('Users deleted');
      fetchUsers();
      const newSelected = new Set(state.selected);
      userIds.forEach(id => newSelected.delete(id));
      setState({ ...state, selected: newSelected });
    } catch (error) {
      console.error('Error deleting users:', error);
      toast('Error deleting users: ' + error.message);
    }
  };

  const blockUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'blocked' })
      });

      if (response.ok) {
        toast('User blocked');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error blocking user:', error);
      toast('Error blocking user');
    }
  };

  const unblockUser = async (userId) => {
    try {
      const response = await fetch(`${API_URL}/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });

      if (response.ok) {
        toast('User unblocked');
        fetchUsers();
      }
    } catch (error) {
      console.error('Error unblocking user:', error);
      toast('Error unblocking user');
    }
  };

  const bulkActivate = async () => {
    try {
      for (const userId of Array.from(state.selected)) {
        await fetch(`${API_URL}/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'active' })
        });
      }
      toast('Selected users activated');
      fetchUsers();
    } catch (error) {
      console.error('Error activating users:', error);
      toast('Error activating users');
    }
  };

  const bulkBlock = async () => {
    try {
      for (const userId of Array.from(state.selected)) {
        await fetch(`${API_URL}/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'blocked' })
        });
      }
      toast('Selected users blocked');
      fetchUsers();
    } catch (error) {
      console.error('Error blocking users:', error);
      toast('Error blocking users');
    }
  };

  const exportCSV = () => {
    const cols = ['id', 'fullname', 'email', 'phone', 'role', 'status', 'lastActive', 'orders', 'address'];
    const csv = [cols.join(',')].concat(
      users.map(u => cols.map(k => `"${String(u[k] ?? '').replace(/"/g, '\\"')}"`).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'users.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const showConfirm = (text, action) => {
    setConfirmText(text);
    setConfirmAction(() => action);
    setConfirmModalOpen(true);
  };

  const executeConfirm = () => {
    if (confirmAction) confirmAction();
    setConfirmModalOpen(false);
  };

  const toast = (msg) => {
    alert(msg);
  };

  const getBadgeStyle = (status) => {
    const baseStyle = {
      padding: '4px 10px',
      borderRadius: '999px',
      fontSize: '0.75rem',
      fontWeight: '700',
      letterSpacing: '0.02em'
    };
    
    if (status === 'active') {
      return { ...baseStyle, background: 'rgba(34,197,94,0.18)', color: '#86efac' };
    } else if (status === 'blocked') {
      return { ...baseStyle, background: 'rgba(239,68,68,0.18)', color: '#fca5a5' };
    }
    return { ...baseStyle, background: 'rgba(148,163,184,0.18)', color: '#cbd5e1' };
  };

  const kpis = getKPIs();
  const filtered = getFiltered();
  const paged = paginate(filtered);
  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));

  const styles = {
    container: {
      minHeight: '100vh',
      background: '#0f172a',
      color: '#e5e7eb',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '20px'
    },
    header: {
      marginBottom: '24px'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    subtitle: {
      color: '#94a3b8'
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    },
    card: {
      background: 'rgba(30, 41, 59, 0.6)',
      backdropFilter: 'blur(8px)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(51, 65, 85, 0.5)'
    },
    kpiValue: {
      fontSize: '2.25rem',
      fontWeight: 'bold',
      marginBottom: '4px'
    },
    kpiLabel: {
      fontSize: '0.875rem',
      color: '#94a3b8'
    },
    toolbar: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    input: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(51, 65, 85, 0.5)',
      borderRadius: '8px',
      padding: '8px 12px',
      color: '#e5e7eb',
      outline: 'none',
      fontSize: '0.875rem'
    },
    btn: {
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    btnPrimary: {
      background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
      color: '#fff'
    },
    btnGhost: {
      background: 'rgba(30, 41, 59, 0.6)',
      color: '#e5e7eb',
      border: '1px solid rgba(51, 65, 85, 0.5)'
    },
    btnDanger: {
      background: 'rgba(239, 68, 68, 0.2)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.3)'
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0'
    },
    th: {
      textAlign: 'left',
      padding: '12px',
      fontSize: '0.75rem',
      fontWeight: '700',
      color: '#94a3b8',
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
    },
    td: {
      padding: '12px',
      borderBottom: '1px solid rgba(51, 65, 85, 0.5)'
    },
    drawer: {
      position: 'fixed',
      top: 0,
      right: drawerOpen ? 0 : '-320px',
      height: '100vh',
      width: '320px',
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(12px)',
      padding: '20px',
      transition: 'right 0.3s',
      overflowY: 'auto',
      zIndex: 1000,
      borderLeft: '1px solid rgba(51, 65, 85, 0.5)'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'grid',
      placeItems: 'center',
      zIndex: 2000,
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(12px)',
      padding: '24px',
      borderRadius: '16px',
      maxWidth: '500px',
      width: '90%',
      border: '1px solid rgba(51, 65, 85, 0.5)'
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Loading users...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button
          onClick={() => navigateTo('admin-dashboard')}
          style={{ ...styles.btn, ...styles.btnGhost, marginRight: '20px' }}
        >
          ← Back to Admin Home
        </button>
        <h1 style={styles.title}>User Management</h1>
        <p style={styles.subtitle}>Manage all platform users</p>
      </header>

      <section style={styles.kpiGrid}>
        <div style={styles.card}>
          <div style={styles.kpiValue}>{kpis.total}</div>
          <div style={styles.kpiLabel}>Total Users</div>
        </div>
        <div style={styles.card}>
          <div style={styles.kpiValue}>{kpis.active}</div>
          <div style={styles.kpiLabel}>Active Users</div>
        </div>
        <div style={styles.card}>
          <div style={styles.kpiValue}>{kpis.blocked}</div>
          <div style={styles.kpiLabel}>Blocked Users</div>
        </div>
        <div style={styles.card}>
          <div style={styles.kpiValue}>{kpis.newToday}</div>
          <div style={styles.kpiLabel}>New Today</div>
        </div>
      </section>

      <main>
        <section style={styles.card}>
          <div style={styles.toolbar}>
            <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="Search users..."
                value={state.search}
                onChange={(e) => setState({ ...state, search: e.target.value, page: 1 })}
                style={{ ...styles.input, minWidth: '200px', flex: 1 }}
              />
              <select
                value={state.role}
                onChange={(e) => setState({ ...state, role: e.target.value, page: 1 })}
                style={styles.input}
              >
                <option value="">All Roles</option>
                <option value="Customer">Customer</option>
                <option value="Seller">Seller</option>
                <option value="Admin">Admin</option>
              </select>
              <select
                value={state.status}
                onChange={(e) => setState({ ...state, status: e.target.value, page: 1 })}
                style={styles.input}
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <button onClick={exportCSV} style={{ ...styles.btn, ...styles.btnGhost }}>
              Export CSV
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>
                    <input
                      type="checkbox"
                      checked={paged.length > 0 && paged.every(u => state.selected.has(u.id))}
                      onChange={(e) => {
                        const newSelected = new Set(state.selected);
                        if (e.target.checked) {
                          paged.forEach(u => newSelected.add(u.id));
                        } else {
                          paged.forEach(u => newSelected.delete(u.id));
                        }
                        setState({ ...state, selected: newSelected });
                      }}
                    />
                  </th>
                  <th style={styles.th}>User</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Last Active</th>
                  <th style={styles.th}>Orders</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map(user => (
                  <tr key={user.id}>
                    <td style={styles.td}>
                      <input
                        type="checkbox"
                        checked={state.selected.has(user.id)}
                        onChange={(e) => {
                          const newSelected = new Set(state.selected);
                          if (e.target.checked) {
                            newSelected.add(user.id);
                          } else {
                            newSelected.delete(user.id);
                          }
                          setState({ ...state, selected: newSelected });
                        }}
                      />
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ height: '32px', width: '32px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', display: 'grid', placeItems: 'center', color: '#a5b4fc', fontWeight: '700', fontSize: '0.75rem' }}>
                          {user.fullname.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
                        </div>
                        <span style={{ fontWeight: '600' }}>{user.fullname}</span>
                      </div>
                    </td>
                    <td style={styles.td}>{user.email}</td>
                    <td style={styles.td}>{user.phone}</td>
                    <td style={styles.td}>{user.role}</td>
                    <td style={styles.td}>
                      <span style={getBadgeStyle(user.status)}>{user.status}</span>
                    </td>
                    <td style={styles.td}>{user.lastActive}</td>
                    <td style={styles.td}>{user.orders}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => openDrawer(user.id)} style={{ ...styles.btn, ...styles.btnGhost, padding: '4px 8px', fontSize: '0.75rem' }}>
                          View
                        </button>
                        <button onClick={() => openUserModal(user)} style={{ ...styles.btn, ...styles.btnGhost, padding: '4px 8px', fontSize: '0.75rem' }}>
                          Edit
                        </button>
                        {user.status === 'active' ? (
                          <button onClick={() => showConfirm('Block this user?', () => blockUser(user.id))} style={{ ...styles.btn, ...styles.btnDanger, padding: '4px 8px', fontSize: '0.75rem' }}>
                            Block
                          </button>
                        ) : (
                          <button onClick={() => showConfirm('Unblock this user?', () => unblockUser(user.id))} style={{ ...styles.btn, ...styles.btnPrimary, padding: '4px 8px', fontSize: '0.75rem' }}>
                            Unblock
                          </button>
                        )}
                        <button onClick={() => showConfirm('Delete this user?', () => deleteUsers([user.id]))} style={{ ...styles.btn, ...styles.btnDanger, padding: '4px 8px', fontSize: '0.75rem' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={{ ...styles.card, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={bulkActivate} disabled={state.selected.size === 0} style={{ ...styles.btn, ...styles.btnGhost, opacity: state.selected.size === 0 ? 0.5 : 1 }}>
              Activate Selected
            </button>
            <button onClick={bulkBlock} disabled={state.selected.size === 0} style={{ ...styles.btn, ...styles.btnGhost, opacity: state.selected.size === 0 ? 0.5 : 1 }}>
              Block Selected
            </button>
            <button onClick={() => showConfirm('Delete selected users?', () => deleteUsers(Array.from(state.selected)))} disabled={state.selected.size === 0} style={{ ...styles.btn, ...styles.btnDanger, opacity: state.selected.size === 0 ? 0.5 : 1 }}>
              Delete Selected
            </button>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => state.page > 1 && setState({ ...state, page: state.page - 1 })}
              disabled={state.page === 1}
              style={{ ...styles.btn, ...styles.btnGhost, padding: '6px 10px', opacity: state.page === 1 ? 0.5 : 1 }}
            >
              Prev
            </button>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              Page {state.page} of {totalPages}
            </span>
            <button
              onClick={() => state.page < totalPages && setState({ ...state, page: state.page + 1 })}
              disabled={state.page === totalPages}
              style={{ ...styles.btn, ...styles.btnGhost, padding: '6px 10px', opacity: state.page === totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </section>
      </main>

      {/* User Drawer */}
      <aside style={styles.drawer}>
        {selectedUser && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>User Details</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: '#e5e7eb', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ height: '48px', width: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'grid', placeItems: 'center', color: '#a5b4fc', fontWeight: '700', fontSize: '1.25rem' }}>
                {selectedUser.fullname.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>{selectedUser.fullname}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{selectedUser.email}</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', marginBottom: '16px' }}>
              <div style={{ ...styles.card, padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Role</div>
                <div style={{ fontWeight: '600' }}>{selectedUser.role}</div>
              </div>
              <div style={{ ...styles.card, padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</div>
                <div><span style={getBadgeStyle(selectedUser.status)}>{selectedUser.status}</span></div>
              </div>
              <div style={{ ...styles.card, padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone</div>
                <div style={{ fontWeight: '600' }}>{selectedUser.phone || '-'}</div>
              </div>
              <div style={{ ...styles.card, padding: '12px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Last Active</div>
                <div style={{ fontWeight: '600' }}>{selectedUser.lastActive}</div>
              </div>
              <div style={{ ...styles.card, padding: '12px', gridColumn: '1 / -1' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Address</div>
                <div style={{ fontWeight: '600' }}>{selectedUser.address || '-'}</div>
              </div>
              {selectedUser.role === 'Seller' && (
                <>
                  <div style={{ ...styles.card, padding: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Business Name</div>
                    <div style={{ fontWeight: '600' }}>{selectedUser.businessName || '-'}</div>
                  </div>
                  <div style={{ ...styles.card, padding: '12px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Business Type</div>
                    <div style={{ fontWeight: '600' }}>{selectedUser.businessType || '-'}</div>
                  </div>
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => openUserModal(selectedUser)} style={{ ...styles.btn, ...styles.btnPrimary }}>
                Edit
              </button>
              <button onClick={() => setDrawerOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                Close
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* User Modal */}
      {userModalOpen && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setUserModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Edit User</h3>
              <button onClick={() => setUserModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e5e7eb', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleUserSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Full Name</span>
                <input
                  value={userFormData.fullname}
                  onChange={(e) => setUserFormData({ ...userFormData, fullname: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email</span>
                <input
                  type="email"
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone</span>
                <input
                  value={userFormData.phone}
                  onChange={(e) => setUserFormData({ ...userFormData, phone: e.target.value })}
                  style={styles.input}
                />
              </label>
              {userFormData.role === 'Seller' && (
                <>
                  <label style={{ display: 'grid', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Business Name</span>
                    <input
                      value={userFormData.businessName}
                      onChange={(e) => setUserFormData({ ...userFormData, businessName: e.target.value })}
                      style={styles.input}
                    />
                  </label>
                  <label style={{ display: 'grid', gap: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Business Type</span>
                    <input
                      value={userFormData.businessType}
                      onChange={(e) => setUserFormData({ ...userFormData, businessType: e.target.value })}
                      style={styles.input}
                    />
                  </label>
                </>
              )}
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Address</span>
                <textarea
                  value={userFormData.address}
                  onChange={(e) => setUserFormData({ ...userFormData, address: e.target.value })}
                  style={{ ...styles.input, fontFamily: 'inherit' }}
                  rows="3"
                />
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setUserModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModalOpen && (
        <div style={styles.modal}>
          <div style={{ ...styles.modalContent, maxWidth: '400px' }}>
            <h3 style={{ fontWeight: 'bold', marginBottom: '16px' }}>Confirm Action</h3>
            <p style={{ marginBottom: '16px', color: '#94a3b8' }}>{confirmText}</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setConfirmModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                Cancel
              </button>
              <button onClick={executeConfirm} style={{ ...styles.btn, ...styles.btnDanger }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagement;