import React from 'react';

const WishlistPage = ({ wishlistItems, onAddToCart, onToggleWishlist, navigateTo, cartItems }) => {
  if (!wishlistItems || wishlistItems.length === 0) {
    return (
      <div className="wishlist-container empty-wishlist">
        <div className="section-title">
            <h2>Your Wishlist</h2>
        </div>
        <p>Your wishlist is empty. Add items you love to your wishlist to see them here.</p>
        <button className="btn" onClick={() => navigateTo('home')}>Continue Shopping</button>
      </div>
    );
  }

  const handleMoveToCart = (item) => {
    onAddToCart(item);
    // Do not remove from wishlist; keep it there
  };

  return (
    <section className="section wishlist-section">
      <div className="container">
        <div className="section-title">
          <h2>Your Wishlist</h2>
        </div>
        <div className="wishlist-container">
          <div id="wishlist-items">
            {wishlistItems.map(item => {
              const isInCart = cartItems.some(cartItem => (cartItem._id || cartItem.id) === (item._id || item.id));
              return (
                <div key={item.id} className="wishlist-item">
                  <div className="cart-item-details" style={{ flexGrow: 1 }}>
                    <img src={item.image.startsWith('http') ? item.image : `/IMAGES/${item.image}`} alt={item.name} onClick={() => navigateTo('productDetail', item)} style={{cursor: 'pointer'}} />
                    <span onClick={() => navigateTo('productDetail', item)} style={{cursor: 'pointer'}}>{item.name} - {item.vendor}</span>
                  </div>
                  <div className="wishlist-item-actions">
                    {isInCart ? (
                      <button className="btn btn-primary action-btn" onClick={() => navigateTo('cart')} title="Go to Cart">
                        <i className="fas fa-shopping-cart"></i> Go to Cart
                      </button>
                    ) : (
                      <button className="btn btn-primary action-btn" onClick={() => handleMoveToCart(item)} title="Move to Cart">
                        <i className="fas fa-cart-plus"></i> Move to Cart
                      </button>
                    )}
                    <button className="btn btn-danger action-btn" onClick={() => onToggleWishlist(item)} title="Remove from Wishlist"><i className="fas fa-trash-alt"></i></button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WishlistPage;