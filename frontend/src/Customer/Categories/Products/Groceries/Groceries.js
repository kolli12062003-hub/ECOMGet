import React, { useState, useEffect, useCallback } from 'react';
import GroceryCard from './GroceryCard';
import './Groceries.css';


const Grocery = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, cartItems, navigateTo, searchQuery }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentSlide, setCurrentSlide] = useState(0);
    const slideImages = [
        "../IMAGES/41628-4-groceries-hd-image-free-png.png",
        "../IMAGES/groceries-hero-2.png",
        "../IMAGES/groceries-hero-3.jpg"
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:5000/api/products/category/${encodeURIComponent("Groceries")}`);
            if (response.ok) {
                const data = await response.json();
                setProducts(data);
                setFilteredProducts(data);
            } else {
                console.error('Failed to fetch groceries products');
                setError('Failed to load products');
            }
        } catch (error) {
            console.error('Error fetching groceries products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // --- Geolocation and Distance Calculation ---
    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the earth in km
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const userLat = position.coords.latitude;
                        const userLon = position.coords.longitude;

                        const productsWithDistance = products.map(product => {
                            if (product.lat && product.lon) {
                                const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                                return { ...product, distance: `${distance.toFixed(1)} km away` };
                            }
                            return { ...product, distance: 'Distance N/A' };
                        });
                        setProducts(productsWithDistance);
                        setFilteredProducts(productsWithDistance);
                    },
                    (error) => {
                        console.warn(`Geolocation error: ${error.message}.`);
                        const productsWithDefaultDistance = products.map(p => ({...p, distance: 'Within 5km'}));
                        setProducts(productsWithDefaultDistance);
                        setFilteredProducts(productsWithDefaultDistance);
                    }
                );
            } else {
                console.warn("Geolocation is not supported by this browser.");
                const productsWithDefaultDistance = products.map(p => ({...p, distance: 'Within 5km'}));
                setProducts(productsWithDefaultDistance);
                setFilteredProducts(productsWithDefaultDistance);
            }
        }
    }, [products.length, getDistanceFromLatLonInKm]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = products.filter(product =>
                product.name.toLowerCase().includes(searchQuery) ||
                product.vendor.toLowerCase().includes(searchQuery) ||
                product.category.toLowerCase().includes(searchQuery)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
    }, [searchQuery, products]);

    const isProductInWishlist = (productId) => {
    return wishlistItems.some(item => (item._id || item.id) === productId);
};

    return (
        <>
            {/* <Header cartCount={cart.length} wishlistCount={wishlist.length} /> */}
            {/* <Nav /> */}

            <section className="hero" id="hero">
                <div className="slider-container">
                    <div className="bg-slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div key={index} className={`bg-slide ${index === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `url('${img}')` }}></div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="groceries" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>Groceries</h2>
                    </div>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>Loading groceries products...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                            <p>Error loading products: {error}</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <GroceryCard
                                    key={product._id || product.id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                    onViewProduct={onViewProduct}
                                    isWishlisted={isProductInWishlist(product._id || product.id)}
                                    cartItems={cartItems}
                                    navigateTo={navigateTo}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* <Footer /> */}
        </>
    );
};

export default Groceries;