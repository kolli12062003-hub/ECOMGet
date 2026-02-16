import React, { useState, useEffect } from 'react';

const AdminSellerManagement = ({ navigateTo }) => {
  const [sellers, setSellers] = useState([]);
  const [pendingProducts, setPendingProducts] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('approved');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // ⭐ NEW: Selection mode states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching admin data...');

      const [sellersRes, pendingRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/sellers`),
        fetch(`${API_URL}/api/admin/pending-products`)
      ]);

      if (!sellersRes.ok) {
        throw new Error(`Sellers API failed: ${sellersRes.status} ${sellersRes.statusText}`);
      }
      if (!pendingRes.ok) {
        throw new Error(`Pending products API failed: ${pendingRes.status} ${pendingRes.statusText}`);
      }

      const sellersData = await sellersRes.json();
      const pendingData = await pendingRes.json();

      console.log('Sellers loaded:', sellersData.length);
      console.log('Pending products loaded:', pendingData.length);

      setSellers(sellersData);
      setPendingProducts(pendingData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      alert(`Failed to load data: ${error.message}. Make sure the backend server is running on port 5000.`);
    } finally {
      setLoading(false);
    }
  };

  // ⭐ NEW: Toggle selection mode
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    // Clear selections when exiting selection mode
    if (isSelectionMode) {
      setSelectedSellers([]);
      setSelectedProducts([]);
    }
  };

  // Toggle individual seller selection
  const toggleSellerSelection = (sellerId) => {
    setSelectedSellers(prev => 
      prev.includes(sellerId) 
        ? prev.filter(id => id !== sellerId)
        : [...prev, sellerId]
    );
  };

  // Toggle individual product selection
  const toggleProductSelection = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // Select all sellers
  const toggleSelectAllSellers = () => {
    if (selectedSellers.length === filteredSellers.length) {
      setSelectedSellers([]);
    } else {
      setSelectedSellers(filteredSellers.map(s => s._id));
    }
  };

  // Select all products
  const toggleSelectAllProducts = () => {
    if (selectedProducts.length === pendingProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(pendingProducts.map(p => p._id));
    }
  };

  // Bulk delete selected sellers
  const handleBulkDeleteSellers = async () => {
    if (selectedSellers.length === 0) {
      alert('Please select sellers to delete');
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedSellers.length} seller(s)? This will also delete all their products.`
    );
    
    if (!confirmDelete) return;

    try {
      const promises = selectedSellers.map(sellerId =>
        fetch(`${API_URL}/api/admin/sellers/${sellerId}`, { method: 'DELETE' })
      );
      
      await Promise.all(promises);
      alert(`${selectedSellers.length} seller(s) deleted successfully!`);
      setSelectedSellers([]);
      setIsSelectionMode(false);
      fetchData();
    } catch (error) {
      console.error('Error in bulk delete:', error);
      alert('Error deleting sellers');
    }
  };

  // Bulk approve selected products
  const handleBulkApproveSelected = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to approve');
      return;
    }

    try {
      const promises = selectedProducts.map(productId =>
        fetch(`${API_URL}/api/admin/products/${productId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'approved' })
        })
      );
      
      await Promise.all(promises);
      alert(`${selectedProducts.length} product(s) approved successfully!`);
      setSelectedProducts([]);
      setIsSelectionMode(false);
      fetchData();
    } catch (error) {
      console.error('Error in bulk approve:', error);
      alert('Error approving products');
    }
  };

  // Bulk reject selected products
  const handleBulkRejectSelected = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select products to reject');
      return;
    }

    const reason = prompt('Enter rejection reason for selected products:');
    if (!reason) return;

    try {
      const promises = selectedProducts.map(productId =>
        fetch(`${API_URL}/api/admin/products/${productId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'rejected', rejectionReason: reason })
        })
      );
      
      await Promise.all(promises);
      alert(`${selectedProducts.length} product(s) rejected successfully!`);
      setSelectedProducts([]);
      setIsSelectionMode(false);
      fetchData();
    } catch (error) {
      console.error('Error in bulk reject:', error);
      alert('Error rejecting products');
    }
  };

  const handleProductApproval = async (productId, status, reason = rejectionReason) => {
    const finalReason = reason || rejectionReason;
    if (status === 'rejected' && !finalReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${productId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, rejectionReason: status === 'rejected' ? finalReason : undefined })
      });

      if (response.ok) {
        alert(`Product ${status} successfully!`);
        setRejectionReason('');
        fetchData();
      } else {
        alert('Failed to update product status');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Error updating product status');
    }
  };

  const handleBulkAction = async (action, reason = '') => {
    if (action === 'rejected' && !reason.trim()) {
      alert('Please provide a reason for bulk rejection');
      return;
    }

    try {
      const promises = pendingProducts.map(product => handleProductApproval(product._id, action, reason));
      await Promise.all(promises);
      alert(`All products ${action} successfully!`);
      fetchData();
    } catch (error) {
      console.error('Error in bulk action:', error);
      alert('Error in bulk action');
    }
  };

  const viewSellerProducts = async (sellerId) => {
    try {
      const response = await fetch(`${API_URL}/api/admin/sellers/${sellerId}/products`);
      const products = await response.json();
      setSellerProducts(products);
      setSelectedSeller(sellerId);
    } catch (error) {
      console.error('Error fetching seller products:', error);
      alert('Failed to load seller products');
    }
  };

  const handleDeleteSeller = async (sellerId, businessName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete the seller "${businessName}"? This action cannot be undone and will also delete all their products.`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/sellers/${sellerId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert(`Seller "${businessName}" and all their products have been deleted successfully!`);
        fetchData();
      } else {
        const errorData = await response.json();
        alert(`Failed to delete seller: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting seller:', error);
      alert('Error deleting seller. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#4CAF50';
      case 'rejected': return '#f44336';
      case 'pending': return '#FF9800';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  const sellerTabs = [
    { key: 'pending', label: `Pending Product Approvals (${pendingProducts.length})` },
    { key: 'approved', label: `Approved Sellers (${sellers.filter(s => s.status === 'active' || s.status === 'approved').length})` },
    { key: 'rejected', label: `Rejected Sellers (${sellers.filter(s => s.status === 'rejected').length})` },
    { key: 'all', label: `All Sellers (${sellers.length})` }
  ];

  let filteredSellers = sellers;
  if (activeTab === 'pending') {
    filteredSellers = sellers.filter(s => s.status === 'pending');
  } else if (activeTab === 'approved') {
    filteredSellers = sellers.filter(s => s.status === 'active' || s.status === 'approved');
  } else if (activeTab === 'rejected') {
    filteredSellers = sellers.filter(s => s.status === 'rejected');
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🛒</span>
          ShopNest Admin - Seller Management
        </div>
        <button style={styles.backButton} onClick={() => navigateTo('admin-dashboard')}>
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.tabs}>
          {sellerTabs.map(tab => (
            <button
              key={tab.key}
              style={activeTab === tab.key ? styles.activeTab : styles.tab}
              onClick={() => {
                setActiveTab(tab.key);
                setIsSelectionMode(false);
                setSelectedSellers([]);
                setSelectedProducts([]);
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'pending' ? (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Pending Product Approvals ({pendingProducts.length})</h2>
              {/* ⭐ SELECT BUTTON for Products */}
              {pendingProducts.length > 0 && (
                <button
                  style={isSelectionMode ? styles.cancelSelectButton : styles.selectButton}
                  onClick={toggleSelectionMode}
                >
                  {isSelectionMode ? '✕ Cancel Selection' : '☑ Select'}
                </button>
              )}
            </div>

            {pendingProducts.length === 0 ? (
              <div style={styles.emptyState}><p>No pending products to review.</p></div>
            ) : (
              <>
                {/* Show selection controls ONLY in selection mode */}
                {isSelectionMode && (
                  <div style={styles.selectionControls}>
                    <label style={styles.selectAllLabel}>
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === pendingProducts.length && pendingProducts.length > 0}
                        onChange={toggleSelectAllProducts}
                        style={styles.checkbox}
                      />
                      <span>Select All ({selectedProducts.length} selected)</span>
                    </label>
                    {selectedProducts.length > 0 && (
                      <div style={styles.bulkActionsSelected}>
                        <button style={styles.bulkApproveButton} onClick={handleBulkApproveSelected}>
                          ✓ Approve Selected ({selectedProducts.length})
                        </button>
                        <button style={styles.bulkRejectButton} onClick={handleBulkRejectSelected}>
                          ✕ Reject Selected ({selectedProducts.length})
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Regular bulk actions (always visible) */}
                {!isSelectionMode && (
                  <div style={styles.bulkActions}>
                    <button style={styles.bulkApproveButton} onClick={() => handleBulkAction('approved')}>
                      Approve All
                    </button>
                    <button
                      style={styles.bulkRejectButton}
                      onClick={() => {
                        const reason = prompt('Enter rejection reason for all products:');
                        if (reason) handleBulkAction('rejected', reason);
                      }}
                    >
                      Reject All
                    </button>
                  </div>
                )}

                <div style={styles.productGrid}>
                  {pendingProducts.map(product => (
                    <div 
                      key={product._id} 
                      style={{
                        ...styles.productCard,
                        ...(isSelectionMode && selectedProducts.includes(product._id) ? styles.selectedCard : {})
                      }}
                    >
                      {/* ⭐ Checkbox ONLY appears in selection mode */}
                      {isSelectionMode && (
                        <div style={styles.cardCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product._id)}
                            onChange={() => toggleProductSelection(product._id)}
                            style={styles.checkbox}
                          />
                        </div>
                      )}
                      
                      <img
                        src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`) : 'https://via.placeholder.com/200x150?text=No+Image'}
                        alt={product.name}
                        style={styles.productImage}
                        onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Img'}
                      />
                      <div style={styles.productInfo}>
                        <h4 style={styles.productName}>{product.name}</h4>
                        <p style={styles.productCategory}>Category: {product.category}</p>
                        <p style={styles.productVendor}>Vendor: {product.vendor}</p>
                        <p style={styles.productPrice}>₹{product.price}</p>
                        <p style={styles.productStock}>Stock: {product.stock}</p>
                        <p style={{ color: getStatusColor(product.status) }}>
                          Status: {product.status}
                        </p>
                        {!isSelectionMode && (
                          <div style={styles.buttonGroup}>
                            <button
                              style={styles.approveButton}
                              onClick={() => handleProductApproval(product._id, 'approved')}
                            >
                              Approve
                            </button>
                            <button
                              style={styles.rejectButton}
                              onClick={() => {
                                const reason = prompt('Enter rejection reason:');
                                if (reason) handleProductApproval(product._id, 'rejected', reason);
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                {sellerTabs.find(t => t.key === activeTab)?.label.replace(/\(.*\)/, '')} Sellers
              </h2>
              {/* ⭐ SELECT BUTTON for Sellers */}
              {filteredSellers.length > 0 && (
                <button
                  style={isSelectionMode ? styles.cancelSelectButton : styles.selectButton}
                  onClick={toggleSelectionMode}
                >
                  {isSelectionMode ? '✕ Cancel Selection' : '☑ Select'}
                </button>
              )}
            </div>
            
            {/* Selection controls ONLY in selection mode */}
            {isSelectionMode && filteredSellers.length > 0 && (
              <div style={styles.selectionControls}>
                <label style={styles.selectAllLabel}>
                  <input
                    type="checkbox"
                    checked={selectedSellers.length === filteredSellers.length && filteredSellers.length > 0}
                    onChange={toggleSelectAllSellers}
                    style={styles.checkbox}
                  />
                  <span>Select All ({selectedSellers.length} selected)</span>
                </label>
                {selectedSellers.length > 0 && (
                  <button style={styles.bulkDeleteButton} onClick={handleBulkDeleteSellers}>
                    🗑 Delete Selected ({selectedSellers.length})
                  </button>
                )}
              </div>
            )}

            <div style={styles.sellerGrid}>
              {filteredSellers.length === 0 ? (
                <div style={styles.emptyState}><p>No sellers found for this status.</p></div>
              ) : (
                filteredSellers.map(seller => (
                  <div 
                    key={seller._id} 
                    style={{
                      ...styles.sellerCard,
                      ...(isSelectionMode && selectedSellers.includes(seller._id) ? styles.selectedCard : {})
                    }}
                  >
                    {/* ⭐ Checkbox ONLY appears in selection mode */}
                    {isSelectionMode && (
                      <div style={styles.cardCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedSellers.includes(seller._id)}
                          onChange={() => toggleSellerSelection(seller._id)}
                          style={styles.checkbox}
                        />
                      </div>
                    )}
                    
                    <h3 style={styles.sellerName}>{seller.fullname}</h3>
                    <p style={styles.sellerEmail}>{seller.email}</p>
                    <p style={styles.sellerBusiness}>Business: {seller.businessName}</p>
                    <p style={styles.sellerType}>Type: {seller.businessType}</p>
                    <div style={styles.sellerStats}>
                      <span style={styles.statItem}>Phone: {seller.phone || 'N/A'}</span>
                      <span style={styles.statItem}>Status: <span style={{ color: getStatusColor(seller.status) }}>{seller.status}</span></span>
                    </div>
                    {!isSelectionMode && (
                      <div style={styles.buttonGroup}>
                        <button
                          style={styles.viewProductsButton}
                          onClick={() => viewSellerProducts(seller._id)}
                        >
                          View Products
                        </button>
                        <button
                          style={styles.deleteButton}
                          onClick={() => handleDeleteSeller(seller._id, seller.businessName)}
                        >
                          Delete Seller
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {selectedSeller && sellerProducts.length > 0 && (
          <div style={styles.sellerProductsSection}>
            <h3 style={styles.subSectionTitle}>
              Products from {sellers.find(s => s._id === selectedSeller)?.businessName}
            </h3>
            <div style={styles.productGrid}>
              {sellerProducts.map(product => (
                <div key={product._id} style={styles.productCard}>
                  <img
                    src={product.image ? (product.image.startsWith('http') ? product.image : `http://localhost:5000/uploads/${product.image}`) : 'https://via.placeholder.com/200x150?text=No+Image'}
                    alt={product.name}
                    style={styles.productImage}
                    onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Img'}
                  />
                  <div style={styles.productInfo}>
                    <h4 style={styles.productName}>{product.name}</h4>
                    <p style={styles.productCategory}>Category: {product.category}</p>
                    <p style={styles.productPrice}>₹{product.price}</p>
                    <p style={styles.productStock}>Stock: {product.stock}</p>
                    <p style={{ color: getStatusColor(product.status) }}>
                      Status: {product.status}
                    </p>
                    {product.status === 'pending' && (
                      <div style={styles.buttonGroup}>
                        <button
                          style={styles.approveButton}
                          onClick={() => handleProductApproval(product._id, 'approved')}
                        >
                          Approve
                        </button>
                        <button
                          style={styles.rejectButton}
                          onClick={() => {
                            const reason = prompt('Enter rejection reason:');
                            if (reason) handleProductApproval(product._id, 'rejected', reason);
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  },
  header: {
    backgroundColor: '#4a90e2',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    marginRight: '10px'
  },
  backButton: {
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  content: {
    maxWidth: '1200px',
    margin: '20px auto',
    padding: '0 20px'
  },
  tabs: {
    display: 'flex',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  tab: {
    padding: '10px 20px',
    backgroundColor: '#e0e0e0',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '5px',
    marginBottom: '5px'
  },
  activeTab: {
    padding: '10px 20px',
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    marginRight: '5px',
    marginBottom: '5px'
  },
  section: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  // ⭐ NEW: Section header with button
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  sectionTitle: {
    color: '#333',
    margin: 0
  },
  // ⭐ NEW: Select button
  selectButton: {
    backgroundColor: '#4a90e2',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  cancelSelectButton: {
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px',
    color: '#666'
  },
  selectionControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    borderRadius: '5px',
    marginBottom: '20px',
    border: '2px solid #4a90e2'
  },
  selectAllLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer'
  },
  cardCheckbox: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    zIndex: 10,
    backgroundColor: 'white',
    padding: '5px',
    borderRadius: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  selectedCard: {
    border: '3px solid #4a90e2',
    backgroundColor: '#e3f2fd'
  },
  bulkActionsSelected: {
    display: 'flex',
    gap: '10px'
  },
  bulkDeleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  productGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  productCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    overflow: 'hidden',
    backgroundColor: 'white',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  productImage: {
    width: '100%',
    height: '200px',
    objectFit: 'cover'
  },
  productInfo: {
    padding: '15px'
  },
  productName: {
    margin: '0 0 10px 0',
    color: '#333',
    fontSize: '18px'
  },
  productVendor: {
    margin: '5px 0',
    color: '#666',
    fontSize: '14px'
  },
  productCategory: {
    margin: '5px 0',
    color: '#666',
    fontSize: '14px'
  },
  productPrice: {
    margin: '5px 0',
    color: '#4CAF50',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  productStock: {
    margin: '5px 0',
    color: '#666',
    fontSize: '14px'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '15px'
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  },
  rejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  },
  sellerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  sellerCard: {
    border: '1px solid #ddd',
    borderRadius: '10px',
    padding: '20px',
    backgroundColor: 'white',
    position: 'relative',
    transition: 'all 0.3s ease'
  },
  sellerName: {
    margin: '0 0 10px 0',
    color: '#333'
  },
  sellerEmail: {
    margin: '5px 0',
    color: '#666',
    fontSize: '14px'
  },
  sellerBusiness: {
    margin: '5px 0',
    color: '#666',
    fontSize: '14px'
  },
  sellerType: {
    margin: '5px 0',
    color: '#666',
    fontSize: '14px'
  },
  sellerStats: {
    margin: '15px 0',
    display: 'flex',
    justifyContent: 'space-between'
  },
  statItem: {
    fontSize: '12px',
    color: '#666'
  },
  viewProductsButton: {
    backgroundColor: '#2196F3',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  },
  sellerProductsSection: {
    marginTop: '30px',
    paddingTop: '20px',
    borderTop: '1px solid #eee'
  },
  subSectionTitle: {
    color: '#333',
    marginBottom: '20px'
  },
  bulkActions: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px'
  },
  bulkApproveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  bulkRejectButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default AdminSellerManagement;