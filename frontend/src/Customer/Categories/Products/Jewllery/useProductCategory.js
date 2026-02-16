import { useState, useEffect, useCallback } from 'react';

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const deg2rad = (deg) => deg * (Math.PI / 180);
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
};

export const useProductCategory = (categoryName, searchQuery) => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addDistanceToProducts = useCallback((prods, userLat, userLon) => {
        return prods.map(product => {
            if (product.lat && product.lon) {
                const distance = getDistanceFromLatLonInKm(userLat, userLon, product.lat, product.lon);
                return { ...product, distance: `${distance.toFixed(1)} km away` };
            }
            return { ...product, distance: 'Distance N/A' };
        });
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:5000/api/products/category/${categoryName}`);
                if (response.ok) {
                    let data = await response.json();
                    setProducts(data);
                    setFilteredProducts(data); // Initially set filtered to all
                } else {
                    setError(`Failed to load ${categoryName} products`);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [categoryName]);

    useEffect(() => {
        if (products.length > 0 && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;
                    const productsWithDistance = addDistanceToProducts(products, userLat, userLon);
                    setProducts(productsWithDistance);
                    setFilteredProducts(productsWithDistance);
                },
                () => { // On error, just use products without distance
                    setFilteredProducts(products.map(p => ({...p, distance: 'Within 5km' })));
                }
            );
        }
    }, [products, addDistanceToProducts]);

    useEffect(() => {
        setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
    }, [searchQuery, products]);

    return { filteredProducts, loading, error };
};