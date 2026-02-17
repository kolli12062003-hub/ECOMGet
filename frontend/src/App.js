import React, { useState, useRef, useEffect } from 'react';
import './App.css';

// Customer-facing components
import CategoryList from './Customer/Categories/ShopByCategory/CategoryList';
import PopularProductList from './Customer/Popularproducts/ProductList';
import Services from './Customer/Services/Services';
import BusinessList from './Customer/Bussiness/BusinessList';
import WishlistPage from './Customer/Header/WishlistPage';
import CartPage from './Customer/Header/CartPage';
import Checkout from './Customer/Header/Checkout';
import ProfilePage from './Customer/Header/ProfilePage';
import LoginPage from './Auth/LoginPage';
import ResetPassword from './Auth/ResetPassword';
import Header from './Customer/Header/Header';
import Navbar from './Customer/Navbar/Navbar';
import HeroSlider from './Customer/Header/HeroSlider';
import Footer from './Customer/Footer/Footer';

// Generic Vendor List
import GenericVendorList from './Customer/Categories/GenericVendorList';

// Vendor Store
import VendorStore from './Customer/Categories/VendorStore';

// Category pages
import FoodAndDining from './Customer/Categories/Products/FoodDine/FoodAndDining';
import Medicines from './Customer/Categories/Products/Medicine/Medicines';
import Services1 from './Customer/Categories/Products/Service/Services1';
import Jewellery from './Customer/Categories/Products/Jewllery/Jewellery';
import Clothes from './Customer/Categories/Products/Clothes/Clothes';
import Beauty from './Customer/Categories/Products/Beauty/Beauty';
import Grocery from './Customer/Categories/Products/Groceries/Grocery';
import Fruits from './Customer/Categories/Products/Fruits/Fruits';
import Books from './Customer/Categories/Products/Books/Books';
import Petfood from './Customer/Categories/Products/Petfood/Petfood';
import Musical from './Customer/Categories/Products/Musical/Musical';
import Footwear from './Customer/Categories/Products/Footwear/Footwear';
import HomeFurniture from './Customer/Categories/Products/Furniture/HomeFurniture';
import HomeDecor from './Customer/Categories/Products/Decor/HomeDecor';
import Bags from './Customer/Categories/Products/Bags/Bags';
import KitchenProducts from './Customer/Categories/Products/KitchenProducts/KitchenProducts';
import Organic from './Customer/Categories/Products/Organic/Organic';
import Automotive from './Customer/Categories/Products/Automotive/Automotive';
import SportsAndFitness from './Customer/Categories/Products/SportsFitness/SportsAndFitness';
import Watches from './Customer/Categories/Products/Watches/Watches';

// Product detail pages
import FoodDineProductDetail from './Customer/Categories/Products/FoodDine/Food&Dine_ProductDetail';
import MedicineProductDetail from './Customer/Categories/Products/Medicine/MedicineProductDetail';
import ServiceProductDetail from './Customer/Categories/Products/Service/ServiceProductDetail';
import AutomotiveProductDetail from './Customer/Categories/Products/Automotive/AutomotiveProductDetail';
import JewelleryProductDetail from './Customer/Categories/Products/Jewllery/JewelleryProductDetail';
import ClothesProductDetail from './Customer/Categories/Products/Clothes/ClothesProductDetail';
import BeautyProductDetail from './Customer/Categories/Products/Beauty/BeautyProductDetail';
import FootwearProductDetail from './Customer/Categories/Products/Footwear/FootwearProductDetail';
import GroceryProductDetail from './Customer/Categories/Products/Groceries/GroceryProductDetail';
import FruitProductDetail from './Customer/Categories/Products/Fruits/FruitProductDetail';
import BookProductDetail from './Customer/Categories/Products/Books/BookProductDetail';
import PetfoodProductDetail from './Customer/Categories/Products/Petfood/PetfoodProductDetail';
import MusicalProductDetail from './Customer/Categories/Products/Musical/MusicalProductDetail';
import HomeFurnitureProductDetail from './Customer/Categories/Products/Furniture/HomeFurnitureProductDetail';
import BagProductDetail from './Customer/Categories/Products/Bags/BagProductDetail';
import KitchenProductDetail from './Customer/Categories/Products/KitchenProducts/KitchenProductDetail';
import OrganicProductDetail from './Customer/Categories/Products/Organic/OrganicProductDetail';
import SportsAndFitnessProductDetail from './Customer/Categories/Products/SportsFitness/SportsAndFitnessProductDetail';
import WatchesProductDetail from './Customer/Categories/Products/Watches/WatchesProductDetail';
import HomeDecorProductDetail from './Customer/Categories/Products/Decor/HomeDecorProductDetail';

// Admin components
import AdminDashboard from './Admin/AdminDashboard';
import AdminOffersManagement from './Admin/Admin-offers';
import AdminPaymentManagement from './Admin/Admin-payment-management';
import AdminProductManagement from './Admin/Admin-product-management';
import AdminProfileManagement from './Admin/Admin-profile-management';
import AdminUserManagement from './Admin/Admin-user-management';
import AdminSellerManagement from './Admin/Admin-seller-management';
import AdminEarnerManagement from './Admin/Admin-earner-management';


