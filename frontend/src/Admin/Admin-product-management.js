import React, { useState, useEffect } from 'react';

const AdminProductManagement = ({ navigateTo }) => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [state, setState] = useState({
    search: '',
    catFilter: '',
    statusFilter: '',
    selectedCats: new Set(),
    selectedProds: new Set(),
    reorder: false
  });

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [prodModalOpen, setProdModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [editingProd, setEditingProd] = useState(null);

  const [catFormData, setCatFormData] = useState({ name: '', description: '', image: '', status: 'active' });
  
  // ✅ UPDATED: Added warranty and expiryDate fields
  const [prodFormData, setProdFormData] = useState({
    name: '',
    price: '',
    vendor: '',
    category: '',
    subcategory: '',
    image: null,
    lat: '',
    lon: '',
    stock: '',
    description: '',
    warranty: '',
    expiryDate: '',
    status: 'active'
  });

  const [subcategories, setSubcategories] = useState([]);
  const [showNewSubcategoryInput, setShowNewSubcategoryInput] = useState(false);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategoryForSubcategories, setSelectedCategoryForSubcategories] = useState('');

  // Fetch categories and products on component mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchSubcategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/admin/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        console.error('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubcategories = async (category = null) => {
    try {
      const url = category
        ? `http://localhost:5000/api/products/subcategories?category=${encodeURIComponent(category)}`
        : 'http://localhost:5000/api/products/subcategories';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setSubcategories(data);
      } else {
        console.error('Failed to fetch subcategories');
      }
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const openCatModal = (cat = null) => {
    if (cat) {
      setEditingCat(cat);
      setCatFormData({
        name: cat.name,
        description: cat.description || '',
        image: cat.image || '',
        status: cat.status || 'active'
      });
    } else {
      setEditingCat(null);
      setCatFormData({ name: '', description: '', image: '', status: 'active' });
    }
    setCatModalOpen(true);
  };

  const openProdModal = (prod = null) => {
    if (prod) {
      setEditingProd(prod);
      // ✅ UPDATED: Include warranty and expiryDate when editing
      setProdFormData({
        name: prod.name,
        price: prod.price,
        vendor: prod.vendor,
        category: prod.category,
        subcategory: prod.subcategory || '',
        image: prod.image,
        lat: prod.lat,
        lon: prod.lon,
        stock: prod.stock,
        description: prod.description,
        warranty: prod.warranty || '',
        expiryDate: prod.expiryDate ? new Date(prod.expiryDate).toISOString().split('T')[0] : '',
        status: prod.status
      });
      // Fetch subcategories for the existing product's category
      if (prod.category) {
        fetchSubcategories(prod.category);
        setSelectedCategoryForSubcategories(prod.category);
      }
    } else {
      setEditingProd(null);
      // ✅ UPDATED: Reset warranty and expiryDate
      setProdFormData({
        name: '',
        price: '',
        vendor: '',
        category: '',
        subcategory: '',
        image: null,
        lat: '',
        lon: '',
        stock: '',
        description: '',
        warranty: '',
        expiryDate: '',
        status: 'active'
      });
      setSelectedCategoryForSubcategories('');
      setSubcategories([]);
    }
    setShowNewSubcategoryInput(false);
    setNewSubcategory('');
    setProdModalOpen(true);
  };

  const handleCatSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: catFormData.name.trim(),
        description: catFormData.description.trim(),
        image: catFormData.image.trim(),
        status: catFormData.status
      };

      if (editingCat) {
        // Update category
        const response = await fetch(`http://localhost:5000/api/admin/categories/${editingCat._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          await fetchCategories();
        }
      } else {
        // Create category
        const response = await fetch('http://localhost:5000/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (response.ok) {
          await fetchCategories();
        }
      }
      setCatModalOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleProdSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', prodFormData.name.trim());
      formData.append('price', prodFormData.price);
      formData.append('vendor', prodFormData.vendor.trim());
      formData.append('category', prodFormData.category.trim());
      formData.append('subcategory', prodFormData.subcategory.trim());
      if (prodFormData.image) {
        formData.append('image', prodFormData.image);
      }
      if (prodFormData.lat) formData.append('lat', prodFormData.lat);
      if (prodFormData.lon) formData.append('lon', prodFormData.lon);
      formData.append('stock', prodFormData.stock);
      formData.append('description', prodFormData.description.trim());
      
      // ✅ NEW: Append warranty and expiryDate if provided
      if (prodFormData.warranty) {
        formData.append('warranty', prodFormData.warranty.trim());
      }
      if (prodFormData.expiryDate) {
        formData.append('expiryDate', prodFormData.expiryDate);
      }
      
      formData.append('status', prodFormData.status);

      let response;
      if (editingProd) {
        // Update product
        response = await fetch(`http://localhost:5000/api/admin/products/${editingProd._id}`, {
          method: 'PUT',
          body: formData
        });
      } else {
        // Create product
        response = await fetch('http://localhost:5000/api/admin/products/upload', {
          method: 'POST',
          body: formData
        });
      }

      if (response.ok) {
        await fetchProducts();
        await fetchSubcategories(); // Refresh subcategories after adding new one
        setProdModalOpen(false);
      } else {
        console.error('Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const deleteCategory = async (id) => {
    if (window.confirm('Delete category?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/categories/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchCategories();
          await fetchProducts(); // Refresh products as category references may be updated
        }
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Delete product?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/products/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          await fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };



  const filteredProducts = products.filter(p => {
    const matchesSearch = !state.search || p.name.toLowerCase().includes(state.search.toLowerCase());
    const matchesCat = !state.catFilter || p.category === state.catFilter;
    const matchesStatus = !state.statusFilter || p.status === state.statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  const styles = {
    container: {
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(180deg, #0b1020, #0d1226)',
      color: '#e6eef8',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))',
      boxShadow: '0 8px 24px rgba(2,6,23,0.45)',
      border: '1px solid rgba(255,255,255,0.06)',
      position: 'sticky',
      top: 0,
      zIndex: 30
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '24px'
    },
    card: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: '16px',
      padding: '16px'
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '12px',
      padding: '10px 14px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer'
    },
    btnPrimary: {
      background: '#6366f1',
      color: 'white'
    },
    btnGhost: {
      background: 'rgba(255,255,255,0.04)',
      color: '#e6eef8'
    },
    btnDanger: {
      background: '#ef4444',
      color: 'white'
    },
    input: {
      background: 'rgba(30, 41, 59, 0.6)',
      border: '1px solid rgba(255,255,255,0.10)',
      borderRadius: '12px',
      padding: '10px 12px',
      color: '#e5e7eb'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(2,6,23,0.7)',
      backdropFilter: 'blur(10px)',
      zIndex: 50
    },
    modalContent: {
      background: '#0f162e',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '768px',
      width: '100%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    table: {
      width: '100%',
      fontSize: '0.875rem'
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '12px 16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ height: '36px', width: '36px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.2)', display: 'grid', placeItems: 'center', color: '#a5b4fc', fontWeight: '900' }}>
            CM
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Catalog — Categories & Products</h1>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Manage categories, products, variants, stock and SEO</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigateTo('admin-dashboard')}
              style={{ ...styles.btn, ...styles.btnPrimary, marginRight: '20px' }}
            >
              ← Back to Admin Home
            </button>
            <button style={{ ...styles.btn, ...styles.btnGhost }}>Export CSV</button>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        <section style={{ marginBottom: '24px' }}>
          <div style={styles.card}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                placeholder="Search products or categories"
                value={state.search}
                onChange={(e) => setState({ ...state, search: e.target.value })}
                style={{ ...styles.input, flex: 1, minWidth: '200px' }}
              />
              <select
                value={state.catFilter}
                onChange={(e) => setState({ ...state, catFilter: e.target.value })}
                style={styles.input}
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
              <select
                value={state.statusFilter}
                onChange={(e) => setState({ ...state, statusFilter: e.target.value })}
                style={styles.input}
              >
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="approved">Approved</option>
                <option value="inactive">Inactive</option>
                <option value="rejected">Rejected</option>
              </select>
              <button onClick={() => openCatModal()} style={{ ...styles.btn, ...styles.btnPrimary }}>
                + Category
              </button>
              <button onClick={() => openProdModal()} style={{ ...styles.btn, ...styles.btnPrimary }}>
                + Product
              </button>
            </div>
          </div>
        </section>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Categories</h3>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>{categories.length}</span>
            </div>
            <ul style={{ display: 'grid', gap: '8px' }}>
              {categories.map(cat => (
                <li key={cat._id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{cat.name}</span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => openCatModal(cat)} style={{ ...styles.btn, ...styles.btnGhost, padding: '4px 8px', fontSize: '0.75rem' }}>
                      Edit
                    </button>
                    <button onClick={() => deleteCategory(cat._id)} style={{ ...styles.btn, ...styles.btnDanger, padding: '4px 8px', fontSize: '0.75rem' }}>
                      Del
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div style={styles.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Products</h3>
              <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Showing {filteredProducts.length}</span>
            </div>
            <div style={{ overflowX: 'auto', maxHeight: '520px' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'left' }}>
                    <th style={{ padding: '8px' }}>Product</th>
                    <th style={{ padding: '8px' }}>Category</th>
                    <th style={{ padding: '8px' }}>Subcategory</th>
                    <th style={{ padding: '8px' }}>Price</th>
                    <th style={{ padding: '8px' }}>Stock</th>
                    <th style={{ padding: '8px' }}>Warranty</th>
                    <th style={{ padding: '8px' }}>Expiry</th>
                    <th style={{ padding: '8px' }}>Status</th>
                    <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(prod => (
                    <tr key={prod._id}>
                      <td style={{ padding: '8px' }}>
                        <div style={{ fontWeight: '600' }}>{prod.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{prod.description}</div>
                      </td>
                      <td style={{ padding: '8px' }}>{prod.category}</td>
                      <td style={{ padding: '8px' }}>{prod.subcategory || '-'}</td>
                      <td style={{ padding: '8px' }}>₹ {prod.price}</td>
                      <td style={{ padding: '8px' }}>{prod.stock}</td>
                      <td style={{ padding: '8px' }}>
                        {prod.warranty ? (
                          <span style={{ fontSize: '0.75rem', color: '#4CAF50' }}>{prod.warranty}</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '8px' }}>
                        {prod.expiryDate ? (
                          <span style={{ fontSize: '0.75rem', color: '#ff9800' }}>
                            {new Date(prod.expiryDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: '#666' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '8px' }}>{prod.status}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                          <button onClick={() => openProdModal(prod)} style={{ ...styles.btn, ...styles.btnGhost, padding: '6px 10px', fontSize: '0.75rem' }}>
                            Edit
                          </button>
                          <button onClick={() => deleteProduct(prod._id)} style={{ ...styles.btn, ...styles.btnDanger, padding: '6px 10px', fontSize: '0.75rem' }}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {/* Category Modal */}
      {catModalOpen && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setCatModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>{editingCat ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setCatModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleCatSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Category Name</span>
                <input
                  value={catFormData.name}
                  onChange={(e) => setCatFormData({ ...catFormData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Description</span>
                <textarea
                  value={catFormData.description}
                  onChange={(e) => setCatFormData({ ...catFormData, description: e.target.value })}
                  style={{ ...styles.input, fontFamily: 'inherit' }}
                  rows="3"
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Image URL</span>
                <input
                  value={catFormData.image}
                  onChange={(e) => setCatFormData({ ...catFormData, image: e.target.value })}
                  style={styles.input}
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</span>
                <select
                  value={catFormData.status}
                  onChange={(e) => setCatFormData({ ...catFormData, status: e.target.value })}
                  style={styles.input}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setCatModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {prodModalOpen && (
        <div style={styles.modal} onClick={(e) => e.target === e.currentTarget && setProdModalOpen(false)}>
          <div style={styles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>{editingProd ? 'Edit Product' : 'Add Product'}</h3>
              <button onClick={() => setProdModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer', fontSize: '1.25rem' }}>
                ✕
              </button>
            </div>
            <form onSubmit={handleProdSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Product Name</span>
                <input
                  value={prodFormData.name}
                  onChange={(e) => setProdFormData({ ...prodFormData, name: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Vendor</span>
                <input
                  value={prodFormData.vendor}
                  onChange={(e) => setProdFormData({ ...prodFormData, vendor: e.target.value })}
                  style={styles.input}
                  required
                />
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Category</span>
                <select
                  value={prodFormData.category}
                  onChange={(e) => {
                    const selectedCategory = e.target.value;
                    setProdFormData({ ...prodFormData, category: selectedCategory, subcategory: '' });
                    if (selectedCategory) {
                      fetchSubcategories(selectedCategory);
                      setSelectedCategoryForSubcategories(selectedCategory);
                    } else {
                      setSubcategories([]);
                      setSelectedCategoryForSubcategories('');
                    }
                  }}
                  style={styles.input}
                  required
                >
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Subcategory</span>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select
                    value={prodFormData.subcategory}
                    onChange={(e) => {
                      if (e.target.value === 'add-new') {
                        setShowNewSubcategoryInput(true);
                        setProdFormData({ ...prodFormData, subcategory: '' });
                      } else {
                        setProdFormData({ ...prodFormData, subcategory: e.target.value });
                        setShowNewSubcategoryInput(false);
                        setNewSubcategory('');
                      }
                    }}
                    style={styles.input}
                  >
                    <option value="">Select subcategory (optional)</option>
                    {subcategories.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                    <option value="add-new">+ Add New Subcategory</option>
                  </select>
                  {showNewSubcategoryInput && (
                    <input
                      value={newSubcategory}
                      onChange={(e) => setNewSubcategory(e.target.value)}
                      style={{ ...styles.input, flex: 1 }}
                      placeholder="Enter new subcategory"
                      onBlur={() => {
                        if (newSubcategory.trim()) {
                          setProdFormData({ ...prodFormData, subcategory: newSubcategory.trim() });
                        }
                      }}
                    />
                  )}
                </div>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Price</span>
                  <input
                    type="number"
                    value={prodFormData.price}
                    onChange={(e) => setProdFormData({ ...prodFormData, price: e.target.value })}
                    style={styles.input}
                    required
                  />
                </label>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Stock</span>
                  <input
                    type="number"
                    value={prodFormData.stock}
                    onChange={(e) => setProdFormData({ ...prodFormData, stock: e.target.value })}
                    style={styles.input}
                    required
                  />
                </label>
              </div>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Description</span>
                <textarea
                  value={prodFormData.description}
                  onChange={(e) => setProdFormData({ ...prodFormData, description: e.target.value })}
                  style={{ ...styles.input, fontFamily: 'inherit' }}
                  rows="3"
                />
              </label>
              
              {/* ✅ NEW: Warranty Field */}
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Warranty (Optional)</span>
                <input
                  type="text"
                  value={prodFormData.warranty}
                  onChange={(e) => setProdFormData({ ...prodFormData, warranty: e.target.value })}
                  style={styles.input}
                  placeholder="e.g., 1 year, 2 years, Lifetime"
                />
              </label>
              
              {/* ✅ NEW: Expiry Date Field */}
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Expiry Date (Optional)</span>
                <input
                  type="date"
                  value={prodFormData.expiryDate}
                  onChange={(e) => setProdFormData({ ...prodFormData, expiryDate: e.target.value })}
                  style={styles.input}
                />
              </label>
              
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Product Image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProdFormData({ ...prodFormData, image: e.target.files[0] })}
                  style={styles.input}
                />
                {editingProd && prodFormData.image && typeof prodFormData.image === 'string' && (
                  <div style={{ marginTop: '8px' }}>
                    <img src={`http://localhost:5000/uploads/${prodFormData.image}`} alt="Current product" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                  </div>
                )}
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Status</span>
                <select
                  value={prodFormData.status}
                  onChange={(e) => setProdFormData({ ...prodFormData, status: e.target.value })}
                  style={styles.input}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </label>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setProdModalOpen(false)} style={{ ...styles.btn, ...styles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...styles.btn, ...styles.btnPrimary }}>
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductManagement;