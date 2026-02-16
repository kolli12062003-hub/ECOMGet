import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SportsAndFitness.css';

const SportsAndFitness = () => {
  const [products, setProducts] = useState([
    {
      id: 1901,
      name: "Treadmill",
      price: 24999,
      vendor: "FitGear",
      image: "IMAGES/Treadmill.jpg",
      distance: "Within 3 km"
    },
    {
      id: 1902,
      name: "Yoga Mat",
      price: 999,
      vendor: "Zen Fitness",
      image: "IMAGES/Yoga Mat.jpg",
      distance: "Within 4 km"
    },
    {
      id: 1903,
      name: "Dumbbell Set",
      price: 2999,
      vendor: "PowerLift",
      image: "IMAGES/Dumbbell Set.jpg",
      distance: "Within 2 km"
    },
    {
      id: 1904,
      name: "Resistance Bands",
      price: 799,
      vendor: "FitGear",
      image: "IMAGES/Resistance Bands.jpg",
      distance: "Within 5 km"
    },
    {
      id: 1905,
      name: "Stationary Bike",
      price: 14999,
      vendor: "CycleWorks",
      image: "IMAGES/Stationary Bike.jpg",
      distance: "Within 6 km"
    },
    // Add more products here
  ]);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {
    // Load cart and wishlist from localStorage on component mount
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(savedCart);
    setWishlist(savedWishlist);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const toggleWishlist = (product) => {
    const isInWishlist = wishlist.some(item => item.id === product.id);
    let updatedWishlist;
    
    if (isInWishlist) {
      updatedWishlist = wishlist.filter(item => item.id !== product.id);
    } else {
      updatedWishlist = [...wishlist, product];
    }
    
    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.vendor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } else {
      alert('Speech recognition is not supported in your browser.');
    }
  };

  return (
    <section id="sports" className="section">
      <div className="container">
        <div className="section-title">
          <h2>Sports and Fitness</h2>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for products..."
            value={searchQuery}
            onChange={handleSearch}
          />
          <div className="search-buttons">
            <button className="search-btn">
              <i className="fas fa-search"></i>
            </button>
            <button 
              className={`mic-btn ${isRecording ? 'active' : ''}`}
              onClick={startVoiceSearch}
            >
              <i className="fas fa-microphone"></i>
            </button>
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <div className="no-results">
              <h3>No products found</h3>
              <p>Try adjusting your search terms or browse all products.</p>
            </div>
          ) : (
            filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://via.placeholder.com/200x200?text=${product.name.replace(' ', '+')}`;
                  }}
                />
                <div className="product-info">
                  <h3 className="product-title">{product.name}</h3>
                  <div className="product-vendor">
                    <i className="fas fa-store"></i>
                    <span>{product.vendor}</span>
                  </div>
                  <div className="product-distance">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{product.distance}</span>
                  </div>
                  <div className="product-price">₹{product.price.toLocaleString()}</div>
                  <div className="product-actions">
                    <button
                      className="like-btn"
                      onClick={() => toggleWishlist(product)}
                    >
                      <i className={`${wishlist.some(item => item.id === product.id) ? 'fas' : 'far'} fa-heart`}></i>
                    </button>
                    {cart.some(item => item.id === product.id) ? (
                      <Link to="/cart" className="btn go-to-cart">
                        Go to Cart
                      </Link>
                    ) : (
                      <button
                        className="btn add-to-cart"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default SportsAndFitness;