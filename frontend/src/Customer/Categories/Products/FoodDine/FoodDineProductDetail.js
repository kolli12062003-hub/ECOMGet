import React, { useState, useEffect, useMemo, useCallback } from 'react';
import './ProductDetail2.css';

const FoodDineProductDetail = ({ product, onAddToCart, onToggleWishlist, cartItems, wishlistItems, navigateTo, onViewProduct }) => {
    // Handle image source - check for uploaded files (with timestamps) vs static images
    const getImageSrc = (image) => {
        if (!image) {
            return 'https://via.placeholder.com/200x150?text=No+Image';
        }
        // Check if image is an uploaded file (contains timestamp)
        if (image.includes('-')) {
            return `http://localhost:5000/uploads/${image}`;
        }
        // Otherwise, it's a static image
        return `/IMAGES/${image}`;
    };

    const [mainImage, setMainImage] = useState('');
    const [productWithDistance, setProductWithDistance] = useState(product);
    const [relatedProductsWithDistance, setRelatedProductsWithDistance] = useState([]);
    const [allFoodProducts, setAllFoodProducts] = useState([]); // ✅ NEW STATE

    // ✅ DISTANCE CALCULATION HELPER
    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // ✅ FETCH ALL FOOD PRODUCTS FROM BACKEND
    useEffect(() => {
        const fetchFoodProducts = async () => {
            try {
                console.log('🍕 Fetching Food & Dining products for related...');
                const response = await fetch('http://localhost:5000/api/products/category/Food%20%26%20Dining');
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Fetched', data.length, 'Food & Dining products');
                    setAllFoodProducts(data);
                } else {
                    console.error('❌ Failed to fetch food products:', response.status);
                }
            } catch (error) {
                console.error('❌ Error fetching food products:', error);
            }
        };
        fetchFoodProducts();
    }, []);

    useEffect(() => {
        if (product) {
            setMainImage(getImageSrc(product.image));
            console.log('🔍 FoodDineProductDetail - Rendering product:', product.name);
            console.log('📦 Product category:', product.category);
        }
        window.scrollTo(0, 0);
    }, [product]);

    // ✅ CALCULATE DISTANCE FOR MAIN PRODUCT AND RELATED PRODUCTS
    useEffect(() => {
        if (!product || allFoodProducts.length === 0) {
            console.log('⏳ Waiting for product or food products...');
            return;
        }

        console.log('🎯 Starting distance calculation...');
        console.log('   Product:', product.name);
        console.log('   Available products:', allFoodProducts.length);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    console.log('📍 User location:', userLat, userLon);

                    // Calculate distance for main product
                    if (product.lat && product.lon) {
                        const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                        setProductWithDistance({ 
                            ...product, 
                            distance: `${distance.toFixed(1)} km away` 
                        });
                    } else {
                        setProductWithDistance({ ...product, distance: 'Distance N/A' });
                    }

                    // ✅ Calculate distance for related products
                    const related = allFoodProducts
                        .filter(p => {
                            const pId = p._id || p.id;
                            const prodId = product._id || product.id;
                            return pId !== prodId; // Exclude current product
                        })
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);

                    console.log('🔗 Found', related.length, 'related products');

                    const relatedWithDistance = related.map(p => {
                        if (p.lat && p.lon) {
                            const distance = getDistanceFromLatLonInKm(userLat, userLon, p.lat, p.lon);
                            return { 
                                ...p, 
                                distance: `${distance.toFixed(1)} km away` 
                            };
                        }
                        return { ...p, distance: 'Distance N/A' };
                    });
                    
                    setRelatedProductsWithDistance(relatedWithDistance);
                    console.log('✅ Related products with distance set:', relatedWithDistance.length);
                },
                (error) => {
                    console.warn('⚠️ Geolocation error:', error.message);
                    setProductWithDistance({ ...product, distance: 'Within 5km' });
                    
                    // Get related products without distance
                    const related = allFoodProducts
                        .filter(p => {
                            const pId = p._id || p.id;
                            const prodId = product._id || product.id;
                            return pId !== prodId;
                        })
                        .sort(() => 0.5 - Math.random())
                        .slice(0, 4);
                    
                    setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Within 5km' })));
                    console.log('✅ Related products set (no geolocation):', related.length);
                }
            );
        } else {
            console.warn("⚠️ Geolocation not supported");
            setProductWithDistance({ ...product, distance: 'Distance N/A' });
            
            // Get related products without distance
            const related = allFoodProducts
                .filter(p => {
                    const pId = p._id || p.id;
                    const prodId = product._id || product.id;
                    return pId !== prodId;
                })
                .sort(() => 0.5 - Math.random())
                .slice(0, 4);
            
            setRelatedProductsWithDistance(related.map(p => ({ ...p, distance: 'Distance N/A' })));
            console.log('✅ Related products set (no browser support):', related.length);
        }
    }, [product, allFoodProducts, getDistanceFromLatLonInKm]);

    const isInCart = useMemo(() => cartItems.some(item => (item._id || item.id) === (product?._id || product?.id)), [cartItems, product]);
    const isInWishlist = useMemo(() => wishlistItems.some(item => (item._id || item.id) === (product._id || product.id)), [wishlistItems, product]);

    const thumbnailImages = useMemo(() => {
        if (!product) return [];
        const images = [getImageSrc(product.image)];
        if (product.otherImages && product.otherImages.length > 0) {
            return images.concat(product.otherImages.map(img => getImageSrc(img)));
        }
        return images;
    }, [product]);

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    if (!product) {
        return (
            <div className="container">
                <h1>Product not found</h1>
                <a href="#home" onClick={(e) => { e.preventDefault(); navigateTo('home'); }} className="back-link">&larr; Back to Home</a>
            </div>
        );
    }

    console.log('🎨 Rendering UI - Related products count:', relatedProductsWithDistance.length);

    return (
        <div className="container">
            <a 
                href="#back" 
                onClick={(e) => { e.preventDefault(); navigateTo('food-products', { vendor: product.vendor }); }} 
                className="back-link"
            >
                &larr; Back to {product.vendor}
            </a>
            
            <div className="product-detail-container">
                <div className="product-images">
                    <div className="main-image">
                        <img id="main-product-image" src={mainImage} alt={product.name} />
                    </div>
                    <div className="thumbnail-track">
                        {thumbnailImages.map((imgSrc, index) => (
                            <img
                                key={index}
                                src={imgSrc}
                                alt={`${product.name} thumbnail ${index + 1}`}
                                className={`thumbnail ${mainImage === imgSrc ? 'active' : ''}`}
                                onClick={() => setMainImage(imgSrc)}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/80x80?text=No+Img'}
                            />
                        ))}
                    </div>
                </div>

                <div className="product-details">
                    <h1>{product.name}</h1>
                    <p className="product-vendor">by {product.vendor}</p>
                    <div className="product-price-section">
                        {productWithDistance.discountedPrice ? (
                            <>
                                {/* Original Price - Struck Through */}
                                <div className="product-original-price">₹{productWithDistance.originalPrice}</div>

                                {/* Discounted Price - Prominent */}
                                <div className="product-price discounted">₹{productWithDistance.discountedPrice}</div>

                                {/* Offer Badge */}
                                <div className="product-offer-badge">
                                    {productWithDistance.discountPercentage ? `${productWithDistance.discountPercentage}% OFF` : `₹${productWithDistance.discountAmount} OFF`}
                                </div>

                                {/* You Save Text */}
                                <div className="product-save-text">
                                    You save ₹{productWithDistance.discountAmount}
                                </div>
                            </>
                        ) : (
                            <div className="product-price">₹{productWithDistance.price}</div>
                        )}
                    </div>

                    <div className="product-description">
                        <h3>Description</h3>
                        <p>{product.description || 'Delicious and freshly prepared. Made with high-quality ingredients to satisfy your cravings.'}</p>
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

                    {product.diet && (
                        <div className="diet-info" style={{ marginTop: '15px' }}>
                            <strong>Dietary Type:</strong>
                            <span 
                                className={`diet-indicator ${product.diet === 'Veg' ? 'diet-veg' : 'diet-non-veg'}`}
                                title={product.diet}
                                style={{ marginLeft: '10px' }}
                            ></span>
                        </div>
                    )}

                    <div className="product-distance" style={{ marginTop: '15px' }}>
                        <i className="fas fa-map-marker-alt"></i>
                        <span>{productWithDistance.distance || 'Calculating...'}</span>
                    </div>

                    <div className="product-actions" style={{ marginTop: '20px' }}>
                        {isInCart ? (
                             <button onClick={() => navigateTo('cart')} className="btn go-to-cart">Go to Cart</button>
                        ) : (
                            <button className="btn" onClick={() => onAddToCart(product)}>Add to Cart</button>
                        )}
                        <button 
                            className={`wishlist-heart-btn ${isInWishlist ? 'active' : ''}`} 
                            title="Add to Wishlist"
                            onClick={() => onToggleWishlist(product)}
                        >
                            <i className={isInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
                        </button>
                    </div>
                </div>
            </div>

            {/* ✅ RELATED PRODUCTS */}
            {relatedProductsWithDistance.length > 0 ? (
                <div className="related-products-section">
                    <h2>Related Products</h2>
                    <div className="related-product-grid">
                        {relatedProductsWithDistance.map(related => (
                            <div key={related._id || related.id} className="related-product-card" onClick={() => onViewProduct(related)} style={{cursor: 'pointer'}}>
                                <img 
                                    src={getImageSrc(related.image)} 
                                    alt={related.name}
                                    onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Img'}
                                />
                                <div className="related-product-info">
                                    <h4>{related.name}</h4>
                                    <p style={{fontSize: '14px', color: 'var(--gray)'}}>{related.vendor}</p>
                                    <div className="product-price" style={{fontSize: '18px', marginTop: '10px'}}>
                                        {related.discountedPrice ? (
                                            <>
                                                <span style={{textDecoration: 'line-through', color: '#999', marginRight: '8px'}}>₹{related.originalPrice}</span>
                                                ₹{related.discountedPrice}
                                            </>
                                        ) : (
                                            `₹${related.price}`
                                        )}
                                    </div>
                                    <div className="product-distance" style={{fontSize: '14px', color: 'var(--gray)', marginTop: '5px'}}>
                                        <i className="fas fa-map-marker-alt"></i> 
                                        <span>{related.distance || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="related-products-section">
                    <h2>Related Products</h2>
                    <p style={{textAlign: 'center', color: '#666', padding: '40px'}}>
                        {allFoodProducts.length === 0 ? 'Loading related products...' : 'No related products available'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default FoodDineProductDetail;