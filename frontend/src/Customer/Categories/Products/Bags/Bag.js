import React, { useState, useEffect, useCallback } from 'react';
import BagCard from './BagCard';
import './Bag.css';
import { allBagProducts } from './BagProductDetail';

const Bag = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, searchQuery, cartItems, navigateTo }) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [vendors, setVendors] = useState([]);
    const [selectedVendor, setSelectedVendor] = useState(null);
    
    const slideImages = [
        "/IMAGES/bags-hero-1.jpg",
        "/IMAGES/bags-hero-2.png",
        "/IMAGES/bags-hero-3.jpg"
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
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    const productsWithDistance = allBagProducts.map(product => {
                        if (product.lat && product.lon) {
                            const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                            return { ...product, distance: `${distance.toFixed(1)} km away` };
                        }
                        return { ...product, distance: 'Distance N/A' };
                    });
                    setProducts(productsWithDistance);
                },
                (error) => {
                    console.warn(`Geolocation error: ${error.message}.`);
                    const productsWithDefaultDistance = allBagProducts.map(p => ({...p, distance: 'Within 5km'}));
                    setProducts(productsWithDefaultDistance);
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            const productsWithDefaultDistance = allBagProducts.map(p => ({...p, distance: 'Within 5km'}));
            setProducts(productsWithDefaultDistance);
        }
    }, [getDistanceFromLatLonInKm]);

    // Extract unique vendors from products
    useEffect(() => {
        if (products.length > 0) {
            const vendorMap = {};
            products.forEach(product => {
                if (product.vendor) {
                    if (!vendorMap[product.vendor]) {
                        vendorMap[product.vendor] = {
                            name: product.vendor,
                            category: product.category || 'Bags',
                            itemCount: 0,
                            distance: product.distance,
                            rating: 4
                        };
                    }
                    vendorMap[product.vendor].itemCount++;
                }
            });
            setVendors(Object.values(vendorMap));
        }
    }, [products]);

    // Handle vendor and search filtering
    useEffect(() => {
        console.log('Selected Vendor:', selectedVendor);
        console.log('Bag Search Query:', searchQuery);
        console.log('Bag Products Count:', products.length);
        
        let filtered = [...products];

        // Filter by vendor first (if a vendor is selected)
        if (selectedVendor) {
            console.log('Filtering by vendor:', selectedVendor);
            filtered = filtered.filter(product => product.vendor === selectedVendor);
            console.log('Products after vendor filter:', filtered.length);
        }

        // Then apply search filter
        if (searchQuery && searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            filtered = filtered.filter(product => {
                const nameMatch = product.name?.toLowerCase().includes(query);
                const vendorMatch = product.vendor?.toLowerCase().includes(query);
                const categoryMatch = product.category?.toLowerCase().includes(query);
                
                return nameMatch || vendorMatch || categoryMatch;
            });
        }
        
        console.log('Final Filtered Bag Products Count:', filtered.length);
        setFilteredProducts(filtered);
    }, [searchQuery, products, selectedVendor]);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    const handleVendorClick = (vendorName) => {
        console.log('Vendor clicked:', vendorName);
        setSelectedVendor(vendorName);
    };

    const handleBackToVendors = () => {
        setSelectedVendor(null);
    };

    // If a vendor is selected, show their products
    if (selectedVendor) {
        return (
            <>
                <section className="hero" id="hero">
                    <div className="hero-carousel">
                        <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                            {slideImages.map((img, index) => (
                                <div className="carousel-slide" key={index}>
                                    <img src={img} alt={`Bags slide ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                <section id="bag" className="section">
                    <div className="container">
                        <button 
                            onClick={handleBackToVendors}
                            style={{
                                marginBottom: '20px',
                                padding: '10px 20px',
                                backgroundColor: '#4a90e2',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: 'pointer'
                            }}
                        >
                            ← Back to Vendors
                        </button>
                        
                        <div className="section-title">
                            <h2>{selectedVendor} - Bags</h2>
                        </div>
                        
                        {searchQuery && (
                            <div className="search-results-info" style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <p>
                                    {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found in {selectedVendor} for "{searchQuery}"
                                </p>
                            </div>
                        )}

                        {filteredProducts.length === 0 ? (
                            <div className="no-results-message" style={{ textAlign: 'center', padding: '50px' }}>
                                <p>No products found in {selectedVendor}{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
                            </div>
                        ) : (
                            <div className="product-grid">
                                {filteredProducts.map(product => (
                                    <BagCard 
                                        key={product.id} 
                                        product={product} 
                                        onAddToCart={onAddToCart} 
                                        onToggleWishlist={onToggleWishlist} 
                                        onViewProduct={onViewProduct} 
                                        isWishlisted={isProductInWishlist(product.id)} 
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
    }

    // Otherwise, show vendor selection
    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Bags slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section id="bag-vendors" className="section">
                <div className="container">
                    <div className="section-title" style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333' }}>
                            👜 BAG VENDORS
                        </h2>
                        <p style={{ fontSize: '1.1rem', color: '#666', marginTop: '10px' }}>
                            Select a vendor to browse their products
                        </p>
                    </div>
                    
                    {vendors.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '50px' }}>
                            <p>No vendors found.</p>
                        </div>
                    ) : (
                        <div className="product-grid">
                            {vendors.map((vendor, index) => (
                                <div 
                                    key={index}
                                    className="vendor-card"
                                    onClick={() => handleVendorClick(vendor.name)}
                                    style={{
                                        backgroundColor: '#f5f5f5',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s, box-shadow 0.3s',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'translateY(-5px)';
                                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                                    }}
                                >
                                    <h3 style={{ fontSize: '1.5rem', marginBottom: '10px', color: '#333' }}>
                                        {vendor.name}
                                    </h3>
                                    <p style={{ color: '#666', marginBottom: '5px' }}>
                                        {vendor.category}
                                    </p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px' }}>
                                        <span style={{ color: '#e74c3c' }}>
                                            📍 {vendor.distance}
                                        </span>
                                        <span style={{ color: '#f39c12' }}>
                                            ⭐ {vendor.rating}
                                        </span>
                                    </div>
                                    <p style={{ color: '#27ae60', marginTop: '10px', fontWeight: 'bold' }}>
                                        {vendor.itemCount} {vendor.itemCount === 1 ? 'item' : 'items'}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default Bag;