// Seller component
import SellerDashboard from './Seller/SellerDashboard';

// Earner component
import EarnerDashboard from './Earner/EarnerDashboard';

// Product arrays
import { allClothesProducts } from './Customer/Categories/Products/Clothes/ClothesProductDetail';
import { allBookProducts } from './Customer/Categories/Products/Books/BookProductDetail';
import { allBagProducts } from './Customer/Categories/Products/Bags/BagProductDetail';
import { allKitchenProducts } from './Customer/Categories/Products/KitchenProducts/KitchenProductDetail';
import { allMusicalProducts } from './Customer/Categories/Products/Musical/MusicalProductDetail';
import { allPetfoodProducts } from './Customer/Categories/Products/Petfood/PetfoodProductDetail';
import { allWatchesProducts } from './Customer/Categories/Products/Watches/WatchesProductDetail';
import { allFootwearProducts } from './Customer/Categories/Products/Footwear/FootwearProductDetail';
import { allHomeFurnitureProducts } from './Customer/Categories/Products/Furniture/HomeFurnitureProductDetail';
import { allMedicineProducts } from './Customer/Categories/Products/Medicine/MedicineProductDetail';
import { allAutomotiveProducts } from './Customer/Categories/Products/Automotive/AutomotiveProductDetail';
import { allServicesProducts } from './Customer/Categories/Products/Service/ServiceProductDetail';
import { allGroceryProducts } from './Customer/Categories/Products/Groceries/GroceryProductDetail';
import { allFruitProducts } from './Customer/Categories/Products/Fruits/FruitProductDetail';
import { allSportsAndFitnessProducts } from './Customer/Categories/Products/SportsFitness/SportsAndFitnessProductDetail';
import { allHomeDecorProducts } from './Customer/Categories/Products/Decor/HomeDecorProductDetail';
import { allOrganicProducts } from './Customer/Categories/Products/Organic/OrganicProductDetail';
import { allFoodDineProducts } from './Customer/Categories/Products/FoodDine/Food&Dine_ProductDetail';

// Category configuration for vendor selection
const CATEGORY_CONFIG = {
  'food': {
    category: 'Food & Dining',
    displayName: 'Food & Dining',
    productsPage: 'food-products'
  },
  'medicines': {
    category: 'Medicines',
    displayName: 'Medicines',
    productsPage: 'medicines-products'
  },
  'automotive': {
    category: 'Automotive',
    displayName: 'Automotive',
    productsPage: 'automotive-products'
  },
  'services': {
    category: 'Services',
    displayName: 'Services',
    productsPage: 'services-products'
  },
  'jewellery': {
    category: 'Jewellery',
    displayName: 'Jewellery',
    productsPage: 'jewellery-products'
  },
  'clothes': {
    category: 'Clothes',
    displayName: 'Clothes',
    productsPage: 'clothes-products'
  },
  'beauty': {
    category: 'Beauty Products',
    displayName: 'Beauty Products',
    productsPage: 'beauty-products'
  },
  'groceries': {
    category: 'Groceries',
    displayName: 'Groceries',
    productsPage: 'groceries-products'
  },
  'fruits': {
    category: 'Fruits',
    displayName: 'Fruits',
    productsPage: 'fruits-products'
  },
  'books': {
    category: 'Books',
    displayName: 'Books',
    productsPage: 'books-products'
  },
  'petfood': {
    category: 'Pet Food',
    displayName: 'Pet Food',
    productsPage: 'petfood-products'
  },
  'musical': {
    category: 'Musical Instruments',
    displayName: 'Musical Instruments',
    productsPage: 'musical-products'
  },
  'footwear': {
    category: 'Footwear',
    displayName: 'Footwear',
    productsPage: 'footwear-products'
  },
  'homefurniture': {
    category: 'Home Furniture',
    displayName: 'Home Furniture',
    productsPage: 'homefurniture-products'
  },
  'bag': {
    category: 'Bags',
    displayName: 'Bags',
    productsPage: 'bag-products'
  },
  'kitchenproduct': {
    category: 'Kitchen Products',
    displayName: 'Kitchen Products',
    productsPage: 'kitchenproduct-products'
  },
  'organic': {
    category: 'Organic Veggies&Fruits',
    displayName: 'Organic Products',
    productsPage: 'organic-products'
  },
  'sports-fitness': {
    category: 'Sports & Fitness',
    displayName: 'Sports & Fitness',
    productsPage: 'sports-fitness-products'
  },
  'watches': {
    category: 'Watches',
    displayName: 'Watches',
    productsPage: 'watches-products'
  },
  'homedecor': {
    category: 'Home Decor',
    displayName: 'Home Decor',
    productsPage: 'homedecor-products'
  }
};

