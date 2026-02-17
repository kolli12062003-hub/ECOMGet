import React, { useState, useEffect, useCallback } from 'react';
import HomeFurnitureCard from './HomeFurnitureCard';
import './HomeFurniture.css';

const HomeFurniture = ({ 
    wishlistItems, 
    onAddToCart, 
    onToggleWishlist, 
    onViewProduct, 
    cartItems, 
    navigateTo, 
    searchQuery,
    selectedVendor
}) => {
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
        "IMAGES/home-hero-1.jpg",
        "IMAGES/home-hero-2.jpg",
        "IMAGES/home-hero-3.jpg"
    ];

    // HERO SLIDER
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

    // DISTANCE CALCULATOR
    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = deg => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // ✅ COMBINED FETCH AND GEOLOCATION
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("${process.env.REACT_APP_API_URL}/api/products/category/Home Furniture");
                if (!response.ok) throw new Error("Failed to fetch furniture");

                const data = await response.json();

                // ✅ APPLY DISTANCE IMMEDIATELY
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => {
                            const { latitude, longitude } = pos.coords;
                            const mapped = data.map(p => {
                                if (p.lat && p.lon) {
                                    const dist = getDistanceFromLatLonInKm(latitude, longitude, p.lat, p.lon);
                                    return { 
                                        ...p, 
                                        distance: `${dist.toFixed(1)} km away`,
                                        distanceValue: parseFloat(dist.toFixed(1))
                                    };
                                }
                                return { ...p, distance: "Distance N/A", distanceValue: 999 };
                            });
                            setProducts(mapped);
                            setFilteredProducts(mapped); // ✅ SET BOTH
                        },
                        () => {
                            const mapped = data.map(p => ({ ...p, distance: "Within 5km", distanceValue: 5 }));
                            setProducts(mapped);
                            setFilteredProducts(mapped); // ✅ SET BOTH
                        }
                    );
                } else {
                    const mapped = data.map(p => ({ ...p, distance: "Within 5km", distanceValue: 5 }));
                    setProducts(mapped);
                    setFilteredProducts(mapped); // ✅ SET BOTH
                }

            } catch (err) {
                console.error(err);
                setError(err.message);
                setFilteredProducts([]); // ✅ CLEAR ON ERROR
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [getDistanceFromLatLonInKm]);

    // ✅ APPLY FILTERS
    useEffect(() => {
        if (products.length === 0) {
            return;
        }

        let filtered = [...products];

        // ✅ FILTER BY VENDOR
        if (selectedVendor) {
            filtered = filtered.filter(p => p.vendor === selectedVendor);
        }

        // ✅ FILTER BY SEARCH
        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(p =>
                p.name?.toLowerCase().includes(q) ||
                p.vendor?.toLowerCase().includes(q) ||
                p.category?.toLowerCase().includes(q)
            );
        }

        // ✅ FILTER BY PRICE RANGE
        if (filters.priceRange.min) {
            filtered = filtered.filter(p => p.price >= parseFloat(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            filtered = filtered.filter(p => p.price <= parseFloat(filters.priceRange.max));
        }

        // ✅ FILTER BY STORE
        if (filters.store) {
            filtered = filtered.filter(p => 
                p.vendor?.toLowerCase().includes(filters.store.toLowerCase())
            );
        }

        // ✅ SORT BY
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

        setFilteredProducts(filtered);

    }, [searchQuery, selectedVendor, products, filters]);

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

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(i => (i._id || i.id) === productId);
    };

    // LOADING
    if (loading) {
        return (
            <section id="homefurniture" className="section">
                <div className="container">
                    <div className="section-title"><h2>Home Furniture</h2></div>
                    <div className="loading">Loading products...</div>
                </div>
            </section>
        );
    }

    // ERROR
    if (error) {
        return (
            <section id="homefurniture" className="section">
                <div className="container">
                    <div className="section-title"><h2>Home Furniture</h2></div>
                    <div className="error">Error loading products: {error}</div>
                </div>
            </section>
        );
    }

    return (
        <>
            {/* HERO SLIDER */}
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div
                        className="carousel-slides"
                        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                        {slideImages.map((img, i) => (
                            <div className="carousel-slide" key={i}>
                                <img src={img} alt={`Furniture slide ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section id="homefurniture" className="section">
                <div className="container">

                    {/* VENDOR HEADER */}
                    <div className="vendor-header">
                        {selectedVendor ? (
                            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                                <button className="back-button" onClick={() => navigateTo("homefurniture")}>
                                    ← Back to Vendors
                                </button>
                                <h2 style={{ margin: 0 }}>
                                    {selectedVendor} – Home Furniture
                                </h2>
                            </div>
                        ) : (
                            <button className="back-button" onClick={() => navigateTo('general-services')}>
                                ← Back to Categories
                            </button>
                        )}
                    </div>

                    {!selectedVendor && (
                        <div className="section-title">
                            <h2>Home Furniture</h2>
                        </div>
                    )}

                    {/* ✅ FILTER SECTION */}
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
                            {searchQuery && (
                                <div className="search-results-info">
                                    {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found 
                                    {selectedVendor ? ` in ${selectedVendor}` : ''} for "{searchQuery}"
                                </div>
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

                                {/* Store/Vendor */}
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

                    {/* NO PRODUCTS MESSAGE */}
                    {filteredProducts.length === 0 && !loading && !error && (
                        <div className="no-results-message">
                            <p>
                                No furniture found{selectedVendor ? ` in ${selectedVendor}` : ''}
                                {searchQuery ? ` for "${searchQuery}"` : ''}.
                            </p>
                        </div>
                    )}

                    {/* PRODUCT LIST */}
                    {filteredProducts.length > 0 && (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <HomeFurnitureCard
                                    key={product._id}
                                    product={product}
                                    onAddToCart={onAddToCart}
                                    onToggleWishlist={onToggleWishlist}
                                    onViewProduct={onViewProduct}
                                    isWishlisted={isProductInWishlist(product._id)}
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

export default HomeFurniture;