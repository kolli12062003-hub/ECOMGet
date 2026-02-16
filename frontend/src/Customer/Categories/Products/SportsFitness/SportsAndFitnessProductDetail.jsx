import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import '../styles/ProductDetail.css';

const allProducts = {
  1901: { id: 1901, name: "Treadmill", price: 24999, vendor: "FitGear", image: "Treadmill.jpg", type: "Cardio", material: "Steel", color: "Black", otherImages: ["Treadmill1.jpg", "Treadmill2.jpg", "Treadmill3.jpg"], lat: 17.4486, lon: 78.3908 },
  1902: { id: 1902, name: "Yoga Mat", price: 999, vendor: "Zen Fitness", image: "Yoga Mat.jpg", type: "Yoga", material: "TPE", color: "Blue", otherImages: ["Yoga Mat1.jpg", "Yoga Mat2.jpg", "Yoga Mat3.jpg"], lat: 17.4512, lon: 78.3855 },
  // ... Add all other products here
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [offers, setOffers] = useState([]);
  const [distance, setDistance] = useState('Calculating...');
  const [relatedProducts, setRelatedProducts] = useState([]);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  useEffect(() => {
    // Load product details
    const currentProduct = allProducts[id];
    if (currentProduct) {
      setProduct(currentProduct);
      setMainImage(`IMAGES/${currentProduct.image}`);
      document.title = currentProduct.name;
      
      console.log('🔍 SportsAndFitnessProductDetail - Rendering product:', currentProduct.name);
      console.log('🛡️ Warranty:', currentProduct.warranty);
      console.log('📅 Expiry:', currentProduct.expiryDate);
      
      // Set related products
      const related = Object.values(allProducts)
        .filter(p => p.id !== currentProduct.id)
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setRelatedProducts(related);
    }

    // Load cart and wishlist from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    setCart(savedCart);
    setWishlist(savedWishlist);

    // Calculate distance
    updateDistance();

    // Fetch offers (mock implementation)
    fetchOffers();
  }, [id]);

  const fetchOffers = async () => {
    try {
      // Mock API call - replace with actual API call
      const mockOffers = [];
      setOffers(mockOffers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const updateDistance = () => {
    if (navigator.geolocation && product) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const distance = getDistanceFromLatLonInKm(
            position.coords.latitude,
            position.coords.longitude,
            product.lat,
            product.lon
          );
          setDistance(`${distance.toFixed(1)} km away`);
        },
        () => setDistance('Location not available')
      );
    } else {
      setDistance('Location not available');
    }
  };

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const deg2rad = deg => deg * (Math.PI / 180);

  const addToCart = () => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} has been added to your cart.`);
  };

  const toggleWishlist = () => {
    const updatedWishlist = [...wishlist];
    const existingIndex = updatedWishlist.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      updatedWishlist.splice(existingIndex, 1);
      alert(`${product.name} removed from wishlist.`);
    } else {
      updatedWishlist.push(product);
      alert(`${product.name} added to wishlist.`);
    }

    setWishlist(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
  };

  const calculateDiscountedPrice = (originalPrice) => {
    let bestDiscountedPrice = originalPrice;
    let discountText = '';

    offers.forEach(offer => {
      if (offer.appliesTo && 
          (offer.appliesTo.toLowerCase().includes('sports_fitness') || 
           offer.appliesTo.toLowerCase().includes('all')) && 
          originalPrice >= (offer.minOrder || 0)) {
        let currentDiscountedPrice = originalPrice;
        let currentDiscountText = '';

        if (offer.type === 'percent' && offer.value > 0) {
          currentDiscountedPrice = originalPrice - (originalPrice * (offer.value / 100));
          currentDiscountText = `${offer.value}% off`;
        } else if (offer.type === 'flat' && offer.value > 0 && offer.value < originalPrice) {
          currentDiscountedPrice = originalPrice - offer.value;
          currentDiscountText = `₹${offer.value} off`;
        }

        if (currentDiscountedPrice < bestDiscountedPrice) {
          bestDiscountedPrice = currentDiscountedPrice;
          discountText = currentDiscountText;
        }
      }
    });

    return {
      originalPrice,
      discountedPrice: Math.round(bestDiscountedPrice),
      discountText
    };
  };

  if (!product) {
    return (
      <div className="container">
        <h1>Product not found</h1>
      </div>
    );
  }

  const priceDetails = calculateDiscountedPrice(product.price);

  return (
    <div className="container">
      <Link to="/sports-fitness" className="back-link">
        ← Back to Sports & Fitness
      </Link>
      
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img src={mainImage} alt={product.name} />
          </div>
          <div className="thumbnail-track">
            {[product.image, ...(product.otherImages || [])].map((img, index) => (
              <img
                key={index}
                src={`IMAGES/${img}`}
                alt={`${product.name} view ${index + 1}`}
                className={`thumbnail ${mainImage === `IMAGES/${img}` ? 'active' : ''}`}
                onClick={() => setMainImage(`IMAGES/${img}`)}
              />
            ))}
          </div>
        </div>

        <div className="product-details">
          <h1>{product.name}</h1>
          <p className="product-vendor">by {product.vendor}</p>
          
          <div className="product-price">
            {priceDetails.discountText && (
              <>
                <span className="original-price">₹{priceDetails.originalPrice.toLocaleString()}</span>
                <span className="discounted-price">₹{priceDetails.discountedPrice.toLocaleString()}</span>
                <span className="discount-badge">{priceDetails.discountText}</span>
              </>
            )}
            {!priceDetails.discountText && (
              `₹${priceDetails.originalPrice.toLocaleString()}`
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || `This is a high-quality ${product.name.toLowerCase()} that you will surely love. It is durable, stylish, and perfect for your fitness journey.`}</p>
          </div>

          {product.warranty && (
            <div className="product-warranty" style={{
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#e8f5e9',
              borderLeft: '4px solid #4CAF50',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#2e7d32' }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i>
                Warranty:
              </strong>
              <span style={{ marginLeft: '8px', color: '#555' }}>{product.warranty}</span>
            </div>
          )}

          {product.expiryDate && (
            <div className="product-expiry" style={{
              marginTop: '15px',
              padding: '12px',
              backgroundColor: '#fff3e0',
              borderLeft: '4px solid #ff9800',
              borderRadius: '4px'
            }}>
              <strong style={{ color: '#e65100' }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '8px' }}></i>
                Expiry Date:
              </strong>
              <span style={{ marginLeft: '8px', color: '#555' }}>{formatDate(product.expiryDate)}</span>
            </div>
          )}

          <div className="product-distance">
            <i className="fas fa-map-marker-alt"></i>
            <span>{distance}</span>
          </div>

          <div className="product-specs">
            <h3>Specifications</h3>
            <div className="spec-grid">
              <div className="spec-item">
                <strong>Type</strong>
                <span>{product.type || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <strong>Material</strong>
                <span>{product.material || 'N/A'}</span>
              </div>
              <div className="spec-item">
                <strong>Color</strong>
                <span>{product.color || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="product-actions">
            {cart.some(item => item.id === product.id) ? (
              <Link to="/cart" className="btn go-to-cart">Go to Cart</Link>
            ) : (
              <button className="btn" onClick={addToCart}>Add to Cart</button>
            )}
            <button 
              className={`wishlist-heart-btn ${wishlist.some(item => item.id === product.id) ? 'active' : ''}`}
              onClick={toggleWishlist}
              title="Add to Wishlist"
            >
              <i className={`fa${wishlist.some(item => item.id === product.id) ? 's' : 'r'} fa-heart`}></i>
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h2>Related Products</h2>
          <div className="related-product-grid">
            {relatedProducts.map(related => {
              const relatedPriceDetails = calculateDiscountedPrice(related.price);
              return (
                <Link
                  key={related.id}
                  to={`/product/${related.id}`}
                  className="related-product-card"
                >
                  <img src={`IMAGES/${related.image}`} alt={related.name} />
                  <div className="related-product-info">
                    <div className="product-distance small">
                      <i className="fas fa-map-marker-alt"></i>
                      <span>Calculating...</span>
                    </div>
                    <h4>{related.name}</h4>
                    <p className="small">{related.vendor}</p>
                    <div className="product-price">
                      {relatedPriceDetails.discountText ? (
                        <>
                          <span className="original-price">₹{relatedPriceDetails.originalPrice.toLocaleString()}</span>
                          <span className="discounted-price">₹{relatedPriceDetails.discountedPrice.toLocaleString()}</span>
                          <span className="discount-badge">{relatedPriceDetails.discountText}</span>
                        </>
                      ) : (
                        `₹${relatedPriceDetails.originalPrice.toLocaleString()}`
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;