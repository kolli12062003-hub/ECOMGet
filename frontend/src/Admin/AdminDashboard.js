import React from 'react';

const AdminDashboard = ({ navigateTo, onLogout }) => {
  const dashboardCards = [
    {
      title: 'User Management',
      description: 'Manage user accounts, roles, and permissions.',
      link: 'admin-users',
      id: 1,
      icon: '👥'
    },
    {
      title: 'Manage User Profile',
      description: 'Update user profiles and personal information.',
      link: 'admin-profiles',
      id: 2,
      icon: '👤'
    },
    {
      title: 'Offers Management',
      description: 'Create and manage promotional offers and discounts.',
      link: 'admin-offers',
      id: 3,
      icon: '🎁'
    },
    {
      title: 'Payment Management',
      description: 'Monitor and manage payment transactions.',
      link: 'admin-orders',
      id: 4,
      icon: '💳'
    },
    {
      title: 'Product Management',
      description: 'Add, edit, or remove products from the marketplace.',
      link: 'admin-catalog',
      id: 5,
      icon: '📦'
    },
    {
      title: 'Seller Management',
      description: 'Manage sellers and review pending products for approval.',
      link: 'admin-sellers',
      id: 6,
      icon: '🏪'
    },
    {
      title: 'Earner Management',
      description: 'Review and approve seller registration requests from earners.',
      link: 'admin-earner-management',
      id: 7,
      icon: '⏳',
      badge: 'NEW'
    }
  ];

  const handleLogout = () => {
    if (onLogout) {
      onLogout(); // This will call the proper logout function from App.js
    } else {
      // Fallback if onLogout is not provided
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userId');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentUser');
      sessionStorage.clear();
      navigateTo('home');
    }
  };

  return (
    <div style={styles.body}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🛒</span>
          ShopNest Admin
        </div>
        <div style={styles.nav}>
          <button 
            style={styles.logoutButton}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#dc2626';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#ef4444';
              e.target.style.transform = 'scale(1)';
            }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div style={styles.dashboard}>
        <h1 style={styles.dashboardH1}>Admin Dashboard</h1>
        <hr style={styles.dashboardHr} />
        
        <div style={styles.cards}>
          {dashboardCards.map((card) => (
            <div key={card.id} style={styles.card}>
              <div style={styles.cardIconWrapper}>
                <span style={styles.cardIcon}>{card.icon}</span>
                {card.badge && (
                  <span style={styles.badge}>{card.badge}</span>
                )}
              </div>
              <h2 style={styles.cardH2}>{card.title}</h2>
              <p style={styles.cardP}>{card.description}</p>
              <button 
                style={styles.cardButton}
                onMouseOver={(e) => e.target.style.backgroundColor = '#e65b5b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#ff6b6b'}
                onClick={() => navigateTo(card.link)}
              >
                Go to {card.title}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  body: {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
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
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center'
  },
  logoIcon: {
    marginRight: '10px'
  },
  nav: {
    display: 'flex',
    alignItems: 'center'
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: '20px',
    fontSize: '18px'
  },
  logoutButton: {
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    padding: '10px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
  },
  dashboard: {
    maxWidth: '1200px',
    margin: '20px auto',
    textAlign: 'center',
    padding: '0 20px'
  },
  dashboardH1: {
    color: '#333',
    fontSize: '32px',
    marginBottom: '10px'
  },
  dashboardHr: {
    border: '1px solid #ff6b6b',
    width: '50px',
    margin: '0 auto 40px'
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    width: '250px',
    padding: '20px',
    textAlign: 'left',
    position: 'relative'
  },
  cardIconWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px'
  },
  cardIcon: {
    fontSize: '36px'
  },
  badge: {
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  cardH2: {
    color: '#2c3e50',
    fontSize: '20px',
    marginBottom: '10px'
  },
  cardP: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '20px'
  },
  cardButton: {
    backgroundColor: '#ff6b6b',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s'
  }
};

export default AdminDashboard;