import React, { useState, useEffect } from 'react';
import './VendorStore.css';

const VendorStore = ({ vendorName, vendor, sellerId, onViewProduct, onAddToCart, onToggleWishlist, wishlistItems, cartItems, navigateTo }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Handle both vendor and vendorName props
  const finalVendorName = vendorName || vendor;

  useEffect(() => {
    const fetchVendorProducts = async () => {
      console.log('🔍 VendorStore Props:', { vendorName, vendor, sellerId, finalVendorName });
      
      if (!finalVendorName && !sellerId) {
        console.log('❌ No vendor name or seller ID provided');
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      
      try {
        let url;
        if (sellerId) {
          url = `${process.env.REACT_APP_API_URL}/api/products?sellerId=${sellerId}`;
          console.log('📡 Fetching by sellerId:', sellerId);
        } else {
          url = `${process.env.REACT_APP_API_URL}/api/products`;
          console.log('📡 Fetching all products to filter by vendor:', finalVendorName);
        }
        
        console.log('📡 Full URL:', url);
        const res = await fetch(url);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        let data = await res.json();
        console.log('📦 Raw data received:', data.length, 'products');
        console.log('📦 First product:', data[0]);
        
        if (!sellerId && finalVendorName) {
          const beforeFilter = data.length;
          data = data.filter(p => {
            const vendorMatch = p.vendor && p.vendor.toLowerCase().includes(finalVendorName.toLowerCase());
            const statusMatch = p.status === 'approved' || p.status === 'active';
            console.log(`Product: ${p.name}, Vendor: ${p.vendor}, Status: ${p.status}, VendorMatch: ${vendorMatch}, StatusMatch: ${statusMatch}`);
            return vendorMatch && statusMatch;
          });
          console.log(`📦 Filtered from ${beforeFilter} to ${data.length} products for vendor: "${finalVendorName}"`);
        }
        
        const fetchedProducts = Array.isArray(data) ? data : [];
        console.log('📦 Final products to display:', fetchedProducts.length);
        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('❌ Error fetching vendor products:', err);
        setError('Unable to load vendor products: ' + err.message);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorProducts();
  }, [finalVendorName, sellerId]);

  const getImageSrc = (image) => {
    if (!image) return 'https://via.placeholder.com/200x150?text=No+Image';
    if (image.startsWith('http')) return image;
    if (image.includes('-') && /^\d+-/.test(image)) return `${process.env.REACT_APP_API_URL}/uploads/${image}`;
    return `/IMAGES/${image}`;
  };

  const handleVisitSellerDashboard = () => {
    if (sellerId) {
      console.log('Visiting seller dashboard for sellerId:', sellerId);
      window.dispatchEvent(new CustomEvent('visitSellerDashboard', { detail: { sellerId } }));
    } else {
      alert('Seller information not available');
    }
  };

  return (
    <div className="vendor-store-page container">
      <div className="vendor-store-header">
        <div className="header-top">
          <div>
            <h2>{finalVendorName || 'Vendor Store'}</h2>
            <p>Products by {finalVendorName}</p>
          </div>
          <button onClick={handleVisitSellerDashboard} className="visit-seller-btn">
            <i className="fas fa-tachometer-alt"></i> Visit Seller Dashboard
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading products...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="no-products">
          No products available for this vendor.
        </div>
      )}

      <div className="vendor-products-grid">
        {products.map(p => (
          <div key={p._id || p.id} className="vendor-product-card">
            <img 
              src={getImageSrc(p.image)} 
              alt={p.name} 
              onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Image'} 
            />
            <div className="vendor-product-body">
              <h4>{p.name}</h4>
              <p className="vendor-product-vendor">by {p.vendor}</p>
              <div className="vendor-product-price">₹{p.price?.toLocaleString()}</div>
              
              {p.status && p.status !== 'approved' && p.status !== 'active' && (
                <div className={`product-status-badge ${p.status}`}>
                  {p.status === 'pending' ? '⏳ Pending Approval' : 
                   p.status === 'rejected' ? '❌ Rejected' : p.status}
                </div>
              )}
              
              <div className="vendor-product-actions">
                <button onClick={() => onViewProduct && onViewProduct(p)} className="btn">View</button>
                <button onClick={() => onAddToCart && onAddToCart(p)} className="btn secondary">Add to Cart</button>
                <button 
                  onClick={() => onToggleWishlist && onToggleWishlist(p)} 
                  className={`wishlist ${wishlistItems && wishlistItems.find(i => (i._id || i.id) === (p._id || p.id)) ? 'active' : ''}`}
                >
                  ♥
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorStore;