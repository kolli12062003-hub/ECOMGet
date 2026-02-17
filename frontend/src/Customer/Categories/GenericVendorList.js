import React, { useState, useEffect, useCallback } from 'react';
import './GenericVendorList.css';

const GenericVendorList = ({ navigateTo, searchQuery, category, categoryDisplayName, targetPage }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    
    // Category-specific slide images
    const categoryImages = {
        'Food & Dining': [
            "../IMAGES/a3e06c8f7b389ecacdbcd59f2b29fc17.jpg",
            "../IMAGES/pngtree-salad-with-vegetables-in-a-black-bowl-image_2962609.jpg",
            "../IMAGES/arabic-shawarma-with-fries-ketchup-raita-served-dish-isolated-grey-background-side-view-fastfood_689047-1158.jpg"
        ],
        'Medicines': [
            "/IMAGES/medicine-hero-1.jpg",
            "/IMAGES/medicine-hero-2.jpg",
            "/IMAGES/medicine-hero-3.jpg"
        ],
        // Add default images for other categories
        'default': [
            "https://via.placeholder.com/1200x400?text=Explore+Vendors",
            "https://via.placeholder.com/1200x400?text=Best+Deals",
            "https://via.placeholder.com/1200x400?text=Quality+Products"
        ]
    };

    const slideImages = categoryImages[category] || categoryImages['default'];

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

    // Fetch vendors from API
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const encodedCategory = encodeURIComponent(category);
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/category/${encodedCategory}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                const data = await response.json();
                
                // ✅ SAFETY FILTER: Only keep products that match the requested category
                let filteredData = data;
                if (category.toLowerCase() === 'jewellery') {
                    filteredData = data.filter(product => 
                        product.category === 'Jewellery' || 
                        product.category === 'jewellery' ||
                        product.category === 'Mens Jewellery' ||
                        product.category === 'Kids Jewellery' ||
                        product.category?.toLowerCase() === 'jewellery'
                    );
                    console.log('📊 Jewellery Safety Filter:', data.length, '→', filteredData.length, 'products');
                } else {
                    // For other categories, filter by exact category match
                    filteredData = data.filter(product =>
                        product.category?.toLowerCase() === category.toLowerCase()
                    );
                    console.log('📊 Category Safety Filter:', data.length, '→', filteredData.length, 'products');
                }
                
                // Extract unique vendors with their details
                const vendorMap = new Map();
filteredData.forEach(product => {
    // Use the full vendor name from product (includes branch if set)
    const vendorKey = product.vendor; // Already includes branch name if product was added with branch
    
    if (vendorKey && !vendorMap.has(vendorKey)) {
        vendorMap.set(vendorKey, {
            name: vendorKey, // This will be "BusinessName - BranchName" format
            image: product.image || product.vendorImage,
            lat: product.lat,
            lon: product.lon,
            type: product.category === 'Services' ? 'Services' : (product.category === 'General Business' ? 'General Business' : (product.subcategory || product.type || 'General')),
            productCount: 1,
            sellerId: product.sellerId,
            branchId: product.branchId
        });
    } else if (vendorKey) {
        const vendor = vendorMap.get(vendorKey);
        vendor.productCount += 1;
    }
});

                const vendorList = Array.from(vendorMap.values());

                // Add distance to vendors
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            const userLat = position.coords.latitude;
                            const userLon = position.coords.longitude;

                            const vendorsWithDistance = vendorList.map(vendor => {
                                if (vendor.lat && vendor.lon) {
                                    const distance = getDistanceFromLatLonInKm(userLat, userLon, vendor.lat, vendor.lon);
                                    return { ...vendor, distance: `${distance.toFixed(1)} km` };
                                }
                                return { ...vendor, distance: 'Location not set' };
                            });
                            setVendors(vendorsWithDistance);
                        },
                        (error) => {
                            console.warn(`Geolocation error: ${error.message}`);
                            // Try to get approximate location or show better message
                            const vendorsWithDefaultDistance = vendorList.map(vendor => {
                                if (vendor.lat && vendor.lon) {
                                    // Even without user location, show that vendor has location set
                                    return { ...vendor, distance: 'Location available' };
                                }
                                return { ...vendor, distance: 'Location not set' };
                            });
                            setVendors(vendorsWithDefaultDistance);
                        },
                        {
                            enableHighAccuracy: true,
                            timeout: 10000,
                            maximumAge: 300000 // 5 minutes
                        }
                    );
                } else {
                    console.warn("Geolocation is not supported by this browser.");
                    const vendorsWithDefaultDistance = vendorList.map(vendor => {
                        if (vendor.lat && vendor.lon) {
                            return { ...vendor, distance: 'Location available' };
                        }
                        return { ...vendor, distance: 'Location not set' };
                    });
                    setVendors(vendorsWithDefaultDistance);
                }
                
                setError(null);
            } catch (err) {
                console.error('Error fetching vendors:', err);
                setError('Failed to load vendors. Please try again later.');
                setVendors([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, [category, getDistanceFromLatLonInKm]);

    // Carousel auto-slide
    useEffect(() => {
        const slideInterval = setInterval(() => {
            setCurrentSlide(prev => (prev + 1) % slideImages.length);
        }, 5000);
        return () => clearInterval(slideInterval);
    }, [slideImages.length]);

    // Handle search filtering
    useEffect(() => {
        if (!searchQuery || !searchQuery.trim()) {
            setFilteredVendors(vendors);
            return;
        }

        const query = searchQuery.toLowerCase().trim();
        const filtered = vendors.filter(vendor => {
            const nameMatch = vendor.name?.toLowerCase().includes(query);
            const typeMatch = vendor.type?.toLowerCase().includes(query);
            
            return nameMatch || typeMatch;
        });
        
        setFilteredVendors(filtered);
    }, [searchQuery, vendors]);

    const handleVendorClick = (vendorName) => {
        navigateTo(targetPage, { vendor: vendorName });
    };

    const getCategoryIcon = (category) => {
        const icons = {
            'Food & Dining': '🍽️',
            'Medicines': '💊',
            'Automotive': '🚗',
            'Services': '🔧',
            'Jewellery': '💍',
            'Clothes': '👕',
            'Beauty Products': '💄',
            'Grocery': '🛒',
            'Fruits': '🍎',
            'Books': '📚',
            'Pet Food': '🐾',
            'Musical Instruments': '🎸',
            'Footwear': '👟',
            'Home Furniture': '🛋️',
            'Bags': '👜',
            'Kitchen Products': '🍳',
            'Organic Veggies&Fruits': '🥬',
            'Sports & Fitness': '⚽',
            'Watches': '⌚',
            'Home Decor': '🏠'
        };
        return icons[category] || '🏪';
    };

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`${category} slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className="section" id="vendors">
                <div className="container">
                    <div className="section-title">
                        <h2>{getCategoryIcon(category)} {categoryDisplayName} Vendors</h2>
                        <p>Select a vendor to browse their products</p>
                        {searchQuery && (
                            <p className="search-results-info">
                                {filteredVendors.length} result{filteredVendors.length !== 1 ? 's' : ''} found for "{searchQuery}"
                            </p>
                        )}
                    </div>
                    {loading && (
                        <div className="loading-message">
                            <p>Loading vendors...</p>
                        </div>
                    )}
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    {!loading && !error && filteredVendors.length === 0 && searchQuery && (
                        <div className="no-results-message">
                            <p>No vendors found for "{searchQuery}". Try a different search term.</p>
                        </div>
                    )}
                    {!loading && !error && filteredVendors.length === 0 && !searchQuery && (
                        <div className="no-results-message">
                            <p>No vendors available in this category yet.</p>
                        </div>
                    )}
                    {!loading && !error && filteredVendors.length > 0 && (
                        <div className="vendor-grid">
                            {filteredVendors.map((vendor, index) => (
                                <div 
                                    key={index} 
                                    className="vendor-card"
                                    onClick={() => handleVendorClick(vendor.name)}
                                >
                                    <div className="vendor-image">
                                        <img 
                                            src={vendor.image || 'https://via.placeholder.com/300x200?text=Vendor'} 
                                            alt={vendor.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Vendor'}
                                        />
                                    </div>
                                    <div className="vendor-info">
                                        <h3>{vendor.name}</h3>
                                        <div className="vendor-details">
                                            <span className="vendor-type">{vendor.type}</span>
                                        </div>
                                        <div className="vendor-meta">
                                            <span className="vendor-distance">📍 {vendor.distance}</span>
                                            <span className="vendor-items">{vendor.productCount} items</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default GenericVendorList;