import React, { useState, useEffect, useCallback } from 'react';
import ClothesCard from './ClothesCard';
import './Clothes.css';

const Clothes = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, navigateTo, searchQuery, cartItems, selectedVendor }) => {
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
        "../IMAGES/cloths-hero-1.webp",
        "../IMAGES/cloths-hero-2.webp",
        "../IMAGES/cloths-hero-3.webp"
    ];

    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

    const getDistanceFromLatLonInKm = useCallback((lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const deg2rad = (deg) => deg * (Math.PI / 180);
        const dLat = deg2rad(lat2 - lat1);
        const dLon = deg2rad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    // ✅ COMBINED FETCH AND GEOLOCATION
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch('${process.env.REACT_APP_API_URL}/api/products/category/Clothes');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data = await response.json();

                console.log('Fetched Clothes products:', data);
                console.log('Selected Vendor:', selectedVendor);

                const categorizeProducts = (products) => {
                    const kids = products.filter(p =>
                        p.subcategory?.toLowerCase() === 'kids' ||
                        p.subcategory?.toLowerCase() === 'kid' ||
                        p.subcategory?.toLowerCase() === 'children' ||
                        p.name.toLowerCase().includes('kids') ||
                        p.name.toLowerCase().includes('kid') ||
                        p.name.toLowerCase().includes('children')
                    );

                    const womens = products.filter(p =>
                        !kids.includes(p) && (
                        p.subcategory?.toLowerCase() === 'women' ||
                        p.subcategory?.toLowerCase() === 'womens' ||
                        p.subcategory?.toLowerCase() === 'woman' ||
                        p.name.toLowerCase().includes('saree') ||
                        p.name.toLowerCase().includes('kurti') ||
                        p.name.toLowerCase().includes('lehenga') ||
                        p.name.toLowerCase().includes('anarkali') ||
                        p.name.toLowerCase().includes('dress') ||
                        p.name.toLowerCase().includes('gown') ||
                        p.name.toLowerCase().includes('blouse') ||
                        p.name.toLowerCase().includes('scarf') ||
                        p.name.toLowerCase().includes('leggings') ||
                        p.name.toLowerCase().includes('top'))
                    );

                    const mens = products.filter(p =>
                        !kids.includes(p) && !womens.includes(p) && (
                        p.subcategory?.toLowerCase() === 'men' ||
                        p.subcategory?.toLowerCase() === 'mens' ||
                        p.subcategory?.toLowerCase() === 'man' ||
                        p.name.toLowerCase().includes('shirt') ||
                        p.name.toLowerCase().includes('jacket') ||
                        p.name.toLowerCase().includes('coat') ||
                        p.name.toLowerCase().includes('suit') ||
                        p.name.toLowerCase().includes('pants') ||
                        p.name.toLowerCase().includes('jeans') ||
                        p.name.toLowerCase().includes('t-shirt') ||
                        p.name.toLowerCase().includes('sweater') ||
                        p.name.toLowerCase().includes('blazer'))
                    );

                    console.log('Categorization results:', {
                        total: products.length,
                        womens: womens.length,
                        mens: mens.length,
                        kids: kids.length,
                        uncategorized: products.length - (womens.length + mens.length + kids.length)
                    });

                    return { womens, mens, kids };
                };

                const categorized = categorizeProducts(data);

                // ✅ ADD DISTANCE IMMEDIATELY AFTER FETCH
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLat = position.coords.latitude;
                            const userLon = position.coords.longitude;

                            const addDistance = (productList) => {
                                return productList.map(product => {
                                    if (product.lat && product.lon) {
                                        const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                                        return { ...product, distance: `${distance.toFixed(1)} km away`, distanceValue: parseFloat(distance.toFixed(1)) };
                                    }
                                    return { ...product, distance: 'Distance N/A', distanceValue: 999 };
                                });
                            };

                            const updatedProducts = {
                                womens: addDistance(categorized.womens),
                                mens: addDistance(categorized.mens),
                                kids: addDistance(categorized.kids)
                            };
                            setAllProducts(updatedProducts);
                            setFilteredProducts(updatedProducts); // ✅ SET BOTH
                        },
                        (error) => {
                            console.warn(`Geolocation error: ${error.message}.`);
                            const updatedProducts = {
                                womens: categorized.womens.map(p => ({...p, distance: 'Within 5km', distanceValue: 5})),
                                mens: categorized.mens.map(p => ({...p, distance: 'Within 5km', distanceValue: 5})),
                                kids: categorized.kids.map(p => ({...p, distance: 'Within 5km', distanceValue: 5}))
                            };
                            setAllProducts(updatedProducts);
                            setFilteredProducts(updatedProducts); // ✅ SET BOTH
                        }
                    );
                } else {
                    console.warn("Geolocation is not supported by this browser.");
                    const updatedProducts = {
                        womens: categorized.womens.map(p => ({...p, distance: 'Within 5km', distanceValue: 5})),
                        mens: categorized.mens.map(p => ({...p, distance: 'Within 5km', distanceValue: 5})),
                        kids: categorized.kids.map(p => ({...p, distance: 'Within 5km', distanceValue: 5}))
                    };
                    setAllProducts(updatedProducts);
                    setFilteredProducts(updatedProducts); // ✅ SET BOTH
                }
            } catch (err) {
                setError(err.message);
                console.error('Error fetching products:', err);
                setFilteredProducts({ womens: [], mens: [], kids: [] }); // ✅ CLEAR ON ERROR
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [getDistanceFromLatLonInKm]);

    // ✅ APPLY FILTERS
    useEffect(() => {
        console.log('Clothes - Selected Vendor:', selectedVendor);
        console.log('Clothes - Search Query:', searchQuery);
        
        const totalProducts = allProducts.womens.length + allProducts.mens.length + allProducts.kids.length;
        if (totalProducts === 0) {
            return;
        }

        let allProductsArray = [
            ...allProducts.womens,
            ...allProducts.mens,
            ...allProducts.kids
        ];

        // ✅ FILTER BY SELECTED VENDOR
        if (selectedVendor) {
            console.log('Filtering products by vendor:', selectedVendor);
            allProductsArray = allProductsArray.filter(product => product.vendor === selectedVendor);
        }

        // ✅ FILTER BY SEARCH QUERY
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            allProductsArray = allProductsArray.filter(product => {
                const nameMatch = product.name?.toLowerCase().includes(query);
                const vendorMatch = product.vendor?.toLowerCase().includes(query);
                const categoryMatch = product.category?.toLowerCase().includes(query);
                
                return nameMatch || vendorMatch || categoryMatch;
            });
        }

        // ✅ FILTER BY PRICE RANGE
        if (filters.priceRange.min) {
            allProductsArray = allProductsArray.filter(p => p.price >= parseFloat(filters.priceRange.min));
        }
        if (filters.priceRange.max) {
            allProductsArray = allProductsArray.filter(p => p.price <= parseFloat(filters.priceRange.max));
        }

        // ✅ FILTER BY CATEGORY
        if (filters.category) {
            if (filters.category === 'Women') {
                allProductsArray = allProductsArray.filter(p => 
                    allProducts.womens.some(w => w._id === p._id || w.id === p.id)
                );
            } else if (filters.category === 'Men') {
                allProductsArray = allProductsArray.filter(p => 
                    allProducts.mens.some(m => m._id === p._id || m.id === p.id)
                );
            } else if (filters.category === 'Kids') {
                allProductsArray = allProductsArray.filter(p => 
                    allProducts.kids.some(k => k._id === p._id || k.id === p.id)
                );
            }
        }

        // ✅ FILTER BY STORE
        if (filters.store) {
            allProductsArray = allProductsArray.filter(p => 
                p.vendor?.toLowerCase().includes(filters.store.toLowerCase())
            );
        }

        // ✅ SORT BY
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

        // Split back into categories
        const filtered = {
            womens: allProductsArray.filter(p => allProducts.womens.some(w => w._id === p._id || w.id === p.id)),
            mens: allProductsArray.filter(p => allProducts.mens.some(m => m._id === p._id || m.id === p.id)),
            kids: allProductsArray.filter(p => allProducts.kids.some(k => k._id === p._id || k.id === p.id))
        };

        setFilteredProducts(filtered);
    }, [searchQuery, allProducts, selectedVendor, filters]);

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
            category: '',
            store: '',
            sortBy: ''
        });
    };

    // ✅ COUNT ACTIVE FILTERS
    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.priceRange.min || filters.priceRange.max) count++;
        if (filters.category) count++;
        if (filters.store) count++;
        if (filters.sortBy) count++;
        return count;
    };

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    const renderProductGrid = (products) => (
        <div className="product-grid">
            {products.map(product => (
                <ClothesCard
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
    );

    const totalProducts = filteredProducts.womens.length + filteredProducts.mens.length + filteredProducts.kids.length;

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Clothes slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="container">
                <div className="vendor-header">
                    {selectedVendor ? (
                        <div style={{ marginTop: '20px' }}>
                            <button className="back-button" onClick={() => navigateTo('clothes')}>
                                ← Back to Vendors
                            </button>
                            <h2 style={{ color: '#333', fontSize: '2rem', textAlign: 'center' }}>{selectedVendor} - Clothes</h2>
                        </div>
                    ) : (
                        <button className="back-button" onClick={() => navigateTo('general-services')}>
                            ← Back to Categories
                        </button>
                    )}
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
                                {totalProducts} result{totalProducts !== 1 ? 's' : ''} found 
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

                            {/* Category */}
                            <div className="filter-group">
                                <label><i className="fas fa-tshirt"></i> Category</label>
                                <select 
                                    value={filters.category} 
                                    onChange={(e) => handleFilterChange('category', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    <option value="Women">Women's Clothes</option>
                                    <option value="Men">Men's Clothes</option>
                                    <option value="Kids">Kids' Clothes</option>
                                </select>
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
            </div>

            {totalProducts === 0 && !loading && !error && (
                <div className="container">
                    <div className="no-results-message" style={{ textAlign: 'center', padding: '50px' }}>
                        <p>
                            No clothes found{selectedVendor ? ` in ${selectedVendor}` : ''}
                            {searchQuery ? ` for "${searchQuery}"` : ''}.
                        </p>
                    </div>
                </div>
            )}

            {filteredProducts.womens.length > 0 && (
                <section id="womens-clothes" className="section">
                    <div className="container">
                        <div className="section-title">
                            <h2>Women's Clothes</h2>
                        </div>
                        {loading && <div className="loading">Loading products...</div>}
                        {error && <div className="error">Error: {error}</div>}
                        {!loading && !error && renderProductGrid(filteredProducts.womens)}
                    </div>
                </section>
            )}

            {filteredProducts.mens.length > 0 && (
                <section id="mens-clothes" className="section">
                    <div className="container">
                        <div className="section-title">
                            <h2>Men's Clothes</h2>
                        </div>
                        {loading && <div className="loading">Loading products...</div>}
                        {error && <div className="error">Error: {error}</div>}
                        {!loading && !error && renderProductGrid(filteredProducts.mens)}
                    </div>
                </section>
            )}

            {filteredProducts.kids.length > 0 && (
                <section id="kids-clothes" className="section">
                    <div className="container">
                        <div className="section-title">
                            <h2>Kid's Clothes</h2>
                        </div>
                        {loading && <div className="loading">Loading products...</div>}
                        {error && <div className="error">Error: {error}</div>}
                        {!loading && !error && renderProductGrid(filteredProducts.kids)}
                    </div>
                </section>
            )}
        </>
    );
};

export default Clothes;