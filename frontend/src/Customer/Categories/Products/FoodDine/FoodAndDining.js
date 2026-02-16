import React, { useState, useEffect, useCallback } from 'react';
import ProductCard1 from './ProductCard1';
import './FoodAndDining.css';

const FoodAndDining = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, cartItems, navigateTo, searchQuery, activePage, selectedVendor }) => {
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
        foodType: '',
        sortBy: '',
        store: ''
    });
    
    const slideImages = [
        "../IMAGES/a3e06c8f7b389ecacdbcd59f2b29fc17.jpg",
        "../IMAGES/pngtree-salad-with-vegetables-in-a-black-bowl-image_2962609.jpg",
        "../IMAGES/arabic-shawarma-with-fries-ketchup-raita-served-dish-isolated-grey-background-side-view-fastfood_689047-1158.jpg"
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

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

    // ✅ COMBINED FETCH AND GEOLOCATION (SAME AS MEDICINES.JS)
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('http://localhost:5000/api/products/category/Food%20%26%20Dining');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();
                
                // ✅ SAFETY FILTER: Only keep Food & Dining products
                let filteredData = data.filter(product => 
                    product.category === 'Food & Dining' || 
                    product.category === 'food & dining' ||
                    product.category?.toLowerCase() === 'food & dining'
                );
                console.log('📊 Food & Dining Safety Filter:', data.length, '→', filteredData.length, 'products');
                
                // Filter by selected vendor if provided
                if (selectedVendor) {
                    filteredData = filteredData.filter(product => product.vendor === selectedVendor);
                    setVendorName(selectedVendor);
                }
                
                // ✅ ADD DISTANCE IMMEDIATELY AFTER FETCH
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLat = position.coords.latitude;
                            const userLon = position.coords.longitude;

                            const productsWithDistance = filteredData.map(product => {
                                if (product.lat && product.lon) {
                                    const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                                    return { 
                                        ...product, 
                                        distance: `${distance.toFixed(1)} km away`, 
                                        distanceValue: parseFloat(distance.toFixed(1)) 
                                    };
                                }
                                return { ...product, distance: 'Distance N/A', distanceValue: 999 };
                            });
                            setProducts(productsWithDistance);
                            setFilteredProducts(productsWithDistance); // ✅ SET BOTH
                        },
                        (error) => {
                            console.warn(`Geolocation error: ${error.message}`);
                            const productsWithDefaultDistance = filteredData.map(p => ({
                                ...p, 
                                distance: 'Within 5km', 
                                distanceValue: 5
                            }));
                            setProducts(productsWithDefaultDistance);
                            setFilteredProducts(productsWithDefaultDistance); // ✅ SET BOTH
                        }
                    );
                } else {
                    console.warn("Geolocation is not supported by this browser.");
                    const productsWithDefaultDistance = filteredData.map(p => ({
                        ...p, 
                        distance: 'Within 5km', 
                        distanceValue: 5
                    }));
                    setProducts(productsWithDefaultDistance);
                    setFilteredProducts(productsWithDefaultDistance); // ✅ SET BOTH
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
                setProducts([]);
                setFilteredProducts([]); // ✅ CLEAR ON ERROR
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedVendor, getDistanceFromLatLonInKm]);

    // ✅ APPLY FILTERS (SAME STRUCTURE AS MEDICINES.JS)
    useEffect(() => {
        if (products.length === 0) {
            return;
        }

        let filtered = [...products];

        // ✅ FILTER BY VENDOR (keep for consistency)
        if (selectedVendor) {
            filtered = filtered.filter(product => product.vendor === selectedVendor);
        }

        // ✅ FILTER BY SEARCH
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product =>
                product.name?.toLowerCase().includes(query) ||
                product.vendor?.toLowerCase().includes(query) ||
                product.category?.toLowerCase().includes(query) ||
                product.subcategory?.toLowerCase().includes(query)
            );
        }

        // ✅ FILTER BY PRICE RANGE
        if (filters.priceRange.min) {
            filtered = filtered.filter(p => p.price >= parseFloat(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            filtered = filtered.filter(p => p.price <= parseFloat(filters.priceRange.max));
        }

        // ✅ FILTER BY FOOD TYPE
        if (filters.foodType) {
            filtered = filtered.filter(p => p.foodType === filters.foodType);
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
    }, [searchQuery, products, selectedVendor, filters]);

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
            foodType: '',
            sortBy: '',
            store: ''
        });
    };

    // ✅ COUNT ACTIVE FILTERS
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.priceRange.min || filters.priceRange.max) count++;
        if (filters.foodType) count++;
        if (filters.sortBy) count++;
        if (filters.store) count++;
        return count;
    };

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    const handleBackToVendors = () => {
        navigateTo('food');
    };

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Food slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="section" id="restaurants">
                <div className="container">
                    <div className="vendor-header">
                        {selectedVendor ? (
                            <>
                                <button className="back-button" onClick={handleBackToVendors}>
                                    ← Back to Restaurants
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
                        <h2>{selectedVendor ? 'Menu' : 'Food & Dining'}</h2>
                    </div>

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

                                {/* Food Type */}
                                <div className="filter-group">
                                    <label><i className="fas fa-leaf"></i> Food Type</label>
                                    <select 
                                        value={filters.foodType} 
                                        onChange={(e) => handleFilterChange('foodType', e.target.value)}
                                    >
                                        <option value="">All Types</option>
                                        <option value="Veg">Veg</option>
                                        <option value="Non-Veg">Non-Veg</option>
                                        <option value="Vegan">Vegan</option>
                                        <option value="Egg">Egg</option>
                                    </select>
                                </div>

                                {/* Store/Restaurant */}
                                <div className="filter-group">
                                    <label><i className="fas fa-store"></i> Restaurant</label>
                                    <input
                                        type="text"
                                        placeholder="Search restaurant"
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
                            <p>Loading delicious food options...</p>
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
                            <p>This restaurant hasn't added any menu items yet.</p>
                        </div>
                    )}
                    {!loading && !error && filteredProducts.length > 0 && (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <ProductCard1
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

export default FoodAndDining;