import React, { useState, useEffect, useCallback } from 'react';
import FootwearCard from './FootwearCard';
import './Footwear.css';

const Footwear = ({ 
    cartItems, 
    wishlistItems, 
    onAddToCart, 
    onToggleWishlist, 
    onViewProduct, 
    navigateTo, 
    searchQuery,
    selectedVendor
}) => {

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

    // ✅ FILTER STATES
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState({
        priceRange: { min: '', max: '' },
        category: '',
        store: '',
        sortBy: ''
    });

    const slideImages = [
        "../IMAGES/footweare-hero-1.jpg",
        "../IMAGES/footwere-hero-22.jpg",
        "../IMAGES/footeweare-hero-3.jpg"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [slideImages.length]);

    // --- Distance Calculation ---
    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = deg => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                  Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // ✅ COMBINED FETCH AND GEOLOCATION
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("http://localhost:5000/api/products/category/Footwear");

                if (!response.ok) throw new Error("Failed to fetch products");

                const products = await response.json();

                const womens = products.filter(p => p.subcategory === "Women's Footwear");
                const mens = products.filter(p => p.subcategory === "Men's Footwear");
                const kids = products.filter(p => p.subcategory === "Kids' Footwear");

                // ✅ ADD DISTANCE IMMEDIATELY AFTER FETCH
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lon = position.coords.longitude;

                            const addDistance = (productList) => {
                                return productList.map(product => {
                                    if (product.lat && product.lon) {
                                        const distance = getDistanceFromLatLonInKm(lat, lon, product.lat, product.lon);
                                        return { ...product, distance: `${distance.toFixed(1)} km away`, distanceValue: parseFloat(distance.toFixed(1)) };
                                    }
                                    return { ...product, distance: 'Distance N/A', distanceValue: 999 };
                                });
                            };

                            const categorized = {
                                womens: addDistance(womens),
                                mens: addDistance(mens),
                                kids: addDistance(kids)
                            };

                            setAllProducts(categorized);
                            setFilteredProducts(categorized); // ✅ SET BOTH
                        },
                        () => {
                            const addDefaultDistance = (productList) => {
                                return productList.map(p => ({ ...p, distance: "Within 5km", distanceValue: 5 }));
                            };

                            const categorized = {
                                womens: addDefaultDistance(womens),
                                mens: addDefaultDistance(mens),
                                kids: addDefaultDistance(kids)
                            };

                            setAllProducts(categorized);
                            setFilteredProducts(categorized); // ✅ SET BOTH
                        }
                    );
                } else {
                    const addDefaultDistance = (productList) => {
                        return productList.map(p => ({ ...p, distance: "Within 5km", distanceValue: 5 }));
                    };

                    const categorized = {
                        womens: addDefaultDistance(womens),
                        mens: addDefaultDistance(mens),
                        kids: addDefaultDistance(kids)
                    };

                    setAllProducts(categorized);
                    setFilteredProducts(categorized); // ✅ SET BOTH
                }

                setError(null);
            } catch (err) {
                console.error(err);
                setError("Failed to load products");
                setFilteredProducts({ womens: [], mens: [], kids: [] });
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [getDistanceFromLatLonInKm]);

    // ✅ APPLY FILTERS
    useEffect(() => {
        const totalProducts = allProducts.womens.length + allProducts.mens.length + allProducts.kids.length;
        if (totalProducts === 0) {
            return;
        }

        let allProductsArray = [
            ...allProducts.womens,
            ...allProducts.mens,
            ...allProducts.kids
        ];

        if (selectedVendor) {
            allProductsArray = allProductsArray.filter(p => p.vendor === selectedVendor);
        }

        if (searchQuery && searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            allProductsArray = allProductsArray.filter(p =>
                p.name.toLowerCase().includes(q) ||
                p.vendor.toLowerCase().includes(q) ||
                p.category.toLowerCase().includes(q)
            );
        }

        if (filters.priceRange.min) {
            allProductsArray = allProductsArray.filter(p => p.price >= parseFloat(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            allProductsArray = allProductsArray.filter(p => p.price <= parseFloat(filters.priceRange.max));
        }

        if (filters.category) {
            allProductsArray = allProductsArray.filter(p => p.subcategory === filters.category);
        }

        if (filters.store) {
            allProductsArray = allProductsArray.filter(p => 
                p.vendor?.toLowerCase().includes(filters.store.toLowerCase())
            );
        }

        if (filters.sortBy) {
            switch (filters.sortBy) {
                case 'price-low':
                    allProductsArray.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    allProductsArray.sort((a, b) => b.price - a.price);
                    break;
                case 'distance':
                    allProductsArray.sort((a, b) => (a.distanceValue || 999) - (b.distanceValue || 999));
                    break;
                case 'name-az':
                    allProductsArray.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'name-za':
                    allProductsArray.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                default:
                    break;
            }
        }

        const filtered = {
            womens: allProductsArray.filter(p => p.subcategory === "Women's Footwear"),
            mens: allProductsArray.filter(p => p.subcategory === "Men's Footwear"),
            kids: allProductsArray.filter(p => p.subcategory === "Kids' Footwear")
        };

        setFilteredProducts(filtered);
    }, [searchQuery, selectedVendor, allProducts, filters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handlePriceRangeChange = (type, value) => {
        setFilters(prev => ({
            ...prev,
            priceRange: {
                ...prev.priceRange,
                [type]: value
            }
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            priceRange: { min: '', max: '' },
            category: '',
            store: '',
            sortBy: ''
        });
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.priceRange.min || filters.priceRange.max) count++;
        if (filters.category) count++;
        if (filters.store) count++;
        if (filters.sortBy) count++;
        return count;
    };

    const isProductInWishlist = (product) => {
        return wishlistItems.some(item =>
            (item._id || item.id) === (product._id || product.id)
        );
    };

    const renderGrid = (products) => {
        if (products.length === 0) {
            return <div className="no-products-message">No products found in this category.</div>;
        }
        
        return (
            <div className="product-grid">
                {products.map(product => (
                    <FootwearCard
                        key={product._id || product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                        onToggleWishlist={onToggleWishlist}
                        onViewProduct={onViewProduct}
                        cartItems={cartItems}
                        navigateTo={navigateTo}
                        isWishlisted={isProductInWishlist(product)}
                    />
                ))}
            </div>
        );
    };

    if (loading) return <div className="container"><div className="loading">Loading footwear...</div></div>;
    if (error) return <div className="container"><div className="error">{error}</div></div>;

    const totalProducts = filteredProducts.womens.length + filteredProducts.mens.length + filteredProducts.kids.length;

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, i) => (
                            <div key={i} className="carousel-slide">
                                <img src={img} alt={`Footwear slide ${i + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container">
                <div className="vendor-header">
                    {selectedVendor ? (
                        <div style={{ marginTop: "20px", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                            <button className="back-button" onClick={() => navigateTo("footwear")}>
                                ← Back to Vendors
                            </button>
                            <h2 style={{ margin: 0, fontSize: "2rem", color: "#333" }}>
                                {selectedVendor} - Footwear
                            </h2>
                        </div>
                    ) : (
                        <button className="back-button" onClick={() => navigateTo('general-services')}>
                            ← Back to Categories
                        </button>
                    )}
                </div>

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
                                {totalProducts} result{totalProducts !== 1 ? 's' : ''} found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}

                {showFilters && (
                    <div className="filter-panel">
                        <div className="filter-grid">
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

                            <div className="filter-group">
                                <label><i className="fas fa-shoe-prints"></i> Category</label>
                                <select 
                                    value={filters.category} 
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Women's Footwear">Women's Footwear</option>
                                    <option value="Men's Footwear">Men's Footwear</option>
                                    <option value="Kids' Footwear">Kids' Footwear</option>
                                </select>
                            </div>

                            <div className="filter-group">
                                <label><i className="fas fa-store"></i> Store</label>
                                <input
                                    type="text"
                                    placeholder="Search store"
                                    value={filters.store}
                                    onChange={(e) => handleFilterChange('store', e.target.value)}
                                />
                            </div>

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
            </div>

            <section id="womens-footwear" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>{selectedVendor ? `${selectedVendor} - Women's Footwear` : "Women's Footwear"}</h2>
                    </div>
                    {renderGrid(filteredProducts.womens)}
                </div>
            </section>

            <section id="mens-footwear" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>{selectedVendor ? `${selectedVendor} - Men's Footwear` : "Men's Footwear"}</h2>
                    </div>
                    {renderGrid(filteredProducts.mens)}
                </div>
            </section>

            <section id="kids-footwear" className="section">
                <div className="container">
                    <div className="section-title">
                        <h2>{selectedVendor ? `${selectedVendor} - Kids' Footwear` : "Kids' Footwear"}</h2>
                    </div>
                    {renderGrid(filteredProducts.kids)}
                </div>
            </section>
        </>
    );
};

export default Footwear;