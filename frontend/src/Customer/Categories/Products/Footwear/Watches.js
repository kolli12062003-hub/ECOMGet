import React, { useState, useEffect, useCallback } from 'react';
import WatchCard from './WatchCard';
import './Watches.css';

const Watches = ({ cartItems, wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, navigateTo, searchQuery }) => {
    const [allProducts, setAllProducts] = useState({
        womens: [],
        mens: [],
        kids: []
    });
    const [filteredProducts, setFilteredProducts] = useState({
        womens: [],
        mens: [],
        kids: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideImages = [
        "../IMAGES/footweare-hero-1.jpg",
        "../IMAGES/footwere-hero-22.jpg",
        "../IMAGES/footeweare-hero-3.jpg"
       
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000); // Change slide every 5 seconds
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

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

    const addDistanceToProducts = useCallback((products, userLat, userLon) => {
        return products.map(product => {
            if (product.lat && product.lon) {
                const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                return { ...product, distance: `${distance.toFixed(1)} km away` };
            }
            return { ...product, distance: 'Distance N/A' };
        });
    }, [getDistanceFromLatLonInKm]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
               setLoading(true);
                const response = await fetch('${process.env.REACT_APP_API_URL}/api/products/category/Footwear');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const products = await response.json();

                // Filter products into categories
                const womens = products.filter(p => p.subcategory === "Women's Footwear");
                const mens = products.filter(p => p.subcategory === "Men's Footwear");
                const kids = products.filter(p => p.subcategory === "Kids' Footwear");

                const categorizedProducts = {
                    womens,
                    mens,
                    kids
                };

                setAllProducts(categorizedProducts);
                setFilteredProducts(categorizedProducts);
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Apply geolocation and distance calculation
    useEffect(() => {
        if (allProducts.womens.length > 0 && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    const updatedProducts = {
                        womens: addDistanceToProducts(allProducts.womens, userLat, userLon),
                        mens: addDistanceToProducts(allProducts.mens, userLat, userLon),
                        kids: addDistanceToProducts(allProducts.kids, userLat, userLon)
                    };
                    setAllProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}.`);
                    const updatedProducts = {
                        womens: allProducts.womens.map(p => ({...p, distance: 'Within 5km'})),
                        mens: allProducts.mens.map(p => ({...p, distance: 'Within 5km'})),
                        kids: allProducts.kids.map(p => ({...p, distance: 'Within 5km'}))
                    };
                    setAllProducts(updatedProducts);
                    setFilteredProducts(updatedProducts);
                }
            );
        } else if (allProducts.womens.length > 0) {
            console.warn("Geolocation is not supported by this browser.");
            const updatedProducts = {
                womens: allProducts.womens.map(p => ({...p, distance: 'Within 5km'})),
                mens: allProducts.mens.map(p => ({...p, distance: 'Within 5km'})),
                kids: allProducts.kids.map(p => ({...p, distance: 'Within 5km'}))
            };
            setAllProducts(updatedProducts);
            setFilteredProducts(updatedProducts);
        }
    }, [allProducts.womens.length, allProducts.mens.length, allProducts.kids.length, addDistanceToProducts]);

    useEffect(() => {
        if (searchQuery) {
            const filterProducts = (products) => products.filter(product =>
                product.name.toLowerCase().includes(searchQuery) ||
                product.vendor.toLowerCase().includes(searchQuery) ||
                product.category.toLowerCase().includes(searchQuery)
            );
            setFilteredProducts({
                womens: filterProducts(allProducts.womens),
                mens: filterProducts(allProducts.mens),
                kids: filterProducts(allProducts.kids)
            });
        } else {
            setFilteredProducts(allProducts);
        }
    }, [searchQuery, allProducts]);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    const renderProductGrid = (products) => (
        <div className="product-grid">
            {products.map(product => (
                <WatchCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onToggleWishlist={onToggleWishlist}
                    onViewProduct={onViewProduct}
                    cartItems={cartItems}
                    navigateTo={navigateTo}
                    isWishlisted={isProductInWishlist(product.id)}
                />
            ))}
        </div>
    );

   if (loading) {
        return (
            <div className="container">
                <div className="loading">Loading footwear products...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container">
                <div className="error">{error}</div>
            </div>
        );
    }

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                   <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Footwear slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section id="womens-footwear" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>Women's Footwear</h2>
                    </div>
                    {renderProductGrid(filteredProducts.womens)}
                </div>
            </section>

            <section id="mens-footwear" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>Men's Footwear</h2>
                    </div>
                    {renderProductGrid(filteredProducts.mens)}
                </div>
            </section>

            <section id="kids-footwear" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>Kids' Footwear</h2>
                   </div>
                    {renderProductGrid(filteredProducts.kids)}
                </div>
            </section>
        </>
    );
};

export default Watches;