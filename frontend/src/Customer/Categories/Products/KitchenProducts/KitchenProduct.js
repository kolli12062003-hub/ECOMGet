import React, { useState, useEffect, useCallback } from 'react';
import KitchenProductCard from './KitchenProductCard';
import './KitchenProduct.css';
import { allKitchenProducts } from './KitchenProductDetail';

const KitchenProduct = ({ wishlistItems, onAddToCart, onToggleWishlist, onViewProduct, cartItems, navigateTo, searchQuery, selectedVendor }) => {
    const [products, setProducts] = useState(allKitchenProducts);
    const [filteredProducts, setFilteredProducts] = useState(allKitchenProducts);
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideImages = [
        "/IMAGES/kitchen-hero-1.webp",
        "/IMAGES/kitchen-hero-2.webp",
        "/IMAGES/kithchen-hero-3.webp"
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
        console.log('Kitchen - Selected Vendor:', selectedVendor);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    const productsWithDistance = allKitchenProducts.map(product => {
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
                    const productsWithDefaultDistance = allKitchenProducts.map(p => ({...p, distance: 'Within 5km'}));
                    setProducts(productsWithDefaultDistance);
                }
            );
        } else {
            console.warn("Geolocation is not supported by this browser.");
            const productsWithDefaultDistance = allKitchenProducts.map(p => ({...p, distance: 'Within 5km'}));
            setProducts(productsWithDefaultDistance);
        }
    }, [getDistanceFromLatLonInKm]);

    useEffect(() => {
        console.log('Kitchen - Selected Vendor:', selectedVendor);
        console.log('Kitchen - Search Query:', searchQuery);
        console.log('Kitchen - Products Count:', products.length);
        
        let filtered = [...products];

        if (selectedVendor) {
            console.log('Filtering products by vendor:', selectedVendor);
            filtered = filtered.filter(product => {
                console.log(`Product: ${product.name}, Vendor: ${product.vendor}, Match: ${product.vendor === selectedVendor}`);
                return product.vendor === selectedVendor;
            });
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
        
        console.log('Final Filtered Kitchen Products Count:', filtered.length);
        setFilteredProducts(filtered);
    }, [searchQuery, products, selectedVendor]);

    const isProductInWishlist = (productId) => {
        return wishlistItems.some(item => (item._id || item.id) === productId);
    };

    return (
        <>
            <section className="hero" id="hero">
                <div className="hero-carousel">
                    <div className="carousel-slides" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                        {slideImages.map((img, index) => (
                            <div className="carousel-slide" key={index}>
                                <img src={img} alt={`Kitchen Products slide ${index + 1}`} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section id="kitchenproduct" className="section">
                <div className="container">
                    {selectedVendor && (
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ color: '#333', fontSize: '2rem' }}>{selectedVendor} - Kitchen Products</h2>
                        </div>
                    )}
                    {!selectedVendor && (
                        <div className="section-title">
                            <h2>Kitchen Products</h2>
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
                    {filteredProducts.length === 0 && (
                        <div className="no-results-message" style={{ textAlign: 'center', padding: '50px' }}>
                            <p>
                                No kitchen products found{selectedVendor ? ` in ${selectedVendor}` : ''}
                                {searchQuery ? ` for "${searchQuery}"` : ''}.
                            </p>
                        </div>
                    )}
                    {filteredProducts.length > 0 && (
                        <div className="product-grid">
                            {filteredProducts.map(product => (
                                <KitchenProductCard key={product.id} product={product} onAddToCart={onAddToCart} onToggleWishlist={onToggleWishlist} onViewProduct={onViewProduct} isWishlisted={isProductInWishlist(product.id)} cartItems={cartItems} navigateTo={navigateTo} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </>
    );
};

export default KitchenProduct;