// Combine all products
const initialProducts = [
  ...allClothesProducts,
  ...allBookProducts,
  ...allBagProducts,
  ...allKitchenProducts,
  ...allMusicalProducts,
  ...allPetfoodProducts,
  ...allWatchesProducts,
  ...allFootwearProducts,
  ...allHomeFurnitureProducts,
  ...allMedicineProducts,
  ...allAutomotiveProducts,
  ...allServicesProducts,
  ...allGroceryProducts,
  ...allFruitProducts
];

const popularProducts = initialProducts.slice(0, 8);

// const API_URL = '${process.env.REACT_APP_API_URL}';
const API_URL = "http://72.60.219.208:5000";

function App() {
  // State management
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [activePage, setActivePage] = useState('home');
  const [viewingProduct, setViewingProduct] = useState(null);
  const [currentUser, setCurrentUser] = useState({ 
    isAuthenticated: false, 
    role: null, 
    details: null 
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [allProducts, setAllProducts] = useState(initialProducts);
    const [selectedVendor, setSelectedVendor] = useState(null);
    const [selectedSellerId, setSelectedSellerId] = useState(null);
    const [allSellers, setAllSellers] = useState([]);
    const [allAdmins, setAllAdmins] = useState([]);

  const categorySectionRef = useRef(null);

  // Listen for fallback vendor-store navigation events (from components that don't receive `navigateTo` prop)
  useEffect(() => {
    const handler = (e) => {
      const detail = e && e.detail;
      if (!detail) return;
      if (typeof detail === 'string') {
        setSelectedVendor(detail);
        setSelectedSellerId(null);
      } else if (typeof detail === 'object') {
        setSelectedVendor(detail.vendor || null);
        setSelectedSellerId(detail.sellerId || null);
      }
      setActivePage('vendor-store');
      window.scrollTo(0, 0);
    };
    window.addEventListener('openVendorStore', handler);
    return () => window.removeEventListener('openVendorStore', handler);
  }, []);

  // Listen for visit seller dashboard event
  useEffect(() => {
    const handler = (e) => {
      const sellerId = e && e.detail && e.detail.sellerId;
      if (sellerId) {
        setActivePage('seller-dashboard');
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('visitSellerDashboard', handler);
    return () => window.removeEventListener('visitSellerDashboard', handler);
  }, []);

  // Check for services search query from localStorage when navigating to services-products
  useEffect(() => {
    if (activePage === 'services-products') {
      const storedQuery = localStorage.getItem('servicesSearchQuery');
      if (storedQuery) {
        setSearchQuery(storedQuery);
        localStorage.removeItem('servicesSearchQuery');
      }
    }
  }, [activePage]);

  // Helper function to save cart to server
  const saveCartToServer = async (cart, userEmail, userRole) => {
    try {
      await fetch(`${API_URL}/api/cart/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, role: userRole, cart })
      });
    } catch (error) {
      console.error('Error saving cart to server:', error);
    }
  };

  // Helper function to save wishlist to server
  const saveWishlistToServer = async (wishlist, userEmail, userRole) => {
    try {
      await fetch(`${API_URL}/api/wishlist/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, role: userRole, wishlist })
      });
    } catch (error) {
      console.error('Error saving wishlist to server:', error);
    }
  };

  // Helper function to fetch cart from server
  const fetchCartFromServer = async (userEmail, userRole) => {
    try {
      const response = await fetch(`${API_URL}/api/cart/${userEmail}/${userRole}`);
      const data = await response.json();
      return data.cart || [];
    } catch (error) {
      console.error('Error fetching cart from server:', error);
      return [];
    }
  };

  // Helper function to fetch wishlist from server
  const fetchWishlistFromServer = async (userEmail, userRole) => {
    try {
      const response = await fetch(`${API_URL}/api/wishlist/${userEmail}/${userRole}`);
      const data = await response.json();
      return data.wishlist || [];
    } catch (error) {
      console.error('Error fetching wishlist from server:', error);
      return [];
    }
  };

  // RESTORE USER SESSION ON PAGE LOAD/REFRESH
  useEffect(() => {
    const restoreSession = async () => {
      // Check URL for reset password token
      const search = window.location.search;
      if (search.includes('token=')) {
        setActivePage('reset-password');
        return;
      }

      // Try to restore user from localStorage
      const storedUser = localStorage.getItem('currentUser');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('🔄 Restoring user session:', userData.details.email);
          
          // Restore user state
          setCurrentUser(userData);
          
          // Fetch cart and wishlist from SERVER
          const userEmail = userData.details.email;
          const userRole = userData.role;
          
          const [serverCart, serverWishlist] = await Promise.all([
            fetchCartFromServer(userEmail, userRole),
            fetchWishlistFromServer(userEmail, userRole)
          ]);
          
          setCartItems(serverCart);
          setWishlistItems(serverWishlist);
          
          console.log('✅ Session restored successfully');
          console.log('   Cart items:', serverCart.length);
          console.log('   Wishlist items:', serverWishlist.length);
          
          // Navigate to appropriate page based on role
          const lowerCaseRole = userRole.toLowerCase();
          if (lowerCaseRole === 'seller') {
            setActivePage('seller-dashboard');
          } else if (lowerCaseRole === 'admin') {
            setActivePage('admin-dashboard');
          } else if (lowerCaseRole === 'earner') {
            setActivePage('earner-dashboard');
          } else {
            setActivePage('home');
          }
          
        } catch (error) {
          console.error('❌ Error restoring session:', error);
          // If restoration fails, clear everything
          localStorage.removeItem('currentUser');
          setCurrentUser({ isAuthenticated: false, role: null, details: null });
          setCartItems([]);
          setWishlistItems([]);
          setActivePage('home');
        }
      } else {
        console.log('ℹ️  No stored session found - user not logged in');
        setActivePage('home');
      }
    };
    
    restoreSession();
  }, []);

  // Authentication handlers
  const handleLoginSuccess = async (role, userDetails) => {
    const userData = { isAuthenticated: true, role: role, details: userDetails };

    // Update state initially
    setCurrentUser(userData);

    // Save user to localStorage (but will be cleared on refresh)
    localStorage.setItem('currentUser', JSON.stringify(userData));

    // Fetch cart and wishlist from SERVER
    const userEmail = userDetails.email;
    const userRole = role;

    const serverCart = await fetchCartFromServer(userEmail, userRole);
    const serverWishlist = await fetchWishlistFromServer(userEmail, userRole);

    setCartItems(serverCart);
    setWishlistItems(serverWishlist);

    // Fetch the latest profile data from server and update currentUser.details
    try {
      const profileResponse = await fetch(`${API_URL}/api/profile?email=${userEmail}&role=${userRole}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        const updatedDetails = {
          ...userDetails,
          name: profileData.user.fullname,
          phone: profileData.user.phone,
          gender: profileData.user.gender,
          dateOfBirth: profileData.user.dateOfBirth,
          addresses: profileData.user.addresses
        };
        const updatedUserData = { ...userData, details: updatedDetails };
        setCurrentUser(updatedUserData);
        localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      }
    } catch (error) {
      console.error('Error fetching profile data on login:', error);
    }

    const lowerCaseRole = role.toLowerCase();
    if (lowerCaseRole === 'customer') {
      navigateTo('home');
    } else if (lowerCaseRole === 'seller') {
      navigateTo('seller-dashboard');
    } else if (lowerCaseRole === 'admin') {
      navigateTo('admin-dashboard');
    } else if (lowerCaseRole === 'earner') {
      navigateTo('earner-dashboard');
    }
  };

  // LOGOUT FUNCTION - SAVES TO SERVER BEFORE CLEARING
  const handleLogout = async () => {
    // SAVE current user's cart and wishlist to SERVER before logout
    if (currentUser.isAuthenticated && currentUser.details) {
      const userEmail = currentUser.details.email;
      const userRole = currentUser.role;
      await saveCartToServer(cartItems, userEmail, userRole);
      await saveWishlistToServer(wishlistItems, userEmail, userRole);
    }
    
    // Clear user state
    setCurrentUser({ isAuthenticated: false, role: null, details: null });
    
    // Clear displayed cart and wishlist (for privacy)
    setCartItems([]);
    setWishlistItems([]);
    
    // Remove current user from localStorage
    localStorage.removeItem('currentUser');
    
    navigateTo('home');
  };

  const handleSellerRegister = (newSeller) => {
    setAllSellers(prevSellers => [...prevSellers, newSeller]);
  };

  const handleAdminRegister = (newAdmin) => {
    setAllAdmins(prevAdmins => [...prevAdmins, newAdmin]);
    console.log('Admin registered:', newAdmin);
  };

  // Cart handlers - Save to SERVER
  const handleAddToCart = async (productToAdd) => {
    const productKey = productToAdd._id || productToAdd.id;
    const itemInCart = cartItems.find(item => (item._id || item.id) === productKey);

    // Use discounted price if available, otherwise use original price
    const cartProduct = {
      ...productToAdd,
      price: productToAdd.discountedPrice || productToAdd.price,
      originalPrice: productToAdd.price,
      quantity: 1
    };

    let updatedCart;
    if (itemInCart) {
      updatedCart = cartItems.map(item =>
        (item._id || item.id) === productKey ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [...cartItems, cartProduct];
    }

    setCartItems(updatedCart);

    // Save to SERVER
    if (currentUser.isAuthenticated && currentUser.details) {
      await saveCartToServer(updatedCart, currentUser.details.email, currentUser.role);
    }

    alert(`${productToAdd.name} has been added to your cart!`);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(productId);
    } else {
      const updatedCart = cartItems.map(item => 
        ((item._id || item.id) === productId ? { ...item, quantity: newQuantity } : item)
      );
      setCartItems(updatedCart);
      
      // Save to SERVER
      if (currentUser.isAuthenticated && currentUser.details) {
        await saveCartToServer(updatedCart, currentUser.details.email, currentUser.role);
      }
    }
  };

  const handleRemoveFromCart = async (productId) => {
    const updatedCart = cartItems.filter(item => (item._id || item.id) !== productId);
    setCartItems(updatedCart);
    
    // Save to SERVER
    if (currentUser.isAuthenticated && currentUser.details) {
      await saveCartToServer(updatedCart, currentUser.details.email, currentUser.role);
    }
  };

  // Wishlist handlers - Save to SERVER
  const handleToggleWishlist = async (productToAdd) => {
    const productKey = productToAdd._id || productToAdd.id;
    const itemInWishlist = wishlistItems.find(item => (item._id || item.id) === productKey);
    
    let updatedWishlist;
    if (itemInWishlist) {
      updatedWishlist = wishlistItems.filter(item => (item._id || item.id) !== productKey);
      alert(`${productToAdd.name} removed from wishlist!`);
    } else {
      updatedWishlist = [...wishlistItems, productToAdd];
      alert(`${productToAdd.name} added to wishlist!`);
    }
    
    setWishlistItems(updatedWishlist);
    
    // Save to SERVER
    if (currentUser.isAuthenticated && currentUser.details) {
      await saveWishlistToServer(updatedWishlist, currentUser.details.email, currentUser.role);
    }
  };

  // Navigation
  const navigateTo = (page, product = null) => {
    // Handle vendor selection with data parameter
    if (typeof product === 'object' && product !== null && product.vendor) {
      setSelectedVendor(product.vendor);
      if (product.sellerId) setSelectedSellerId(product.sellerId);
    } else if (typeof product === 'string' && page === 'vendor-store') {
      // Allow passing vendor name directly as a string
      setSelectedVendor(product);
      setSelectedSellerId(null);
    } else if (!page.endsWith('-products')) {
      // Clear vendor selection when navigating away from products pages
      setSelectedVendor(null);
      setSelectedSellerId(null);
    }

    setActivePage(page);
    if (product && page === 'productDetail') {
      setViewingProduct(product);
    }
    window.scrollTo(0, 0);
  };

  const handleViewProduct = (product) => {
    setViewingProduct(product);
    navigateTo('productDetail');
  };

  // Search handler
  const handleSearch = async (query) => {
    const lowerCaseQuery = query.toLowerCase().trim();
    setSearchQuery(lowerCaseQuery);

    if (!lowerCaseQuery) {
      setAllProducts(initialProducts);
      return;
    }

    const categoryMapping = {
      'food & dining': 'food-products',
      'food': 'food-products',
      'medicines': 'medicines',
      'automotive': 'automotive',
      'services': 'services',
      'jewellery': 'jewellery',
      'clothes': 'clothes',
      'beauty': 'beauty',
      'footwear': 'footwear',
      'groceries': 'groceries',
      'fruits': 'fruits',
      'books': 'books',
      'Pet Food': 'petfood',
      'musical': 'musical',
      'homefurniture': 'homefurniture',
      'bags': 'bag',
      'kitchen': 'kitchenproduct',
      'sports': 'sports-fitness-products',
      'sports & fitness': 'sports-fitness-products',
      'watches': 'watches-products',
      'home decor': 'homedecor-products',
      'homedecor': 'homedecor-products',
      'organic': 'organic-products',
      'organic veggies&fruits': 'organic-products',
      'general services': 'general-services'
    };

    if (categoryMapping[lowerCaseQuery]) {
      navigateTo(categoryMapping[lowerCaseQuery]);
      setSearchQuery('');
      return;
    }

    try {
      // Fetch all products from backend
      const response = await fetch(`${API_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const backendProducts = await response.json();

      // Combine backend products with initial products
      const allAvailableProducts = [...initialProducts, ...backendProducts];

      // Filter products based on search query
      const filteredProducts = allAvailableProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.vendor.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
      );

      if (filteredProducts.length > 0) {
        // Find the category of the first matching product
        const productCategory = filteredProducts[0].category.toLowerCase();
        // Map category to page name (assuming category names match page keys)
        const pageMapping = {
          'food & dining': 'food',
          'medicines': 'medicines',
          'automotive': 'automotive',
          'services': 'services',
          'jewellery': 'jewellery',
          'clothes': 'clothes',
          'beauty': 'beauty',
          'footwear': 'footwear',
          'groceries': 'groceries',
          'fruits': 'fruits',
          'books': 'books',
          'pet food': 'petfood',
          'musical instruments': 'musical',
          'home furniture': 'homefurniture',
          'bags': 'bag',
          'kitchen products': 'kitchenproduct',
          'sports & fitness': 'sports-fitness',
          'watches': 'watches',
          'home decor': 'homedecor',
          'organic veggies&fruits': 'organic'
        };
        const targetPage = pageMapping[productCategory] || productCategory;
        navigateTo(targetPage);
      } else {
        setAllProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products for search:', error);
      const filteredProducts = initialProducts.filter(product =>
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.vendor.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
      );
      if (filteredProducts.length > 0) {
        const productCategory = filteredProducts[0].category.toLowerCase();
        const pageMapping = {
          'food & dining': 'food',
          'medicines': 'medicines',
          'automotive': 'automotive',
          'services': 'services',
          'jewellery': 'jewellery',
          'clothes': 'clothes',
          'beauty': 'beauty',
          'footwear': 'footwear',
          'groceries': 'groceries',
          'fruits': 'fruits',
          'books': 'books',
          'pet food': 'petfood',
          'musical instruments': 'musical',
          'home furniture': 'homefurniture',
          'bags': 'bag',
          'kitchen products': 'kitchenproduct',
          'sports & fitness': 'sports-fitness',
          'watches': 'watches',
          'home decor': 'homedecor',
          'organic veggies&fruits': 'organic'
        };
        const targetPage = pageMapping[productCategory] || productCategory;
        navigateTo(targetPage);
      } else {
        // Show "No products found" message on home page
        setAllProducts([]);
        navigateTo('home');
      }
    }
  };

  // Common props for category pages
  const commonProps = {
    cartItems,
    wishlistItems,
    onAddToCart: handleAddToCart,
    onToggleWishlist: handleToggleWishlist,
    allProducts,
    onViewProduct: handleViewProduct,
    navigateTo,
    searchQuery
  };

  // Render page content
  const renderPage = () => {
    // Reset Password page - No header/navbar
    if (activePage === 'reset-password') {
      return <ResetPassword navigateTo={navigateTo} />;
    }

    // Admin pages
    if (currentUser.role && currentUser.role.toLowerCase() === 'admin') {
      const adminPages = {
        'admin-dashboard': <AdminDashboard navigateTo={navigateTo} onLogout={handleLogout} />,
        'admin-offers': <AdminOffersManagement navigateTo={navigateTo} />,
        'admin-orders': <AdminPaymentManagement navigateTo={navigateTo} />,
        'admin-catalog': <AdminProductManagement navigateTo={navigateTo} />,
        'admin-profiles': <AdminProfileManagement navigateTo={navigateTo} />,
        'admin-users': <AdminUserManagement navigateTo={navigateTo} />,
        'admin-sellers': <AdminSellerManagement navigateTo={navigateTo} />,
        'admin-earner-management': <AdminEarnerManagement navigateTo={navigateTo} />  // ⭐ ADD THIS
      };

      if (adminPages[activePage]) {
        return adminPages[activePage];
      }
    }

    // Seller dashboard
    if (currentUser.role && currentUser.role.toLowerCase() === 'seller' && activePage === 'seller-dashboard') {
      return (
        <SellerDashboard
          seller={currentUser.details}
          setAllProducts={setAllProducts}
          onLogout={handleLogout}
        />
      );
    }

    // Earner dashboard
    if (currentUser.role && currentUser.role.toLowerCase() === 'earner' && activePage === 'earner-dashboard') {
      return (
        <EarnerDashboard onLogout={handleLogout} user={currentUser.details} />
      );
    }

    // Customer pages
    const categoryPages = {
      'login': <LoginPage 
        onLoginSuccess={handleLoginSuccess} 
        onSellerRegister={handleSellerRegister}
        onAdminRegister={handleAdminRegister}
      />,
      
      // VENDOR LIST PAGES (User selects vendor)
      'food': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.food.category}
        categoryDisplayName={CATEGORY_CONFIG.food.displayName}
        targetPage={CATEGORY_CONFIG.food.productsPage}
      />,
      'medicines': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.medicines.category}
        categoryDisplayName={CATEGORY_CONFIG.medicines.displayName}
        targetPage={CATEGORY_CONFIG.medicines.productsPage}
      />,
      'automotive': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.automotive.category}
        categoryDisplayName={CATEGORY_CONFIG.automotive.displayName}
        targetPage={CATEGORY_CONFIG.automotive.productsPage}
      />,
      'services': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.services.category}
        categoryDisplayName={CATEGORY_CONFIG.services.displayName}
        targetPage={CATEGORY_CONFIG.services.productsPage}
      />,
      'jewellery': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.jewellery.category}
        categoryDisplayName={CATEGORY_CONFIG.jewellery.displayName}
        targetPage={CATEGORY_CONFIG.jewellery.productsPage}
      />,
      'clothes': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.clothes.category}
        categoryDisplayName={CATEGORY_CONFIG.clothes.displayName}
        targetPage={CATEGORY_CONFIG.clothes.productsPage}
      />,
      'beauty': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.beauty.category}
        categoryDisplayName={CATEGORY_CONFIG.beauty.displayName}
        targetPage={CATEGORY_CONFIG.beauty.productsPage}
      />,
      'groceries': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.groceries.category}
        categoryDisplayName={CATEGORY_CONFIG.groceries.displayName}
        targetPage={CATEGORY_CONFIG.groceries.productsPage}
      />,
      'fruits': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.fruits.category}
        categoryDisplayName={CATEGORY_CONFIG.fruits.displayName}
        targetPage={CATEGORY_CONFIG.fruits.productsPage}
      />,
      'books': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.books.category}
        categoryDisplayName={CATEGORY_CONFIG.books.displayName}
        targetPage={CATEGORY_CONFIG.books.productsPage}
      />,
      'petfood': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.petfood.category}
        categoryDisplayName={CATEGORY_CONFIG.petfood.displayName}
        targetPage={CATEGORY_CONFIG.petfood.productsPage}
      />,
      'musical': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.musical.category}
        categoryDisplayName={CATEGORY_CONFIG.musical.displayName}
        targetPage={CATEGORY_CONFIG.musical.productsPage}
      />,
      'footwear': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.footwear.category}
        categoryDisplayName={CATEGORY_CONFIG.footwear.displayName}
        targetPage={CATEGORY_CONFIG.footwear.productsPage}
      />,
      'homefurniture': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.homefurniture.category}
        categoryDisplayName={CATEGORY_CONFIG.homefurniture.displayName}
        targetPage={CATEGORY_CONFIG.homefurniture.productsPage}
      />,
      'bag': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.bag.category}
        categoryDisplayName={CATEGORY_CONFIG.bag.displayName}
        targetPage={CATEGORY_CONFIG.bag.productsPage}
      />,
      'kitchenproduct': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.kitchenproduct.category}
        categoryDisplayName={CATEGORY_CONFIG.kitchenproduct.displayName}
        targetPage={CATEGORY_CONFIG.kitchenproduct.productsPage}
      />,
      'organic': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.organic.category}
        categoryDisplayName={CATEGORY_CONFIG.organic.displayName}
        targetPage={CATEGORY_CONFIG.organic.productsPage}
      />,
      'sports-fitness': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG['sports-fitness'].category}
        categoryDisplayName={CATEGORY_CONFIG['sports-fitness'].displayName}
        targetPage={CATEGORY_CONFIG['sports-fitness'].productsPage}
      />,
      'watches': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.watches.category}
        categoryDisplayName={CATEGORY_CONFIG.watches.displayName}
        targetPage={CATEGORY_CONFIG.watches.productsPage}
      />,
      'homedecor': <GenericVendorList 
        navigateTo={navigateTo} 
        searchQuery={searchQuery}
        category={CATEGORY_CONFIG.homedecor.category}
        categoryDisplayName={CATEGORY_CONFIG.homedecor.displayName}
        targetPage={CATEGORY_CONFIG.homedecor.productsPage}
      />,
      
      // PRODUCTS PAGES (Shows vendor's products)
      'food-products': <FoodAndDining {...commonProps} selectedVendor={selectedVendor} />,
      'medicines-products': <Medicines {...commonProps} selectedVendor={selectedVendor} />,
      'automotive-products': <Automotive {...commonProps} selectedVendor={selectedVendor} />,
      'services-products': <Services1 {...commonProps} selectedVendor={selectedVendor} />,
      'jewellery-products': <Jewellery {...commonProps} selectedVendor={selectedVendor} />,
      'clothes-products': <Clothes {...commonProps} selectedVendor={selectedVendor} />,
      'beauty-products': <Beauty {...commonProps} selectedVendor={selectedVendor} />,
      'groceries-products': <Grocery {...commonProps} selectedVendor={selectedVendor} />,
      'fruits-products': <Fruits {...commonProps} selectedVendor={selectedVendor} />,
      'books-products': <Books {...commonProps} selectedVendor={selectedVendor} />,
      'petfood-products': <Petfood {...commonProps} selectedVendor={selectedVendor} />,
      'musical-products': <Musical {...commonProps} selectedVendor={selectedVendor} />,
      'footwear-products': <Footwear {...commonProps} selectedVendor={selectedVendor} />,
      'homefurniture-products': <HomeFurniture {...commonProps} selectedVendor={selectedVendor} />,
      'bag-products': <Bags {...commonProps} selectedVendor={selectedVendor} />,
      'kitchenproduct-products': <KitchenProducts {...commonProps} selectedVendor={selectedVendor} />,
      'organic-products': <Organic {...commonProps} selectedVendor={selectedVendor} />,
      'sports-fitness-products': <SportsAndFitness {...commonProps} selectedVendor={selectedVendor} />,
      'watches-products': <Watches {...commonProps} selectedVendor={selectedVendor} />,
      'homedecor-products': <HomeDecor {...commonProps} selectedVendor={selectedVendor} />,
      'general-services': <CategoryList navigateTo={navigateTo} initialSection='general-services' />,

      // OTHER PAGES
      'cart': <CartPage
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveFromCart={handleRemoveFromCart}
        navigateTo={navigateTo}
        onToggleWishlist={handleToggleWishlist}
        wishlistItems={wishlistItems}
        currentUser={currentUser}
      />,
      'checkout': <Checkout
        cartItems={cartItems}
        navigateTo={navigateTo}
        currentUser={currentUser}
      />,
      'wishlist': <WishlistPage
        wishlistItems={wishlistItems}
        cartItems={cartItems}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        navigateTo={navigateTo}
      />,
      'profile': <ProfilePage
        currentUser={currentUser}
        navigateTo={navigateTo}
        onProfileUpdate={(updatedDetails) => {
          setCurrentUser(prev => ({
            ...prev,
            details: { ...prev.details, ...updatedDetails }
          }));
        }}
      />
    };

    // Product detail pages
    // Vendor store page (show products for a selected vendor)
    if (activePage === 'vendor-store') {
    return (
        <VendorStore
            vendorName={selectedVendor} // This now includes branch name
            sellerId={selectedSellerId}
            navigateTo={navigateTo}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            onViewProduct={handleViewProduct}
        />
    );
}

    if (activePage === 'productDetail' && viewingProduct) {
      const detailPages = {
        'medicines': MedicineProductDetail,
        'automotive': AutomotiveProductDetail,
        'services': ServiceProductDetail,
        'jewellery': JewelleryProductDetail,
        'clothes': ClothesProductDetail,
        'footwear': FootwearProductDetail,
        'women\'s footwear': FootwearProductDetail,
        'men\'s footwear': FootwearProductDetail,
        'kids\' footwear': FootwearProductDetail,
        'groceries': GroceryProductDetail,
        'grocery': GroceryProductDetail,
        'fruits': FruitProductDetail,
        'books': BookProductDetail,
        'pet food': PetfoodProductDetail,
        'beauty products': BeautyProductDetail,
        'musical instruments': MusicalProductDetail,
        'home furniture': HomeFurnitureProductDetail,
        'bags': BagProductDetail,
        'kitchen products': KitchenProductDetail,
        'organic veggies&fruits': OrganicProductDetail,
        'sports & fitness': SportsAndFitnessProductDetail,
        'watches': WatchesProductDetail,
        'home decor': HomeDecorProductDetail,
        'food & dining': FoodDineProductDetail,
        // Additional mappings for category name variations
        'beauty': BeautyProductDetail,
        'fruit': FruitProductDetail,
        'book': BookProductDetail,
        'petfood': PetfoodProductDetail,
        'musical': MusicalProductDetail,
        'homefurniture': HomeFurnitureProductDetail,
        'bag': BagProductDetail,
        'kitchenproduct': KitchenProductDetail,
        'organics': OrganicProductDetail,
        'sports': SportsAndFitnessProductDetail,
        'watch': WatchesProductDetail,
        'homedecor': HomeDecorProductDetail,
        'food': FoodDineProductDetail,
        'medicine': MedicineProductDetail,
        'service': ServiceProductDetail,
        'jewelry': JewelleryProductDetail,
        'clothing': ClothesProductDetail
      };

      const DetailComponent = detailPages[viewingProduct.category.toLowerCase()] || (() => <div>Product Detail Not Found</div>);
      
      return (
        <DetailComponent
          product={viewingProduct}
          cartItems={cartItems}
          wishlistItems={wishlistItems}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          allProducts={allProducts}
          navigateTo={navigateTo}
          onViewProduct={handleViewProduct}
        />
      );
    }

    // Check if it's a category page
    if (categoryPages[activePage]) {
      return categoryPages[activePage];
    }

    // Default home page
    return (
      <>
        <HeroSlider navigateTo={navigateTo} />
        <div ref={categorySectionRef}>
          <CategoryList navigateTo={navigateTo} />
        </div>
        {searchQuery ? (
          <div className="container">
            <h2>Search Results for "{searchQuery}"</h2>
            {allProducts.length > 0 ? (
              <div className="product-grid">
                {allProducts.map(product => (
                  <div key={product.id || product._id} className="product-card" onClick={() => handleViewProduct(product)}>
                    <img
                      src={product.image ? (product.image.startsWith('http') ? product.image : `/IMAGES/${product.image}`) : 'https://via.placeholder.com/200x150?text=No+Image'}
                      alt={product.name}
                      onError={(e) => e.target.src = 'https://via.placeholder.com/200x150?text=No+Img'}
                    />
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.vendor}</p>
                      <div className="product-price">₹{product.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <p>No products found for "{searchQuery}". Try a different search term.</p>
              </div>
            )}
          </div>
        ) : (
          <PopularProductList
            popularProducts={popularProducts}
            onAddToCart={handleAddToCart}
            wishlistItems={wishlistItems}
            onViewProduct={handleViewProduct}
            onToggleWishlist={handleToggleWishlist}
            cartItems={cartItems}
            navigateTo={navigateTo}
          />
        )}
        <Services />
        <BusinessList />
      </>
    );
  };

  const showCustomerHeader =
    activePage !== 'seller-dashboard' &&
    activePage !== 'earner-dashboard' &&
    !activePage.startsWith('admin-') &&
    activePage !== 'reset-password' &&
    (!currentUser.role || currentUser.role.toLowerCase() !== 'admin');

  return (
    <div className="App">
      {showCustomerHeader && (
        <>
          <Header
            cartItems={cartItems}
            wishlistItems={wishlistItems}
            onSearch={handleSearch}
            navigateTo={navigateTo}
            onLogout={handleLogout}
            currentUser={currentUser}
          />
          <Navbar navigateTo={navigateTo} />
        </>
      )}
      <main>{renderPage()}</main>
      {showCustomerHeader && (
        <Footer navigateTo={navigateTo} />
      )}
    </div>
  );
}

export default App;


//tosharefile
// Coordinates: 17.329665887708742, 78.59152439364728
