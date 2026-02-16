import React, { useState, useEffect, useCallback } from 'react';
import BeautyProductCard from './BeautyProductCard';
import './Beauty.css';

const Beauty = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, cartItems, navigateTo, searchQuery, selectedVendor }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);

    // ✅ FILTER STATES
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: { min: '', max: '' },
        store: '',
        sortBy: ''
    });
    const slideImages = [
        "../IMAGES/bueaty-hero-4.jpg",
        "../IMAGES/bueaty-hero-2.webp",
        "../IMAGES/bueaty-hero-3.jpg"
       
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5000/api/products/category/Beauty Products');
            if (response.ok) {
                const data = await response.json();
                console.log('Fetched Beauty products:', data);
                console.log('Selected Vendor:', selectedVendor);
                setProducts(data);
                setFilteredProducts(data);
            } else {
                console.error('Failed to fetch beauty products');
                setError('Failed to load products');
            }
        } catch (error) {
            console.error('Error fetching beauty products:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
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
                                return { ...product, distance: `${distance.toFixed(1)} km away`, distanceValue: parseFloat(distance.toFixed(1)) };
                            }
                            return { ...product, distance: 'Distance N/A', distanceValue: 999 };
                        });
                        setProducts(productsWithDistance);
                        setFilteredProducts(productsWithDistance);
                    },
                    (error) => {
                        console.warn(`Geolocation error: ${error.message}.`);
                        const productsWithDefaultDistance = products.map(p => ({...p, distance: 'Within 5km', distanceValue: 5}));
                        setProducts(productsWithDefaultDistance);
                        setFilteredProducts(productsWithDefaultDistance);
                    }
                );
            } else {
                console.warn("Geolocation is not supported by this browser.");
                const productsWithDefaultDistance = products.map(p => ({...p, distance: 'Within 5km', distanceValue: 5}));
                setProducts(productsWithDefaultDistance);
                setFilteredProducts(productsWithDefaultDistance);
            }
        }
    }, [products.length, getDistanceFromLatLonInKm]);

    // ✅ APPLY FILTERS
    useEffect(() => {
        console.log('Beauty - Selected Vendor:', selectedVendor);
        console.log('Beauty - Search Query:', searchQuery);
        console.log('Beauty - Products Count:', products.length);

        if (products.length === 0) {
            return;
        }

        let filtered = [...products];

        if (selectedVendor) {
            console.log('Filtering products by vendor:', selectedVendor);
            filtered = filtered.filter(product => product.vendor === selectedVendor);
            console.log('Products after vendor filter:', filtered.length);
        }

        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product => {
                const nameMatch = product.name?.toLowerCase().includes(query);
                const vendorMatch = product.vendor?.toLowerCase().includes(query);
                const categoryMatch = product.category?.toLowerCase().includes(query);

                return nameMatch || vendorMatch || categoryMatch;
            });
        }

        // Price filter
        if (filters.priceRange.min) {
            filtered = filtered.filter(p => p.price >= parseFloat(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            filtered = filtered.filter(p => p.price <= parseFloat(filters.priceRange.max));
        }

        // Store filter
        if (filters.store) {
            filtered = filtered.filter(p =>
                p.vendor?.toLowerCase().includes(filters.store.toLowerCase())
            );
        }

        // Sorting
        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'distance':
                    filtered.sort((a, b) => (a.distanceValue || 999) - (b.distanceValue || 999));
                    break;
                case 'name-az':
                    filtered.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-za':
                    filtered.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                default:
                    break;
            }
        }

        console.log('Final Filtered Beauty Products Count:', filtered.length);
        setFilteredProducts(filtered);
    }, [searchQuery, products, selectedVendor, filters]);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    // ✅ HANDLE FILTER CHANGE
    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // ✅ HANDLE PRICE RANGE CHANGE
    const handlePriceRangeChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value
            }
        }));
    };

    // ✅ CLEAR ALL FILTERS
    const clearAllFilters = () => {
        setFilters({
            priceRange: { min: '', max: '' },
            store: '',
            sortBy: ''
        });
    };

    // ✅ COUNT ACTIVE FILTERS
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.priceRange.min || filters.priceRange.max) count++;
        if (filters.store) count++;
        if (filters.sortBy) count++;
        return count;
    };

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Beauty slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section id="beauty" className="section">
                <div className="container">
                    <div className="vendor-header">
                        {selectedVendor ? (
                            <div style={{ marginBottom: '20px' }}>
                                <button className="back-button" onClick={() => navigateTo('beauty')}>
                                    ← Back to Vendors
                                </button>
                                <h2 style={{ color: '#333', fontSize: '2rem' }}>{selectedVendor} - Beauty Products</h2>
                            </div>
                        ) : (
                            <button className="back-button" onClick={() => navigateTo('general-services')}>
                                ← Back to Categories
                            </button>
                        )}
                    </div>
                    {!selectedVendor && (
                        <div className="section-title">
                            <h2>Beauty</h2>
                        </div>
                    )}
                    {/* ✅ FILTER BUTTON */}
                    {!loading && !error && (
                        <div className="filter-section">
                            <button
                                className="filter-toggle-btn"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <i className="fas fa-filter"></i>
                                Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                            </button>
                            {getActiveFilterCount() > 0 && (
                                <button className="clear-filters-btn" onClick={clearAllFilters}>
                                    <i className="fas fa-times"></i> Clear All
                                </button>
                            )}
                        </div>
                    )}

                    {/* ✅ FILTER PANEL */}
                    {showFilters && (
                        <div className="filter-panel">
                            <div className="filter-grid">
                                {/* Price Range */}
                                <div className="filter-group">
                                    <label><i className="fas fa-rupee-sign"></i> Price Range</label>
                                    <div className="price-range-inputs">
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={filters.priceRange.min}
                                            onChange={(e) => handlePriceRangeChange('min', e.target.value)}
                                        />
                                        <span>to</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={filters.priceRange.max}
                                            onChange={(e) => handlePriceRangeChange('max', e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Store */}
                                <div className="filter-group">
                                    <label><i className="fas fa-store"></i> Store</label>
                                    <input
                                        type="text"
                                        placeholder="Search store"
                                        value={filters.store}
                                        onChange={(e) => handleFilterChange('store', e.target.value)}
                                    />
                                </div>

                                {/* Sort By */}
                                <div className="filter-group">
                                    <label><i className="fas fa-sort"></i> Sort By</label>
                                    <select
                                        value={filters.sortBy}
                                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                                    >
                                        <option value="">Default</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="distance">Distance: Nearest First</option>
                                        <option value="name-az">Name: A to Z</option>
                                        <option value="name-za">Name: Z to A</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {searchQuery && (
                        <div className="search-results-info" style={{ textAlign: 'center', marginBottom: '20px' }}>
                            <p>
                                {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found
                                {selectedVendor ? ` in ${selectedVendor}` : ''} for "{searchQuery}"
                            </p>
                        </div>
                    )}
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>Loading beauty products...</p>
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
                            <p>Error loading products: {error}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="no-results-message" style={{ textAlign: 'center', padding: '50px' }}>
                            <p>
                                No beauty products found{selectedVendor ? ` in ${selectedVendor}` : ''}
                                {searchQuery ? ` for "${searchQuery}"` : ''}.
                            </p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <BeautyProductCard
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
        </>
    );
};

export default Beauty;