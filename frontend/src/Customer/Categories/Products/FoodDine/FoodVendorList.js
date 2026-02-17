import React, { useState, useEffect, useCallback } from 'react';
import './FoodVendorList.css';

const FoodVendorList = ({ navigateTo, searchQuery }) => {
    const [vendors, setVendors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredVendors, setFilteredVendors] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const slideImages = [
        "../IMAGES/a3e06c8f7b389ecacdbcd59f2b29fc17.jpg",
        "../IMAGES/pngtree-salad-with-vegetables-in-a-black-bowl-image_2962609.jpg",
        "../IMAGES/arabic-shawarma-with-fries-ketchup-raita-served-dish-isolated-grey-background-side-view-fastfood_689047-1158.jpg"
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

    // Fetch vendors from API
    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const response = await fetch('${process.env.REACT_APP_API_URL}/api/products/category/Food%20%26%20Dining');
                if (!response.ok) {
                    throw new Error('Failed to fetch vendors');
                }
                const data = await response.json();
                
                // Extract unique vendors with their details
                const vendorMap = new Map();
                data.forEach(product => {
                    if (product.vendor && !vendorMap.has(product.vendor)) {
                        vendorMap.set(product.vendor, {
                            name: product.vendor,
                            image: product.image || product.vendorImage,
                            lat: product.lat,
                            lon: product.lon,
                            rating: product.rating || 4.0,
                            cuisine: product.subcategory || 'Multi-Cuisine',
                            productCount: 1
                        });
                    } else if (product.vendor) {
                        const vendor = vendorMap.get(product.vendor);
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
                                return { ...vendor, distance: 'Within 5km' };
                            });
                            setVendors(vendorsWithDistance);
                        },
                        (error) => {
                            console.warn(`Geolocation error: ${error.message}`);
                            const vendorsWithDefaultDistance = vendorList.map(v => ({...v, distance: 'Within 5km'}));
                            setVendors(vendorsWithDefaultDistance);
                        }
                    );
                } else {
                    console.warn("Geolocation is not supported by this browser.");
                    const vendorsWithDefaultDistance = vendorList.map(v => ({...v, distance: 'Within 5km'}));
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
    }, [getDistanceFromLatLonInKm]);

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
            const cuisineMatch = vendor.cuisine?.toLowerCase().includes(query);
            
            return nameMatch || cuisineMatch;
        });
        
        setFilteredVendors(filtered);
    }, [searchQuery, vendors]);

    const handleVendorClick = (vendorName) => {
        navigateTo('food-products', { vendor: vendorName });
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
            <section className="section" id="vendors">
                <div className="container">
                    <div className="section-title">
                        <h2>Restaurants & Food Vendors</h2>
                        <p>Select a restaurant to view their menu</p>
                        {searchQuery && (
                            <p className="search-results-info">
                                {filteredVendors.length} result{filteredVendors.length !== 1 ? 's' : ''} found for "{searchQuery}"
                            </p>
                        )}
                    </div>
                    {loading && (
                        <div className="loading-message">
                            <p>Loading restaurants...</p>
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
                                            src={vendor.image || 'https://via.placeholder.com/300x200?text=Restaurant'} 
                                            alt={vendor.name}
                                            onError={(e) => e.target.src = 'https://via.placeholder.com/300x200?text=Restaurant'}
                                        />
                                    </div>
                                    <div className="vendor-info">
                                        <h3>{vendor.name}</h3>
                                        <div className="vendor-details">
                                            <span className="vendor-cuisine">{vendor.cuisine}</span>
                                            <span className="vendor-rating">⭐ {vendor.rating}</span>
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

export default FoodVendorList;