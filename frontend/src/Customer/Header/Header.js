import React, { useState } from 'react';

const Header = ({ cartItems, wishlistItems, onSearch, navigateTo, onLogout, currentUser }) => {
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const wishlistCount = wishlistItems.length;
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value); // Trigger search on every keystroke
  };

  // Clear search query when navigating away or clearing
  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    onLogout();
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNavigation = (page) => {
    clearSearch();
    navigateTo(page);
  };

  return (
    <header>
      <div className="container header-content">
        <div className="header-left">
          <div className="logo" onClick={() => navigateTo('home')}>
            <img src="https://cdn-icons-png.flaticon.com/512/3081/3081559.png" alt="ShopNest Logo" className="logo-img" />
            <span className="logo-text">ShopNest</span>
          </div>
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for products, services..."
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress} />
            <div className="search-buttons">
              <button className="search-btn" onClick={handleSearch}><i className="fas fa-search"></i></button>
              {searchQuery && (
                <button className="clear-btn" onClick={clearSearch} title="Clear Search">
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="header-actions">
          <a href="#wishlist" onClick={(e) => { e.preventDefault(); handleNavigation('wishlist'); }}><i className="fas fa-heart"></i> <span>Wishlist</span> <span className="wishlist-count">{wishlistCount}</span></a>
          <a href="#cart" onClick={(e) => { e.preventDefault(); handleNavigation('cart'); }}><i className="fas fa-shopping-cart"></i> <span>Cart</span> <span className="cart-count">{cartCount}</span></a>
          
          {currentUser.isAuthenticated ? (
            <div className="user-menu-container">
              <span className="user-greeting" onClick={toggleUserMenu} style={{cursor: 'pointer'}}>
                Hi, {currentUser.details.name} <i className={`fas fa-chevron-down ${isUserMenuOpen ? 'open' : ''}`}></i>
              </span>
              {isUserMenuOpen && (
                <div className="user-dropdown">
                  <a href="#profile" onClick={(e) => { e.preventDefault(); handleNavigation('profile'); }}>
                    <i className="fas fa-user-circle"></i> My Profile
                  </a>
                  <a href="#logout" onClick={handleLogoutClick}>
                    <i className="fas fa-sign-out-alt"></i> Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <a href="#login" onClick={(e) => { e.preventDefault(); handleNavigation('login'); }}><i className="fas fa-user"></i> <span>Login</span></a>
          )}

          
        </div>
      </div>
    </header>
  );
};

export default Header;