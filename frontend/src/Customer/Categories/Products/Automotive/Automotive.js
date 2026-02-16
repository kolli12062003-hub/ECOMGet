import React, { useState, useEffect, useCallback } from 'react';
import AutomotiveCard from './AutomotiveCard';
import './Automotive.css';

const Automotive = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, cartItems, navigateTo, searchQuery, selectedVendor }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [vendorName, setVendorName] = useState('');

    // ✅ FILTER STATES
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: { min: '', max: '' },
        store: '',
        sortBy: ''
    });
    
    const slideImages = [
        "/IMAGES/automotive-hero-1.jpg",
        "/IMAGES/automotive-hero-2.jpg",
        "/IMAGES/automotive-hero-3.jpg"
    ];

    // Calculate distance helper
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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products/category/Automotive');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                
                // Filter by selected vendor if provided
                let filteredData = data;
                if (selectedVendor) {
                    filteredData = data.filter(product => product.vendor === selectedVendor);
                    setVendorName(selectedVendor);
                }
                
                // Add distance to products
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLat = position.coords.latitude;
                            const userLon = position.coords.longitude;

                            const productsWithDistance = filteredData.map(product => {
                                if (product.lat && product.lon) {
                                    const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                                    return { ...product, distance: `${distance.toFixed(1)} km away`, distanceValue: parseFloat(distance.toFixed(1)) };
                                }
                                return { ...product, distance: 'Distance N/A', distanceValue: 999 };
                            });
                            setProducts(productsWithDistance);
                        },
                        (error) => {
                            console.warn(`Geolocation error: ${error.message}`);
                            const productsWithDefaultDistance = filteredData.map(p => ({...p, distance: 'Within 5km', distanceValue: 5}));
                            setProducts(productsWithDefaultDistance);
                            setFilteredProducts(productsWithDefaultDistance); // ✅ SET BOTH
                        }
                    );
                } else {
                    console.warn("Geolocation is not supported by this browser.");
                    const productsWithDefaultDistance = filteredData.map(p => ({...p, distance: 'Within 5km', distanceValue: 5}));
                    setProducts(productsWithDefaultDistance);
                    setFilteredProducts(productsWithDefaultDistance); // ✅ SET BOTH
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length, selectedVendor, getDistanceFromLatLonInKm]);

    // ✅ APPLY FILTERS
    useEffect(() => {
        console.log('Automotive - Selected Vendor:', selectedVendor);
        console.log('Automotive - Search Query:', searchQuery);
        console.log('Automotive - Products Count:', products.length);

        if (products.length === 0) {
            return;
        }

        let filtered = [...products];

        // Filter by selected vendor if provided
        if (selectedVendor) {
            filtered = filtered.filter(product => product.vendor === selectedVendor);
        }

        // Search filter
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

        console.log('Filtered Automotive Products Count:', filtered.length);
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

    const handleBackToVendors = () => {
        navigateTo('automotive');
    };

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Automotive slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section id="automotive" className="section">
                <div className="container">
                    <div className="vendor-header">
                        {selectedVendor ? (
                            <>
                                <button className="back-button" onClick={handleBackToVendors}>
                                    ← Back to Vendors
                                </button>
                                <h3 className="vendor-title">{vendorName}</h3>
                            </>
                        ) : (
                            <button className="back-button" onClick={() => navigateTo('general-services')}>
                                ← Back to Categories
                            </button>
                        )}
                    </div>
                    <div className="section-title">
                        <h2>{selectedVendor ? 'Products' : 'Automotive'}</h2>
                        {searchQuery && (
                            <p className="search-results-info">
                                {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found for "{searchQuery}"
                            </p>
                        )}
                    </div>

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
                    {loading && (
                        <div className="loading-message">
                            <p>Loading automotive products...</p>
                        </div>
                    )}
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    {!loading && !error && filteredProducts.length === 0 && searchQuery && (
                        <div className="no-results-message">
                            <p>No products found for "{searchQuery}". Try a different search term.</p>
                        </div>
                    )}
                    {!loading && !error && filteredProducts.length === 0 && !searchQuery && selectedVendor && (
                        <div className="no-results-message">
                            <p>This vendor hasn't added any products yet.</p>
                        </div>
                    )}
                    {!loading && !error && filteredProducts.length > 0 && (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <AutomotiveCard
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

export default Automotive;