import React, { useState, useEffect, useRef } from 'react';
import './SellerDashboard.css';
import { categoriesData } from '../Customer/Categories/ShopByCategory/data';

// Subcategory mapping for different categories
const subcategoryMap = {
    'Clothes': ['Men', 'Women', 'Kids'],
    'Footwear': ["Men's Footwear", "Women's Footwear", "Kids' Footwear"],
    'Jewellery': ["Men's Jewellery", "Women's Jewellery", "Kids' Jewellery"],
    'Watches': ["Men's Watches", "Women's Watches", "Kids' Watches"],
    
    // Add default empty array for categories without subcategories
    'Food & Dining': [],
    'Medicines': [],
    'Automotive': [],
    'Services': [],
    'Bags': [],
    'Beauty Products': [],
    'Sports & Fitness': [],
    'Home Furniture': [],
    'Groceries': [],
    'Home Decor': [],
    'Musical Instruments': [],
    'Books': [],
    'Pet Food': [],
    'Organic Veggies & Fruits': []
};

const SellerDashboard = ({ seller, setAllProducts, onLogout, navigateTo }) => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProductsState] = useState([]);
    const [offers, setOffers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [formData, setFormData] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [profileData, setProfileData] = useState({
        businessName: seller?.businessName || '',
        businessType: seller?.businessType || '',
        address: seller?.address || '',
        lat: seller?.lat || null,
        lon: seller?.lon || null
    });
    const [fetchingLocation, setFetchingLocation] = useState(false);
    const fileInputRef = useRef(null);

    // Format date helper
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    // Fetch seller profile
    const fetchProfile = async () => {
        try {
            console.log('🔄 Refreshing profile data for:', seller.email);
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/profile?email=${seller.email}`);
            if (response.ok) {
                const sellerData = await response.json();
                console.log('✅ Profile refresh received:', sellerData);
                console.log('   Address:', sellerData.address);
                console.log('   Lat:', sellerData.lat);
                console.log('   Lon:', sellerData.lon);
                setProfileData({
                    businessName: sellerData.businessName || '',
                    businessType: sellerData.businessType || '',
                    address: sellerData.address || '',
                    lat: sellerData.lat || null,
                    lon: sellerData.lon || null
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    // Handle profile update
    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/api/seller/profile/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: seller.email,
                    businessName: profileData.businessName,
                    businessType: profileData.businessType,
                    address: profileData.address,
                    lat: profileData.lat,
                    lon: profileData.lon
                }),
            });

            const result = await response.json();
            if (result.message) {
                alert('Profile updated successfully!');
                setIsEditingProfile(false);
                // Update profileData with the response to reflect saved values
                if (result.seller) {
                    setProfileData({
                        businessName: result.seller.businessName || '',
                        businessType: result.seller.businessType || '',
                        address: result.seller.address || '',
                        lat: result.seller.lat || null,
                        lon: result.seller.lon || null
                    });
                }
            } else {
                alert('Error updating profile: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile');
        }
    };

    // Handle address geocoding with automatic address fetching
    const handleAddressGeocode = () => {
        if (navigator.geolocation) {
            setFetchingLocation(true);
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    try {
                        // Fetch address from coordinates using Nominatim (OpenStreetMap)
                        const response = await fetch(
                            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                            {
                                headers: {
                                    'Accept-Language': 'en'
                                }
                            }
                        );
                        
                        if (response.ok) {
                            const data = await response.json();
                            
                            // Format the address nicely
                            const addressParts = [];
                            if (data.address.house_number) addressParts.push(data.address.house_number);
                            if (data.address.road) addressParts.push(data.address.road);
                            if (data.address.suburb) addressParts.push(data.address.suburb);
                            if (data.address.city) addressParts.push(data.address.city);
                            if (data.address.state) addressParts.push(data.address.state);
                            if (data.address.postcode) addressParts.push(data.address.postcode);
                            
                            const formattedAddress = addressParts.join(', ') || data.display_name;
                            
                            setProfileData(prev => ({
                                ...prev,
                                lat: latitude,
                                lon: longitude,
                                address: formattedAddress
                            }));
                            
                            alert(`✅ Location captured successfully!\n\nAddress: ${formattedAddress}\nCoordinates: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
                        } else {
                            // If reverse geocoding fails, still save coordinates
                            setProfileData(prev => ({
                                ...prev,
                                lat: latitude,
                                lon: longitude
                            }));
                            alert(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
                        }
                    } catch (error) {
                        console.error('Error fetching address:', error);
                        // Still save coordinates even if address fetch fails
                        setProfileData(prev => ({
                            ...prev,
                            lat: latitude,
                            lon: longitude
                        }));
                        alert(`Location captured: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nNote: Could not fetch address automatically. Please enter your address manually.`);
                    } finally {
                        setFetchingLocation(false);
                    }
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setFetchingLocation(false);
                    
                    let errorMessage = 'Error getting location. ';
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage += 'Please allow location access in your browser settings.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage += 'Location information is unavailable.';
                            break;
                        case error.TIMEOUT:
                            errorMessage += 'Location request timed out.';
                            break;
                        default:
                            errorMessage += 'Please enter coordinates manually or check your browser permissions.';
                    }
                    alert(errorMessage);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    // Fetch seller's products and orders from backend
    
    // Fetch seller's products and orders from backend
useEffect(() => {
    const fetchSellerData = async () => {
        try {
            // 🔍 FETCH PROFILE DATA IMMEDIATELY
            console.log('🔍 Fetching profile for:', seller.email);
            const profileResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/profile?email=${seller.email}`);
            if (profileResponse.ok) {
                const sellerData = await profileResponse.json();
                console.log('✅ Profile data received:', sellerData);
                console.log('   Address:', sellerData.address);
                console.log('   Lat:', sellerData.lat);
                console.log('   Lon:', sellerData.lon);
                setProfileData({
                    businessName: sellerData.businessName || '',
                    businessType: sellerData.businessType || '',
                    address: sellerData.address || '',
                    lat: sellerData.lat || null,
                    lon: sellerData.lon || null
                });
            }

            // Fetch products by seller ID
            const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products?sellerId=${seller.id}`);
            if (productsResponse.ok) {
                const contentType = productsResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const sellerProducts = await productsResponse.json();
                    setProducts(sellerProducts);
                } else {
                    throw new Error('Response is not JSON');
                }
            } else {
                throw new Error('Failed to fetch products');
            }

            // ⭐ NEW: Fetch branches immediately on load
            const branchesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches?email=${seller.email}`);
            if (branchesResponse.ok) {
                const branchesData = await branchesResponse.json();
                setBranches(branchesData);
                console.log('✅ Branches loaded:', branchesData.length);
            } else {
                console.log('ℹ️ No branches found');
            }

            // For now, orders are stored locally, but you can add an orders API later
            const localOrders = JSON.parse(localStorage.getItem('sellerOrders') || '[]');
            setOrders(localOrders);
        } catch (error) {
            console.error('Error fetching seller data:', error);
            // Set products to empty array if API fails
            setProducts([]);
        }
    };

    if (seller && seller.id && seller.email) {
        fetchSellerData();
    }
}, [seller]);
    // Fetch profile data when profile tab is active (refresh)
    useEffect(() => {
        if (activeTab === 'profile' && seller && seller.email) {
            fetchProfile();
        }
    }, [activeTab, seller]);

    // Fetch offers when offers tab is active
    useEffect(() => {
        if (activeTab === 'offers' && seller && seller.email) {
            fetchOffers();
        }
    }, [activeTab, seller]);

    // Fetch branches when branches tab is active
    useEffect(() => {
        if (activeTab === 'branches' && seller && seller.email) {
            fetchBranches();
        }
    }, [activeTab, seller]);

    const fetchProducts = async () => {
        try {
            const productsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/products?sellerId=${seller.id}`);
            if (productsResponse.ok) {
                const contentType = productsResponse.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const sellerProducts = await productsResponse.json();
                    setProducts(sellerProducts);
                } else {
                    throw new Error('Response is not JSON');
                }
            } else {
                throw new Error('Failed to fetch products');
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            setProducts([]);
        }
    };

    const fetchOffers = async () => {
        try {
            const response = await fetch('${process.env.REACT_APP_API_URL}/api/offers', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const offers = await response.json();
                setOffers(offers);
            }
        } catch (error) {
            console.error('Error fetching offers:', error);
            setOffers([]);
        }
    };

    const fetchBranches = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches?email=${seller.email}`);
            if (response.ok) {
                const branches = await response.json();
                setBranches(branches);
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            setBranches([]);
        }
    };

    const handleAddOffer = async (e) => {
        e.preventDefault();

        const discountValue = parseFloat(formData.discountValue);
        if (!discountValue || discountValue <= 0) {
            alert('Please enter a valid discount value greater than 0.');
            return;
        }

        if (formData.discountType === 'percentage' && discountValue > 100) {
            alert('Percentage discount cannot exceed 100%.');
            return;
        }

        try {
            const offerData = {
                type: formData.type,
                targetId: formData.type === 'seller' ? seller.businessName : formData.targetId,
                discountType: formData.discountType,
                discountValue: discountValue,
                description: formData.description || ''
            };

            const response = await fetch('${process.env.REACT_APP_API_URL}/api/offers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(offerData)
            });

            if (response.ok) {
                alert('Offer submitted for admin approval!');
                closeModal();
                fetchOffers();
            } else {
                const errorData = await response.json();
                alert('Failed to create offer: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error creating offer:', error);
            alert('Error creating offer');
        }
    };

    const handleAddBranch = async (e) => {
        e.preventDefault();

        const { name, address, lat, lon, isMain } = formData;
        if (!name?.trim() || !address?.trim() || lat === undefined || lon === undefined) {
            alert('Please fill all required fields and get location.');
            return;
        }

        try {
            const branchData = {
                email: seller.email,
                name: name.trim(),
                address: address.trim(),
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                isMain: isMain || false
            };

            const response = await fetch('${process.env.REACT_APP_API_URL}/api/seller/branches', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(branchData)
            });

            if (response.ok) {
                alert('Branch added successfully!');
                closeModal();
                fetchBranches();
            } else {
                const errorData = await response.json();
                alert('Failed to add branch: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error adding branch:', error);
            alert('Error adding branch');
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();

        // Check if all required fields are filled
        const name = formData.name?.trim();
        const price = formData.price;
        const category = formData.category?.trim();
        const stock = formData.stock;
        const description = formData.description?.trim();
        const imageFile = formData.imageFile;

        console.log('🔍 DEBUG - Product form data:', {
            name,
            price,
            category,
            stock,
            description: description || 'EMPTY',
            expireDate: formData.expireDate || 'EMPTY',
            expiryDate: formData.expiryDate || 'EMPTY',
            warranty: formData.warranty || 'EMPTY',
            subcategory: formData.subcategory || 'EMPTY',
            hasImage: !!imageFile
        });

        if (!name) {
            alert('Please enter a product name.');
            return;
        }
        if (!price || isNaN(price) || price <= 0) {
            alert('Please enter a valid price greater than 0.');
            return;
        }
        if (!category) {
            alert('Please select a category.');
            return;
        }
        if (!formData.branchId) {
            alert('Please select a branch.');
            return;
        }
        if (stock === undefined || stock === null || stock === '' || isNaN(stock) || stock < 0) {
            alert('Please enter a valid stock quantity (0 or greater).');
            return;
        }
        if (!description) {
            alert('Please enter a product description.');
            return;
        }
        if (formData.addedBy === 'earner') {
            if (!formData.earnerName?.trim()) {
                alert('Please enter the earner name.');
                return;
            }
            if (!formData.earnerEmail?.trim()) {
                alert('Please enter the earner email.');
                return;
            }
        }
        if (!imageFile) {
            alert('Please select an image file.');
            return;
        }

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('price', parseFloat(formData.price));
            formDataToSend.append('stock', parseInt(formData.stock));
            formDataToSend.append('category', formData.category);
            formDataToSend.append('branchId', formData.branchId);
            if (formData.subcategory) {
                formDataToSend.append('subcategory', formData.subcategory);
            }
// Get full vendor name with branch
const selectedBranch = branches.find(b => b._id === formData.branchId);
const fullVendorName = selectedBranch 
    ? `${seller.businessName} - ${selectedBranch.name}`
    : seller.businessName;
formDataToSend.append('vendor', fullVendorName);            formDataToSend.append('sellerId', seller.id);
            formDataToSend.append('description', description);
            
            // Support both expireDate and expiryDate fields
            if (formData.expireDate) {
                formDataToSend.append('expireDate', formData.expireDate);
            }
            if (formData.expiryDate) {
                formDataToSend.append('expiryDate', formData.expiryDate);
            }
            if (formData.warranty) {
                formDataToSend.append('warranty', formData.warranty);
            }

            // Add new fields for product added by
            formDataToSend.append('addedBy', formData.addedBy || 'self');
            if (formData.addedBy === 'earner') {
                formDataToSend.append('earnerName', formData.earnerName);
                formDataToSend.append('earnerEmail', formData.earnerEmail);
            }

            if (formData.imageFile) {
                formDataToSend.append('image', formData.imageFile);
            }

            const response = await fetch('${process.env.REACT_APP_API_URL}/api/products', {
                method: 'POST',
                body: formDataToSend,
            });

            if (response.ok) {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const newProduct = await response.json();
                    setProducts(prev => [...prev, newProduct]);
                    setAllProducts(prev => [...prev, newProduct]);
                    alert(`Product "${formData.name}" has been added successfully!`);
                    
                    // Clear the form and keep modal open for next product
                    setFormData({ category: 'Food & Dining' });
                    // Clear the file input
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    
                    fetchProducts(); // Refresh the products list
                } else {
                    throw new Error('Response is not JSON');
                }
            } else {
                alert('Failed to add product');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            alert('Error adding product');
        }
    };

    const handleEditProduct = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled (image is optional for edit)
    const name = formData.name?.trim();
    const price = formData.price;
    const category = formData.category?.trim();
    const stock = formData.stock;
    const description = formData.description?.trim();

    if (!name) {
        alert('Please enter a product name.');
        return;
    }
    if (!price || isNaN(price) || price <= 0) {
        alert('Please enter a valid price greater than 0.');
        return;
    }
    if (!category) {
        alert('Please select a category.');
        return;
    }
    if (!formData.branchId) {
        alert('Please select a branch.');
        return;
    }
    if (stock === undefined || stock === null || stock === '' || isNaN(stock) || stock < 0) {
        alert('Please enter a valid stock quantity (0 or greater).');
        return;
    }
    if (!description) {
        alert('Please enter a product description.');
        return;
    }
    if (formData.addedBy === 'earner') {
        if (!formData.earnerName?.trim()) {
            alert('Please enter the earner name.');
            return;
        }
        if (!formData.earnerEmail?.trim()) {
            alert('Please enter the earner email.');
            return;
        }
    }

    try {
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('price', parseFloat(formData.price));
        formDataToSend.append('stock', parseInt(formData.stock));
        formDataToSend.append('category', formData.category);
        formDataToSend.append('branchId', formData.branchId);
        if (formData.subcategory) {
            formDataToSend.append('subcategory', formData.subcategory);
        }
        // ⭐ CRITICAL FIX: Add these two fields
// Get full vendor name with branch
const selectedBranch = branches.find(b => b._id === formData.branchId);
const fullVendorName = selectedBranch 
    ? `${seller.businessName} - ${selectedBranch.name}`
    : seller.businessName;
formDataToSend.append('vendor', fullVendorName);        formDataToSend.append('sellerId', seller.id);
        
        formDataToSend.append('description', description);
        
        // Support both expireDate and expiryDate fields
        if (formData.expireDate) {
            formDataToSend.append('expireDate', formData.expireDate);
        }
        if (formData.expiryDate) {
            formDataToSend.append('expiryDate', formData.expiryDate);
        }
        if (formData.warranty) {
            formDataToSend.append('warranty', formData.warranty);
        }

        // Add new fields for product added by
        formDataToSend.append('addedBy', formData.addedBy || 'self');
        if (formData.addedBy === 'earner') {
            formDataToSend.append('earnerName', formData.earnerName);
            formDataToSend.append('earnerEmail', formData.earnerEmail);
        }

        if (formData.imageFile) {
            formDataToSend.append('image', formData.imageFile);
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${formData._id}`, {
            method: 'PUT',
            body: formDataToSend,
        });

        if (response.ok) {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const updatedProduct = await response.json();
                setProducts(prev => prev.map(p => p._id === formData._id ? updatedProduct : p));
                setAllProducts(prev => prev.map(p => p._id === formData._id ? updatedProduct : p));
                alert(`Product "${formData.name}" has been updated!`);
                closeModal();
                fetchProducts(); // Refresh the products list
            } else {
                throw new Error('Response is not JSON');
            }
        } else {
            const errorData = await response.json();
            alert('Failed to update product: ' + (errorData.message || 'Unknown error'));
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product: ' + error.message);
    }
};

    const handleEditBranch = async (e) => {
        e.preventDefault();

        const { name, address, lat, lon, isMain } = formData;
        if (!name?.trim() || !address?.trim() || lat === undefined || lon === undefined) {
            alert('Please fill all required fields.');
            return;
        }

        try {
            const branchData = {
                email: seller.email,
                name: name.trim(),
                address: address.trim(),
                lat: parseFloat(lat),
                lon: parseFloat(lon),
                isMain: isMain || false
            };

            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches/${formData._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(branchData)
            });

            if (response.ok) {
                alert('Branch updated successfully!');
                closeModal();
                fetchBranches();
            } else {
                const errorData = await response.json();
                alert('Failed to update branch: ' + (errorData.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Error updating branch:', error);
            alert('Error updating branch');
        }
    };

    const handleAddOrder = (e) => {
        e.preventDefault();
        const newOrder = {
            id: formData.id || Date.now().toString(),
            customer: formData.customer,
            amount: parseFloat(formData.amount),
            status: formData.status || 'pending',
            date: formData.date || new Date().toISOString().split('T')[0]
        };

        const updatedOrders = editIndex !== null ?
            orders.map((order, i) => i === editIndex ? newOrder : order) :
            [...orders, newOrder];

        setOrders(updatedOrders);
        localStorage.setItem('sellerOrders', JSON.stringify(updatedOrders));
        closeModal();
    };

    const openModal = (type, data = null, index = null) => {
        setModalType(type);
        setEditIndex(index);
        if (data && type === 'product') {
            // Format date for date input (YYYY-MM-DD) - handle both expireDate and expiryDate
            const formattedData = {
                ...data,
                expireDate: data.expireDate ? new Date(data.expireDate).toISOString().split('T')[0] : '',
                expiryDate: data.expiryDate ? new Date(data.expiryDate).toISOString().split('T')[0] : 
                           (data.expireDate ? new Date(data.expireDate).toISOString().split('T')[0] : '')
            };
            setFormData(formattedData);
        } else if (type === 'offer') {
            setFormData(data || {
                type: 'product',
                discountType: 'percentage',
                discountValue: '',
                description: ''
            });
        } else if (type === 'branch') {
            setFormData(data || {
                name: '',
                address: '',
                lat: '',
                lon: '',
                isMain: false
            });
        } else {
            setFormData(data || (type === 'product' ? { category: 'Food & Dining' } : {}));
        }
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setFormData({});
        setEditIndex(null);
    };

    const deleteProduct = async (productId, index) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ sellerId: seller.id })
                });
                if (response.ok) {
                    setProducts(prev => prev.filter((_, i) => i !== index));
                    setAllProducts(prev => prev.filter(p => p._id !== productId));
                    alert('Product deleted successfully');
                } else {
                    alert('Failed to delete product');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                alert('Error deleting product');
            }
        }
    };

    const deleteBranch = async (branchId) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/api/seller/branches/${branchId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email: seller.email })
                });
                if (response.ok) {
                    setBranches(prev => prev.filter(b => b._id !== branchId));
                    alert('Branch deleted successfully');
                } else {
                    alert('Failed to delete branch');
                }
            } catch (error) {
                console.error('Error deleting branch:', error);
                alert('Error deleting branch');
            }
        }
    };

    const deleteOrder = (index) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            const updatedOrders = orders.filter((_, i) => i !== index);
            setOrders(updatedOrders);
            localStorage.setItem('sellerOrders', JSON.stringify(updatedOrders));
        }
    };

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    return (
        <div className="dashboard-container">
            <div className="sidebar">
                <div className="sidebar-header">
                    <h1><i className="fas fa-store"></i> Seller Center</h1>
                </div>
                <div className="seller-info">
                    <h3>{seller.name}</h3>
                    <p>Business Dashboard</p>
                </div>
                <nav className="sidebar-nav">
                    <a href="#" className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
                        <i className="fas fa-tachometer-alt"></i> Dashboard
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'products' ? 'active' : ''}`} onClick={() => setActiveTab('products')}>
                        <i className="fas fa-box"></i> Products
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'offers' ? 'active' : ''}`} onClick={() => setActiveTab('offers')}>
                        <i className="fas fa-tags"></i> Offers
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')}>
                        <i className="fas fa-map-marker-alt"></i> Branches
                    </a>
                    <a href="#" className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                        <i className="fas fa-user-edit"></i> Profile
                    </a>
                </nav>
            </div>

            <div className="main-content">
                <div className="header">
                    <h2>Seller Dashboard</h2>
                    <div className="user-actions">
                        <button
                            className="back-to-store"
                            onClick={() => {
                                const vendorName = seller && (seller.businessName || seller.businessname || seller.name || seller.fullname || seller.fullName);
                                try {
                                    if (vendorName) {
                                        if (typeof navigateTo === 'function') {
                                            navigateTo('vendor-store', { vendor: vendorName, sellerId: seller.id });
                                        } else {
                                            console.warn('navigateTo not provided - dispatching openVendorStore event');
                                            window.dispatchEvent(new CustomEvent('openVendorStore', { detail: { vendor: vendorName, sellerId: seller.id } }));
                                        }
                                    } else {
                                        if (typeof navigateTo === 'function') {
                                            navigateTo('groceries-products');
                                        } else {
                                            window.location.href = '/';
                                        }
                                    }
                                } catch (err) {
                                    console.error('Error during Visit Store navigation:', err);
                                }
                            }}
                        >
                            <i className="fas fa-store"></i> Visit Store
                        </button>
                        <button className="logout-btn" onClick={onLogout}>
                            <i className="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </div>

                <div className="stats-grid">
                    <div className="stat-card orders">
                        <div className="stat-icon">
                            <i className="fas fa-shopping-cart"></i>
                        </div>
                        <div className="stat-number">{orders.length}</div>
                        <div className="stat-label">New Orders</div>
                    </div>
                    <div className="stat-card revenue">
                        <div className="stat-icon">
                            <i className="fas fa-rupee-sign"></i>
                        </div>
                        <div className="stat-number">₹{totalRevenue}</div>
                        <div className="stat-label">Total Revenue</div>
                    </div>
                    <div className="stat-card products">
                        <div className="stat-icon">
                            <i className="fas fa-box"></i>
                        </div>
                        <div className="stat-number">{products.length}</div>
                        <div className="stat-label">Products</div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className="content-section">
                    <div className="section-header">
                        <h3>Recent Orders</h3>
                        <button className="add-btn" onClick={() => openModal('order')}>
                            <i className="fas fa-plus"></i> Add Order
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <tr key={index}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>₹{order.amount}</td>
                                    <td>
                                        <span className={`status ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{order.date}</td>
                                    <td>
                                        <button
                                            className="edit-btn action-btn"
                                            onClick={() => openModal('order', order, index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn action-btn"
                                            onClick={() => deleteOrder(index)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Products Section */}
                <div className="content-section">
                    <div className="section-header">
                        <h3>Product Management</h3>
                        <button className="add-btn" onClick={() => openModal('product')}>
                            <i className="fas fa-plus"></i> Add Product
                        </button>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Description</th>
                                <th>Warranty</th>
                                <th>Expiry Date</th>
                                <th>Category</th>
                                <th>Subcategory</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product, index) => (
                                <tr key={product._id}>
                                    <td>{product.name}</td>
                                    <td>₹{product.price}</td>
                                    <td>{product.stock || 0}</td>
                                    <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {product.description || '-'}
                                    </td>
                                    <td>{product.warranty || '-'}</td>
                                    <td>{formatDate(product.expiryDate || product.expireDate)}</td>
                                    <td>{product.category}</td>
                                    <td>{product.subcategory || '-'}</td>
                                    <td>
                                        <span className={`status ${product.status}`}>
                                            {product.status === 'pending' ? 'Pending Approval' : 
                                             product.status === 'approved' ? 'Approved' : 
                                             product.status === 'rejected' ? 'Rejected' : 'Active'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="edit-btn action-btn"
                                            onClick={() => openModal('product', product, index)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="delete-btn action-btn"
                                            onClick={() => deleteProduct(product._id, index)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Offers Section */}
                {activeTab === 'offers' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h3>Discount Offers</h3>
                            <button className="add-btn" onClick={() => openModal('offer')}>
                                <i className="fas fa-plus"></i> Create Offer
                            </button>
                        </div>
                        <div className="offers-list">
                            {offers.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    No offers created yet. Click "Create Offer" to get started.
                                </p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Target</th>
                                            <th>Discount</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Created</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {offers.map((offer) => (
                                            <tr key={offer._id}>
                                                <td>{offer.type ? offer.type.charAt(0).toUpperCase() + offer.type.slice(1) : 'Unknown'}</td>
                                                <td>
                                                    {offer.type === 'seller' ? 'All My Products' :
                                                     offer.type === 'product' ? `Product ID: ${offer.targetId || 'N/A'}` :
                                                     offer.targetId || 'N/A'}
                                                </td>
                                                <td>
                                                    {offer.discountType === 'percentage' ? `${offer.discountValue || 0}%` : `₹${offer.discountValue || 0}`}
                                                </td>
                                                <td>{offer.description || '-'}</td>
                                                <td>
                                                    <span style={{
                                                        color: offer.status === 'approved' ? '#4caf50' :
                                                               offer.status === 'pending' ? '#ff9800' : '#f44336',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        {offer.status ? offer.status.charAt(0).toUpperCase() + offer.status.slice(1) : 'Unknown'}
                                                    </span>
                                                </td>
                                                <td>{offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Branches Section */}
                {activeTab === 'branches' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h3>Store Branches</h3>
                            <button className="add-btn" onClick={() => openModal('branch')}>
                                <i className="fas fa-plus"></i> Add Branch
                            </button>
                        </div>
                        <div className="branches-list">
                            {branches.length === 0 ? (
                                <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                                    No branches added yet. Click "Add Branch" to get started.
                                </p>
                            ) : (
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Address</th>
                                            <th>Coordinates</th>
                                            <th>Main Branch</th>
                                            <th>Created</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {branches.map((branch) => (
                                            <tr key={branch._id}>
                                                <td>{branch.name}</td>
                                                <td>{branch.address}</td>
                                                <td>{branch.lat?.toFixed(6)}, {branch.lon?.toFixed(6)}</td>
                                                <td>{branch.isMain ? 'Yes' : 'No'}</td>
                                                <td>{new Date(branch.createdAt).toLocaleDateString()}</td>
                                                <td>
                                                    <button 
                                                        className="edit-btn" 
                                                        onClick={() => openModal('branch', branch)}
                                                        style={{ marginRight: '5px' }}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    <button 
                                                        className="delete-btn" 
                                                        onClick={() => deleteBranch(branch._id)}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                )}

                {/* Profile Section */}
                {activeTab === 'profile' && (
                    <div className="content-section">
                        <div className="section-header">
                            <h3>Business Profile</h3>
                            {!isEditingProfile && (
                                <button className="add-btn" onClick={() => setIsEditingProfile(true)}>
                                    <i className="fas fa-edit"></i> Edit Profile
                                </button>
                            )}
                        </div>

                        {!isEditingProfile ? (
                            // View Mode
                            <div className="profile-view">
                                <div className="profile-info-grid">
                                    <div className="info-item">
                                        <label>Full Name:</label>
                                        <span>{seller.fullname || seller.name || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Email:</label>
                                        <span>{seller.email}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Business Name:</label>
                                        <span>{profileData.businessName || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Business Type:</label>
                                        <span>{profileData.businessType || 'N/A'}</span>
                                    </div>
                                    <div className="info-item">
                                        <label>Location:</label>
                                        <span>
                                            {profileData.address || 'No address set'}
                                            {profileData.lat && profileData.lon && (
                                                <><br />Coordinates: {profileData.lat}, {profileData.lon}</>
                                            )}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Account Status:</label>
                                        <span className={`status ${seller.status}`}>
                                            {seller.status === 'active' ? 'ACTIVE' :
                                             seller.status === 'pending' ? 'Pending Approval' :
                                             seller.status === 'approved' ? 'Approved' :
                                             seller.status === 'rejected' ? 'Rejected' : seller.status}
                                        </span>
                                    </div>
                                    <div className="info-item">
                                        <label>Registration Date:</label>
                                        <span>{seller.createdAt ? formatDate(seller.createdAt) : 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <div className="profile-form">
                                <form onSubmit={handleProfileUpdate}>
                                    <div className="form-group">
                                        <label>Business Name:</label>
                                        <input
                                            type="text"
                                            value={profileData.businessName}
                                            onChange={(e) => setProfileData({...profileData, businessName: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Business Type:</label>
                                        <input
                                            type="text"
                                            value={profileData.businessType}
                                            onChange={(e) => setProfileData({...profileData, businessType: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>📍 Shop Address (Auto-detected):</label>
                                        <textarea
                                            value={profileData.address}
                                            onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                                            placeholder="Your shop address will be automatically detected..."
                                            rows="3"
                                        />
                                        <small style={{ display: 'block', marginTop: '5px', color: '#666', fontSize: '12px' }}>
                                            Click the button below to auto-detect your location and address
                                        </small>
                                    </div>
                                    <div className="form-group">
                                        <label>Coordinates (for distance calculation):</label>
                                        <div className="coordinates-group" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Latitude"
                                                value={profileData.lat || ''}
                                                onChange={(e) => setProfileData({...profileData, lat: e.target.value === '' ? null : parseFloat(e.target.value)})}
                                                style={{ flex: 1 }}
                                            />
                                            <input
                                                type="number"
                                                step="any"
                                                placeholder="Longitude"
                                                value={profileData.lon || ''}
                                                onChange={(e) => setProfileData({...profileData, lon: e.target.value === '' ? null : parseFloat(e.target.value)})}
                                                style={{ flex: 1 }}
                                            />
                                            <button 
                                                type="button" 
                                                onClick={handleAddressGeocode} 
                                                className="location-btn"
                                                disabled={fetchingLocation}
                                                style={{
                                                    padding: '10px 20px',
                                                    backgroundColor: fetchingLocation ? '#ccc' : '#4CAF50',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '5px',
                                                    cursor: fetchingLocation ? 'not-allowed' : 'pointer',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {fetchingLocation ? (
                                                    <>🔄 Detecting...</>
                                                ) : (
                                                    <><i className="fas fa-map-marker-alt"></i> Get Location & Address</>
                                                )}
                                            </button>
                                        </div>
                                        {profileData.lat && profileData.lon && (
                                            <small style={{ display: 'block', marginTop: '8px', color: '#4CAF50', fontSize: '12px', fontWeight: '500' }}>
                                                ✅ Location captured: {profileData.lat.toFixed(6)}, {profileData.lon.toFixed(6)}
                                            </small>
                                        )}
                                    </div>
                                    <div className="form-actions">
                                        <button type="button" className="cancel-btn" onClick={() => setIsEditingProfile(false)}>
                                            <i className="fas fa-times"></i> Cancel
                                        </button>
                                        <button type="submit" className="save-profile-btn">
                                            <i className="fas fa-save"></i> Save Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}

            </div>

            {/* Modal with Fixed CSS */}
            {modalOpen && (
                <div className="modal" style={{
                    display: 'block',
                    position: 'fixed',
                    zIndex: 1000,
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    overflow: 'auto',
                    backgroundColor: 'rgba(0,0,0,0.5)'
                }}>
                    <div className="modal-content" style={{
                        backgroundColor: '#fefefe',
                        margin: '2% auto',
                        padding: 0,
                        border: '1px solid #888',
                        borderRadius: '10px',
                        width: '90%',
                        maxWidth: '600px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        {/* Modal Header - Fixed */}
                        <div style={{
                            padding: '20px 30px',
                            borderBottom: '1px solid #ddd',
                            backgroundColor: '#f8f9fa'
                        }}>
                            <h3 style={{ margin: 0 }}>
                                {(editIndex !== null || (modalType === 'branch' && formData._id)) ? 'Edit' : 'Add'} {modalType === 'order' ? 'Order' : modalType === 'offer' ? 'Discount Offer' : modalType === 'branch' ? 'Branch' : 'Product'}
                            </h3>
                        </div>

                        {/* Modal Body - Scrollable */}
                        <div style={{
                            padding: '20px 30px',
                            overflowY: 'auto',
                            flex: 1
                        }}>
                            <form id="productForm" onSubmit={
                                modalType === 'order' ? handleAddOrder :
                                modalType === 'offer' ? handleAddOffer :
                                modalType === 'branch' ? (formData._id ? handleEditBranch : handleAddBranch) :
                                (editIndex !== null ? handleEditProduct : handleAddProduct)
                            }>
                                {modalType === 'offer' ? (
                                    <>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Offer Type</label>
                                            <select
                                                value={formData.type || 'product'}
                                                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                required
                                            >
                                                <option value="product">Specific Product</option>
                                                <option value="seller">All My Products</option>
                                            </select>
                                        </div>

                                        {formData.type === 'product' && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Product</label>
                                                <select
                                                    value={formData.targetId || ''}
                                                    onChange={(e) => setFormData({ ...formData, targetId: e.target.value })}
                                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                    required
                                                >
                                                    <option value="">Select Product</option>
                                                    {products.map(product => (
                                                        <option key={product._id} value={product._id}>
                                                            {product.name} - ₹{product.price}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Discount Type</label>
                                            <select
                                                value={formData.discountType || 'percentage'}
                                                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                required
                                            >
                                                <option value="percentage">Percentage (%)</option>
                                                <option value="fixed">Fixed Amount (₹)</option>
                                            </select>
                                        </div>

                                        <input
                                            type="number"
                                            placeholder={formData.discountType === 'percentage' ? 'Discount percentage (max 100%)' : 'Discount amount'}
                                            value={formData.discountValue || ''}
                                            onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                                            min="0"
                                            max={formData.discountType === 'percentage' ? '100' : undefined}
                                            step="0.01"
                                            required
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />

                                        <textarea
                                            placeholder="Offer description (optional)"
                                            value={formData.description || ''}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows="3"
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />

                                        <div style={{ backgroundColor: '#fff3cd', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>
                                            <i className="fas fa-info-circle"></i> Your offer will be sent to admin for approval before it becomes active.
                                        </div>
                                    </>
                                ) : modalType === 'branch' ? (
                                    <>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Branch Name</label>
                                            <input
                                                type="text"
                                                placeholder="Branch name"
                                                value={formData.name || ''}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Address</label>
                                            <textarea
                                                placeholder="Branch address"
                                                value={formData.address || ''}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                rows="3"
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Location Coordinates</label>
                                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', color: '#666' }}>Latitude</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g., 12.9716"
                                                        value={formData.lat || ''}
                                                        onChange={(e) => setFormData({ ...formData, lat: parseFloat(e.target.value) || null })}
                                                        step="0.000001"
                                                        min="-90"
                                                        max="90"
                                                        required
                                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                    />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <label style={{ display: 'block', marginBottom: '3px', fontSize: '12px', color: '#666' }}>Longitude</label>
                                                    <input
                                                        type="number"
                                                        placeholder="e.g., 77.5946"
                                                        value={formData.lon || ''}
                                                        onChange={(e) => setFormData({ ...formData, lon: parseFloat(e.target.value) || null })}
                                                        step="0.000001"
                                                        min="-180"
                                                        max="180"
                                                        required
                                                        style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                    />
                                                </div>
                                            </div>
                                            <small style={{ color: '#666', fontSize: '12px' }}>
                                                Enter precise coordinates for accurate location-based product visibility. You can find coordinates using Google Maps or GPS tools.
                                            </small>
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isMain || false}
                                                    onChange={(e) => setFormData({ ...formData, isMain: e.target.checked })}
                                                    style={{ marginRight: '5px' }}
                                                />
                                                Set as Main Branch
                                            </label>
                                            <small style={{ color: '#666' }}>Only one branch can be marked as main. Setting this will remove main status from other branches.</small>
                                        </div>
                                    </>
                                ) : modalType === 'order' ? (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Order ID"
                                            value={formData.id || ''}
                                            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Customer"
                                            value={formData.customer || ''}
                                            onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />
                                        <input
                                            type="number"
                                            placeholder="Amount"
                                            value={formData.amount || ''}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />
                                        <select
                                            value={formData.status || 'pending'}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="completed">Completed</option>
                                        </select>
                                        <input
                                            type="date"
                                            value={formData.date || ''}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            required
                                            style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '5px' }}
                                        />
                                    </>
                                ) : (
                                    <>
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Product Name *
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Enter product name"
                                                value={formData.name || ''}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Price *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter price"
                                                value={formData.price || ''}
                                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Stock Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                placeholder="Enter stock quantity"
                                                value={formData.stock || ''}
                                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                                min="0"
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Product Added By *
                                            </label>
                                            <select
                                                value={formData.addedBy || 'self'}
                                                onChange={(e) => setFormData({ ...formData, addedBy: e.target.value, earnerName: '', earnerEmail: '' })}
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            >
                                                <option value="self">By Self</option>
                                                <option value="earner">By Earner</option>
                                            </select>
                                        </div>

                                        {formData.addedBy === 'earner' && (
                                            <>
                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                        Earner Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        placeholder="Enter earner name"
                                                        value={formData.earnerName || ''}
                                                        onChange={(e) => setFormData({ ...formData, earnerName: e.target.value })}
                                                        required
                                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                    />
                                                </div>

                                                <div style={{ marginBottom: '15px' }}>
                                                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                        Earner Email ID *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        placeholder="Enter earner email"
                                                        value={formData.earnerEmail || ''}
                                                        onChange={(e) => setFormData({ ...formData, earnerEmail: e.target.value })}
                                                        required
                                                        style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                    />
                                                </div>
                                            </>
                                        )}

                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Category *
                                            </label>
                                            <select
                                                value={formData.category || 'Food & Dining'}
                                                onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                                                required
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            >
                                                {categoriesData.map((category, index) => (
                                                    <option key={index} value={category.name}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        
                                        {/* Subcategory Selection */}
                                        {(subcategoryMap[formData.category || 'Food & Dining'] && subcategoryMap[formData.category || 'Food & Dining'].length > 0) && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                    Subcategory (Optional)
                                                </label>
                                                <select
                                                    value={formData.subcategory || ''}
                                                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                                                    style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                                >
                                                    <option value="">Select subcategory</option>
                                                    {subcategoryMap[formData.category].map((sub, index) => (
                                                        <option key={index} value={sub}>
                                                            {sub}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Branch (Optional)
                                            </label>
                                            <select
                                                value={formData.branchId || ''}
                                                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            >
                                                <option value="">Use Main Branch (Default)</option>
                                                {branches.map((branch) => (
                                                    <option key={branch._id} value={branch._id}>
                                                        {branch.name} - {branch.address}
                                                    </option>
                                                ))}
                                            </select>
                                            <small style={{ color: '#666', fontSize: '12px', marginTop: '3px', display: 'block' }}>
                                                If no branch is selected, the product will use your main branch location for distance calculations.
                                            </small>
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Product Description *
                                            </label>
                                            <textarea
                                                placeholder="Describe your product in detail"
                                                value={formData.description || ''}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                rows="4"
                                                required
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '5px',
                                                    fontFamily: 'inherit',
                                                    fontSize: '14px',
                                                    resize: 'vertical'
                                                }}
                                            />
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Warranty (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., 1 year, 2 years, 6 months, Lifetime"
                                                value={formData.warranty || ''}
                                                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '5px'
                                                }}
                                            />
                                        </div>
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                Expiry Date (Optional)
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.expiryDate || formData.expireDate || ''}
                                                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value, expireDate: e.target.value })}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    border: '1px solid #ddd',
                                                    borderRadius: '5px'
                                                }}
                                            />
                                        </div>

                                        {editIndex !== null && formData.imageSrc && (
                                            <div style={{ marginBottom: '15px' }}>
                                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                    Current Image:
                                                </label>
                                                <img
                                                    src={`${process.env.REACT_APP_API_URL}/${formData.imageSrc}`}
                                                    alt="Current product"
                                                    style={{ maxWidth: '150px', maxHeight: '150px', borderRadius: '5px', border: '1px solid #ddd' }}
                                                />
                                            </div>
                                        )}
                                        
                                        <div style={{ marginBottom: '15px' }}>
                                            <label htmlFor="product-image" style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: '#555', fontWeight: '500' }}>
                                                {editIndex !== null ? 'Change Product Image (optional):' : 'Product Image *:'}
                                            </label>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                id="product-image"
                                                accept="image/*"
                                                onChange={(e) => setFormData({ ...formData, imageFile: e.target.files[0] })}
                                                style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}
                                            />
                                            {editIndex === null && <span style={{ color: 'red', fontSize: '12px' }}>* Required</span>}
                                        </div>
                                    </>
                                )}
                            </form>
                        </div>

                        {/* Modal Footer - Fixed at Bottom */}
                        <div style={{
                            padding: '15px 30px',
                            borderTop: '1px solid #ddd',
                            backgroundColor: '#f8f9fa',
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '10px'
                        }}>
                            <button 
                                type="button" 
                                onClick={closeModal}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit"
                                form="productForm"
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500'
                                }}
                            >
                                {editIndex !== null ? 'Update' : 'Save & Add Another'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default SellerDashboard;






