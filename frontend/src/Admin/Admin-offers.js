import React, { useState, useEffect } from 'react';

const AdminOffersManagement = ({ navigateTo }) => {
  const [offers, setOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const API_URL = 'http://localhost:5000/api/offers';

  const [formData, setFormData] = useState({
    type: 'category', // Changed default to category
    targetId: '',
    discountType: 'percentage',
    discountValue: '',
    description: '',
    isActive: true
  });

  useEffect(() => {
    fetchOffers();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const getCounts = () => {
    const active = offers.filter(o => o.isActive);
    const inactive = offers.filter(o => !o.isActive);
    return { active: active.length, inactive: inactive.length };
  };

  const openModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setFormData({
        type: offer.type,
        targetId: offer.targetId,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        description: offer.description || '',
        isActive: offer.isActive
      });
    } else {
      setEditingOffer(null);
      setFormData({
        type: 'product',
        targetId: '',
        discountType: 'percentage',
        discountValue: '',
        description: '',
        isActive: true
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOffer(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      discountValue: Number(formData.discountValue) || 0
    };

    const url = editingOffer ? `${API_URL}/${editingOffer._id}` : API_URL;
    const method = editingOffer ? 'PUT' : 'POST';

    try {
      await fetch(url, {
        method: method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      closeModal();
      fetchOffers();
    } catch (error) {
      console.error('Error saving offer:', error);
    }
  };

  const toggleOfferStatus = async (offer) => {
    try {
      await fetch(`${API_URL}/${offer._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ isActive: !offer.isActive })
      });
      fetchOffers();
    } catch (error) {
      console.error('Error toggling offer:', error);
    }
  };

  const deleteOffer = async (id) => {
    if (window.confirm('Delete offer?')) {
      try {
        await fetch(`${API_URL}/${id}`, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        fetchOffers();
      } catch (error) {
        console.error('Error deleting offer:', error);
      }
    }
  };

  const approveOffer = async (id) => {
    try {
      await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: 'approved' })
      });
      fetchOffers();
    } catch (error) {
      console.error('Error approving offer:', error);
    }
  };

  const rejectOffer = async (id) => {
    if (window.confirm('Reject this offer?')) {
      try {
        await fetch(`${API_URL}/${id}/status`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ status: 'rejected' })
        });
        fetchOffers();
      } catch (error) {
        console.error('Error rejecting offer:', error);
      }
    }
  };

  const getTypeLabel = (offer) => {
    const discountText = offer.discountType === 'percentage' ?
      `${offer.discountValue}% off` :
      `₹${offer.discountValue} off`;

    if (offer.type === 'global') return `${discountText} (Global)`;
    if (offer.type === 'seller') return `${discountText} (Seller: ${offer.targetId})`;
    if (offer.type === 'category') return `${discountText} (Category: ${offer.targetId})`;
    if (offer.type === 'product') return `${discountText} (Product: ${offer.targetId})`;
    if (offer.type === 'cart') return `${discountText} (Cart Offer)`;
    return discountText;
  };

  const getStatusBadge = (offer) => {
    const statusColors = {
      pending: '#ff9800',
      approved: '#4caf50',
      rejected: '#f44336'
    };
    return {
      backgroundColor: statusColors[offer.status] || '#666',
      color: 'white',
      padding: '2px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: 'bold'
    };
  };

  const filteredOffers = offers.filter(offer => {
    const q = searchQuery.toLowerCase();
    return (offer.description?.toLowerCase().includes(q) ||
            offer.type.toLowerCase().includes(q) ||
            offer.targetId.toLowerCase().includes(q));
  });

  const counts = getCounts();

  return (
    <div style={styles.body}>
      <style>{globalStyles}</style>
      
      <header style={styles.header}>
        <div style={styles.headerContainer}>
          <div>
            <h1 style={styles.headerTitle}>Discount Offers</h1>
            <p style={styles.headerSubtitle}>Create product, category, seller, or global discount offers</p>
          </div>
          <div style={styles.headerButtons}>
            <button
              onClick={() => navigateTo('admin-dashboard')}
              style={{ ...styles.btnPrimary, marginRight: '20px' }}
            >
              ← Back to Admin Home
            </button>
            <button onClick={() => openModal()} style={styles.btnPrimary}>+ New Offer</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Offers</div>
            <div style={styles.statValue}>{counts.active}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Inactive Offers</div>
            <div style={styles.statValue}>{counts.inactive}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Offers</div>
            <div style={styles.statValue}>{offers.length}</div>
          </div>
        </section>

        {/* Pending Offers Section */}
        {offers.filter(o => o.status === 'pending').length > 0 && (
          <section style={styles.tableSection}>
            <div style={styles.tableHeader}>
              <h2 style={{ ...styles.tableTitle, color: '#ff9800' }}>🔔 Pending Offers (Require Approval)</h2>
            </div>
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.tableHeaderRow}>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>Target</th>
                    <th style={styles.th}>Discount</th>
                    <th style={styles.th}>Description</th>
                    <th style={styles.th}>Created By</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.filter(o => o.status === 'pending').map(offer => (
                    <tr key={offer._id}>
                      <td style={styles.td}>
                        <div style={styles.tdBold}>{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</div>
                      </td>
                      <td style={styles.td}>
                        {offer.type === 'global' ? 'All Products' :
                         offer.type === 'seller' ? `Seller: ${offer.targetId}` :
                         offer.type === 'category' ? `Category: ${offer.targetId}` :
                         offer.type === 'cart' ? 'Cart Offer' :
                         `Product ID: ${offer.targetId}`}
                      </td>
                      <td style={styles.td}>
                        {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                      </td>
                      <td style={styles.td}>{offer.description || '—'}</td>
                      <td style={styles.td}>
                        <span style={{ color: '#666', fontSize: '14px' }}>
                          {offer.createdBy || 'Unknown'}
                        </span>
                      </td>
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actionButtons}>
                          <button onClick={() => approveOffer(offer._id)} style={{ ...styles.btnGhost, backgroundColor: '#4caf50', color: 'white' }}>
                            ✅ Approve
                          </button>
                          <button onClick={() => rejectOffer(offer._id)} style={{ ...styles.btnGhost, backgroundColor: '#f44336', color: 'white' }}>
                            ❌ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <section style={styles.tableSection}>
          <div style={styles.tableHeader}>
            <h2 style={styles.tableTitle}>Offers List</h2>
            <input
              placeholder="Search description, type, or target"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>Type</th>
                  <th style={styles.th}>Target</th>
                  <th style={styles.th}>Discount</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Status</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.map(offer => (
                  <tr key={offer._id}>
                    <td style={styles.td}>
                      <div style={styles.tdBold}>{offer.type.charAt(0).toUpperCase() + offer.type.slice(1)}</div>
                    </td>
                    <td style={styles.td}>
                      {offer.type === 'global' ? 'All Products' :
                       offer.type === 'seller' ? `Seller: ${offer.targetId}` :
                       offer.type === 'category' ? `Category: ${offer.targetId}` :
                       offer.type === 'cart' ? 'Cart Offer' :
                       `Product ID: ${offer.targetId}`}
                    </td>
                    <td style={styles.td}>
                      {offer.discountType === 'percentage' ? `${offer.discountValue}%` : `₹${offer.discountValue}`}
                    </td>
                    <td style={styles.td}>{offer.description || '—'}</td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={getStatusBadge(offer)}>
                          {offer.status?.charAt(0).toUpperCase() + offer.status?.slice(1) || 'Approved'}
                        </span>
                        {offer.createdBy && offer.createdBy !== 'admin' && (
                          <small style={{ color: '#666', fontSize: '11px' }}>
                            By: {offer.createdBy}
                          </small>
                        )}
                      </div>
                    </td>
                    <td style={{ ...styles.td, textAlign: 'right' }}>
                      <div style={styles.actionButtons}>
                        {offer.status === 'pending' ? (
                          <>
                            <button onClick={() => approveOffer(offer._id)} style={{ ...styles.btnGhost, backgroundColor: '#4caf50', color: 'white' }}>
                              Approve
                            </button>
                            <button onClick={() => rejectOffer(offer._id)} style={{ ...styles.btnGhost, backgroundColor: '#f44336', color: 'white' }}>
                              Reject
                            </button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => openModal(offer)} style={styles.btnGhost}>Edit</button>
                            <button onClick={() => toggleOfferStatus(offer)} style={styles.btnGhost}>
                              {offer.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button onClick={() => deleteOffer(offer._id)} style={styles.btnDanger}>Delete</button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {showModal && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>{editingOffer ? 'Edit Discount Offer' : 'New Discount Offer'}</h3>
              <button onClick={closeModal} style={styles.closeButton}>✕</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>
                <span style={styles.labelText}>Offer Type</span>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value, targetId: e.target.value === 'global' ? 'all' : e.target.value === 'cart' ? 'cart' : '' })}
                  style={styles.input}
                  required
                >
                  <option value="product">Product Specific</option>
                  <option value="category">Category Specific</option>
                  <option value="seller">Seller Specific</option>
                  <option value="cart">Cart Offer</option>
                  <option value="global">Global (All Products)</option>
                </select>
              </label>
              <label style={styles.label}>
                <span style={styles.labelText}>
                  {formData.type === 'product' ? 'Product ID' :
                   formData.type === 'category' ? 'Category' :
                   formData.type === 'seller' ? 'Seller Business Name' :
                   formData.type === 'cart' ? 'Target (automatically set to "cart")' :
                   'Target (leave as "all")'}
                </span>
                {formData.type === 'category' ? (
                  <select
                    value={formData.targetId}
                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                    style={styles.input}
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category._id} value={category.name}>{category.name}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    value={formData.targetId}
                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                    style={styles.input}
                    placeholder={
                      formData.type === 'product' ? 'Enter product ID' :
                      formData.type === 'seller' ? 'Enter seller business name' :
                      formData.type === 'cart' ? 'cart' :
                      'all'
                    }
                    disabled={formData.type === 'global' || formData.type === 'cart'}
                    required={formData.type !== 'global' && formData.type !== 'cart'}
                  />
                )}
              </label>
              <label style={styles.label}>
                <span style={styles.labelText}>Discount Type</span>
                <select
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  style={styles.input}
                  required
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </label>
              <label style={styles.label}>
                <span style={styles.labelText}>Discount Value</span>
                <input
                  type="number"
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                  style={styles.input}
                  placeholder={formData.discountType === 'percentage' ? '10 for 10%' : '500 for ₹500 off'}
                  required
                />
              </label>
              <label style={{ ...styles.label, gridColumn: '1 / -1' }}>
                <span style={styles.labelText}>Description (optional)</span>
                <textarea
                  rows="2"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={styles.textarea}
                  placeholder="Brief description of the offer"
                />
              </label>
              <label style={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  style={styles.checkbox}
                />
                <span style={styles.labelText}>Active</span>
              </label>
              <div style={styles.formButtons}>
                <button type="button" onClick={closeModal} style={styles.btnGhost}>Cancel</button>
                <button type="submit" style={styles.btnPrimary}>Save Offer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
`;

const styles = {
  body: {
    fontFamily: 'Inter, system-ui, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
    background: 'linear-gradient(180deg, #0b1020, #0d1226)',
    color: '#e6eef8',
    minHeight: '100vh'
  },
  header: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 10px 30px rgba(2,6,23,0.45)',
    position: 'sticky',
    top: 0,
    padding: '12px',
    zIndex: 30
  },
  headerContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headerTitle: {
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  headerSubtitle: {
    fontSize: '0.875rem',
    color: '#94a3b8'
  },
  headerButtons: {
    display: 'flex',
    gap: '8px'
  },
  main: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '16px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginBottom: '16px'
  },
  statCard: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 10px 30px rgba(2,6,23,0.45)',
    padding: '16px',
    borderRadius: '12px'
  },
  statLabel: {
    color: '#94a3b8',
    fontSize: '0.875rem'
  },
  statValue: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginTop: '8px'
  },
  tableSection: {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
    border: '1px solid rgba(255,255,255,0.06)',
    boxShadow: '0 10px 30px rgba(2,6,23,0.45)',
    padding: '16px',
    borderRadius: '12px'
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  tableTitle: {
    fontWeight: 'bold'
  },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '8px 12px',
    borderRadius: '12px',
    border: 'none',
    color: '#e6eef8'
  },
  tableContainer: {
    overflowX: 'auto',
    maxHeight: '420px'
  },
  table: {
    width: '100%',
    fontSize: '0.875rem'
  },
  tableHeaderRow: {
    color: '#94a3b8',
    fontSize: '0.75rem'
  },
  th: {
    padding: '8px',
    textAlign: 'left'
  },
  td: {
    padding: '8px'
  },
  tdBold: {
    fontWeight: '600'
  },
  tdMuted: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  actionButtons: {
    display: 'inline-flex',
    gap: '8px'
  },
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '12px',
    padding: '8px 14px',
    fontWeight: '600',
    background: '#6366f1',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  },
  btnGhost: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '12px',
    padding: '8px 14px',
    fontWeight: '600',
    background: 'rgba(255,255,255,0.04)',
    color: '#e6eef8',
    border: 'none',
    cursor: 'pointer'
  },
  btnDanger: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    borderRadius: '12px',
    padding: '8px 14px',
    fontWeight: '600',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
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
    maxWidth: '768px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  modalTitle: {
    fontWeight: 'bold'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: '#e6eef8',
    cursor: 'pointer',
    fontSize: '1.25rem'
  },
  form: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px'
  },
  label: {
    display: 'grid',
    gap: '4px'
  },
  labelText: {
    fontSize: '0.75rem',
    color: '#94a3b8'
  },
  input: {
    backgroundColor: 'rgba(30, 41, 59, 0.6)',
    padding: '8px 12px',
    borderRadius: '12px',
    border: 'none',
    color: '#e6eef8'
  },
  textarea: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    padding: '8px 12px',
    borderRadius: '12px',
    border: 'none',
    color: '#e6eef8',
    fontFamily: 'inherit'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    gridColumn: '1 / -1'
  },
  checkbox: {
    accentColor: '#6366f1'
  },
  formButtons: {
    gridColumn: '1 / -1',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '8px',
    paddingTop: '8px'
  }
};

export default AdminOffersManagement;