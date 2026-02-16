// Admin-earner-management.jsx
import React, { useState, useEffect } from 'react';

const AdminEarnerManagement = ({ navigateTo }) => {
  const [sellers, setSellers] = useState([]);
  const [allSellers, setAllSellers] = useState([]); // For accurate counts
  const [filter, setFilter] = useState('pending'); // 'all', 'pending', 'active', 'rejected'
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' or 'product-earners'
  const [productEarners, setProductEarners] = useState([]);
  const [earnersLoading, setEarnersLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchAllSellers();
      fetchSellers();
    } else if (activeTab === 'product-earners') {
      fetchProductEarners();
    }
  }, [filter, activeTab]);

  const fetchAllSellers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/all-sellers');
      const data = await response.json();
      setAllSellers(data);
    } catch (error) {
      console.error('Error fetching all sellers:', error);
    }
  };

  const fetchProductEarners = async () => {
    try {
      setEarnersLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/product-earners');
      const data = await response.json();
      console.log('Product earners data:', data);
      setProductEarners(data.earners || []);
      setEarnersLoading(false);
    } catch (error) {
      console.error('Error fetching product earners:', error);
      setEarnersLoading(false);
    }
  };

  const fetchSellers = async () => {
    try {
      setLoading(true);
      const endpoint = filter === 'pending'
        ? 'http://localhost:5000/api/admin/pending-sellers'
        : 'http://localhost:5000/api/admin/all-sellers';

      const response = await fetch(endpoint);
      const data = await response.json();

      if (filter === 'all') {
        setSellers(data);
      } else if (filter === 'pending') {
        setSellers(data);
      } else {
        // Filter by status for 'active' or 'rejected'
        const filtered = data.filter(seller => seller.status === filter);
        setSellers(filtered);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      setLoading(false);
      alert('Failed to fetch sellers');
    }
  };

  const handleApproveSeller = async (sellerId) => {
    if (!window.confirm('Are you sure you want to APPROVE this seller registration?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Seller approved successfully! They can now login and add products.');
        fetchSellers(); // Refresh list
        fetchAllSellers(); // Refresh counts
      } else {
        alert(data.message || 'Failed to approve seller');
      }
    } catch (error) {
      console.error('Error approving seller:', error);
      alert('An error occurred while approving seller');
    }
  };

  const handleRejectSeller = async (sellerId) => {
    setSelectedSeller(sellerId);
    setShowModal(true);
  };

  const confirmRejectSeller = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${selectedSeller}/reject`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rejectionReason })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Seller registration rejected. Notification email sent to seller.');
        setShowModal(false);
        setRejectionReason('');
        setSelectedSeller(null);
        fetchSellers(); // Refresh list
        fetchAllSellers(); // Refresh counts
      } else {
        alert(data.message || 'Failed to reject seller');
      }
    } catch (error) {
      console.error('Error rejecting seller:', error);
      alert('An error occurred while rejecting seller');
    }
  };

  const handleDeleteSeller = async (sellerId, businessName) => {
    if (!window.confirm(`Are you sure you want to PERMANENTLY DELETE ${businessName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/admin/sellers/${sellerId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        alert('Seller deleted successfully');
        fetchSellers(); // Refresh list
        fetchAllSellers(); // Refresh counts
      } else {
        alert(data.message || 'Failed to delete seller');
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
      alert('An error occurred while deleting seller');
    }
  };

  const getStatusBadgeStyle = (status) => {
    const styles = {
      pending: { background: '#ff9800', color: 'white' },
      active: { background: '#4CAF50', color: 'white' },
      rejected: { background: '#f44336', color: 'white' },
      blocked: { background: '#9e9e9e', color: 'white' }
    };
    return styles[status] || { background: '#ccc', color: 'white' };
  };

  const filteredSellersCount = {
    all: allSellers.length,
    pending: allSellers.filter(s => s.status === 'pending').length,
    active: allSellers.filter(s => s.status === 'active').length,
    rejected: allSellers.filter(s => s.status === 'rejected').length
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🛒</span>
          ShopNest Admin
        </div>
        <button 
          style={styles.backButton}
          onClick={() => navigateTo('admin-dashboard')}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.title}>Earner Management</h1>
        
        {/* Main Tabs */}
        <div style={styles.mainTabs}>
          <button
            style={{
              ...styles.mainTab,
              ...(activeTab === 'registrations' ? styles.mainTabActive : {})
            }}
            onClick={() => setActiveTab('registrations')}
          >
            📝 Seller Registrations
          </button>
          <button
            style={{
              ...styles.mainTab,
              ...(activeTab === 'product-earners' ? styles.mainTabActive : {})
            }}
            onClick={() => setActiveTab('product-earners')}
          >
            📦 Product Earners
          </button>
        </div>

        {activeTab === 'registrations' && (
          <>
            <p style={styles.subtitle}>Review and approve seller registration requests from earners</p>

            {/* Filter Tabs */}
            <div style={styles.filterTabs}>
              <button
                style={{
                  ...styles.filterTab,
                  ...(filter === 'pending' ? styles.filterTabActive : {})
                }}
                onClick={() => setFilter('pending')}
              >
                ⏳ Pending ({filteredSellersCount.pending})
              </button>
              <button
                style={{
                  ...styles.filterTab,
                  ...(filter === 'active' ? styles.filterTabActive : {})
                }}
                onClick={() => setFilter('active')}
              >
                ✅ Approved ({filteredSellersCount.active})
              </button>
              <button
                style={{
                  ...styles.filterTab,
                  ...(filter === 'rejected' ? styles.filterTabActive : {})
                }}
                onClick={() => setFilter('rejected')}
              >
                ❌ Rejected ({filteredSellersCount.rejected})
              </button>
              <button
                style={{
                  ...styles.filterTab,
                  ...(filter === 'all' ? styles.filterTabActive : {})
                }}
                onClick={() => setFilter('all')}
              >
                📋 All ({filteredSellersCount.all})
              </button>
            </div>
          </>
        )}

        {activeTab === 'product-earners' && (
          <>
            <p style={styles.subtitle}>Track daily product additions by earners for sellers</p>
            
            {/* Product Earners List */}
            {earnersLoading ? (
              <div style={styles.loading}>Loading product earners...</div>
            ) : productEarners.length === 0 ? (
              <div style={styles.empty}>
                <h2>No product earners found</h2>
                <p>No products have been added by earners.</p>
              </div>
            ) : (
              <div style={styles.table}>
                <table style={styles.tableElement}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Seller Name</th>
                      <th style={styles.th}>Earner Email</th>
                      <th style={styles.th}>Product Count</th>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Product Names</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productEarners.map((earner, index) => (
                      <tr key={index} style={styles.tableRow}>
                        <td style={styles.td}><strong>{earner.sellerName}</strong></td>
                        <td style={styles.td}>{earner.earnerEmail}</td>
                        <td style={styles.td}>
                          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#4CAF50' }}>
                            {earner.productCount}
                          </span>
                        </td>
                        <td style={styles.td}>{earner.date}</td>
                        <td style={styles.td}>
                          <div style={{ maxWidth: '300px', overflow: 'hidden' }}>
                            {earner.productNames && earner.productNames.length > 0 ? (
                              <>
                                {earner.productNames.slice(0, 3).map((name, idx) => (
                                  <div key={idx} style={{ fontSize: '12px', marginBottom: '2px' }}>
                                    • {name}
                                  </div>
                                ))}
                                {earner.productNames.length > 3 && (
                                  <div style={{ fontSize: '12px', color: '#666' }}>
                                    ... and {earner.productNames.length - 3} more
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={{ fontSize: '12px', color: '#999' }}>No products</div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {activeTab === 'registrations' && (
          <>
            {/* Sellers List */}
            {loading ? (
              <div style={styles.loading}>Loading sellers...</div>
            ) : sellers.length === 0 ? (
              <div style={styles.empty}>
                <h2>No {filter === 'all' ? '' : filter} sellers found</h2>
                <p>
                  {filter === 'pending' && 'No pending seller registrations at this time.'}
                  {filter === 'active' && 'No approved sellers yet.'}
                  {filter === 'rejected' && 'No rejected seller registrations.'}
                  {filter === 'all' && 'No seller registrations found.'}
                </p>
              </div>
            ) : (
              <div style={styles.table}>
                <table style={styles.tableElement}>
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Business Name</th>
                      <th style={styles.th}>Business Type</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Registered By</th>
                      <th style={styles.th}>Registration Date</th>
                      <th style={styles.th}>Status</th>
                      {filter === 'active' ? <th style={styles.th}>Action</th> : <th style={styles.th}>Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {sellers.map((seller) => (
                      <tr key={seller._id} style={styles.tableRow}>
                        <td style={styles.td}>{seller.fullname}</td>
                        <td style={styles.td}><strong>{seller.businessName}</strong></td>
                        <td style={styles.td}>{seller.businessType}</td>
                        <td style={styles.td}>{seller.email}</td>
                        <td style={styles.td}>
                          {seller.earnerEmail ? seller.earnerEmail : 'self'}
                        </td>
                        <td style={styles.td}>
                          {new Date(seller.createdAt).toLocaleDateString()}
                        </td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.statusBadge,
                            ...getStatusBadgeStyle(seller.status)
                          }}>
                            {seller.status.toUpperCase()}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionButtons}>
                            {seller.status === 'pending' && (
                              <>
                                <button
                                  style={styles.approveButton}
                                  onClick={() => handleApproveSeller(seller._id)}
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  style={styles.rejectButton}
                                  onClick={() => handleRejectSeller(seller._id)}
                                >
                                  ❌ Reject
                                </button>
                              </>
                            )}
                            {seller.status === 'rejected' && (
                              <button
                                style={styles.approveButton}
                                onClick={() => handleApproveSeller(seller._id)}
                              >
                                ✅ Approve
                              </button>
                            )}
                            {filter === 'active' && (
                              <button
                                style={styles.deleteButton}
                                onClick={() => handleDeleteSeller(seller._id, seller.businessName)}
                              >
                                🗑️ Delete
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* Rejection Modal */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2>Reject Seller Registration</h2>
            <p>Please provide a reason for rejection (optional):</p>
            <textarea
              style={styles.textarea}
              placeholder="e.g., Incomplete information, Invalid business type, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
            <div style={styles.modalButtons}>
              <button
                style={styles.confirmRejectButton}
                onClick={confirmRejectSeller}
              >
                Confirm Rejection
              </button>
              <button
                style={styles.cancelButton}
                onClick={() => {
                  setShowModal(false);
                  setRejectionReason('');
                  setSelectedSeller(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '15px 30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    marginRight: '10px'
  },
  backButton: {
    backgroundColor: 'white',
    color: '#4a90e2',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  content: {
    maxWidth: '1400px',
    margin: '30px auto',
    padding: '0 20px'
  },
  title: {
    fontSize: '32px',
    color: '#333',
    marginBottom: '10px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    marginBottom: '30px'
  },
  mainTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px'
  },
  mainTab: {
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    padding: '12px 24px',
    borderRadius: '5px 5px 0 0',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s',
    color: '#666'
  },
  mainTabActive: {
    backgroundColor: '#4a90e2',
    color: 'white',
    borderColor: '#4a90e2'
  },
  filterTabs: {
    display: 'flex',
    gap: '10px',
    marginBottom: '30px',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px'
  },
  filterTab: {
    backgroundColor: 'white',
    border: '2px solid #e0e0e0',
    padding: '12px 24px',
    borderRadius: '5px 5px 0 0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.3s',
    color: '#666'
  },
  filterTabActive: {
    backgroundColor: '#4a90e2',
    color: 'white',
    borderColor: '#4a90e2'
  },
  loading: {
    textAlign: 'center',
    padding: '60px',
    fontSize: '18px',
    color: '#666'
  },
  empty: {
    textAlign: 'center',
    padding: '60px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  table: {
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    overflowX: 'auto'
  },
  tableElement: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableHeader: {
    backgroundColor: '#f9f9f9'
  },
  th: {
    padding: '15px',
    textAlign: 'left',
    fontWeight: '600',
    color: '#333',
    borderBottom: '2px solid #e0e0e0'
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.2s'
  },
  td: {
    padding: '15px',
    color: '#666'
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    display: 'inline-block'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  deleteButton: {
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
    transition: 'all 0.3s'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'Arial, sans-serif',
    marginTop: '10px',
    marginBottom: '20px',
    resize: 'vertical'
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    justifyContent: 'flex-end'
  },
  confirmRejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600'
  }
};

export default AdminEarnerManagement;