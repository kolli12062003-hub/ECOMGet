// ============================================
// 1. AdminPaymentManagement.jsx
// ============================================

import React, { useState, useEffect } from 'react';

export const AdminPaymentManagement = ({ navigateTo }) => {
  const [orders, setOrders] = useState([
    { id: 'ORD1001', user:'Aarav Sharma', date:'2025-09-08T10:22', subtotal:1200, discount:100, shipping:40, total:1140, payment:{method:'Card',status:'Completed',txnId:'TXN1001'}, status:'Paid', freeDeliveryApplied:false, items:[{name:'T-Shirt',qty:2,price:400}] },
    { id: 'ORD1002', user:'Isha Patel', date:'2025-09-08T11:05', subtotal:500, discount:0, shipping:60, total:560, payment:{method:'COD',status:'Pending',txnId:''}, status:'Pending', freeDeliveryApplied:false, items:[{name:'Mug',qty:1,price:500}] },
    { id: 'ORD1003', user:'Neha Gupta', date:'2025-09-07T18:12', subtotal:2000, discount:200, shipping:0, total:1800, payment:{method:'UPI',status:'Completed',txnId:'UPI-9876'}, status:'Shipped', freeDeliveryApplied:true, items:[{name:'Shoes',qty:1,price:2000}] }
  ]);

  const [freeRules, setFreeRules] = useState([{ id:1, minOrder:1500, appliesTo:'', active:true, usageCount:5 }]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [freeModalOpen, setFreeModalOpen] = useState(false);
  const [currentOrderForStatus, setCurrentOrderForStatus] = useState(null);
  const [statusFormData, setStatusFormData] = useState({ status: '', payment: '', txnId: '' });
  const [freeFormData, setFreeFormData] = useState({ id: '', minOrder: '', appliesTo: '', active: 'true' });
  
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    fromDate: '',
    toDate: ''
  });

  const getKPIs = () => {
    const today = new Date().toISOString().slice(0,10);
    return {
      today: orders.filter(o => o.date.slice(0,10) === today).length,
      paid: orders.filter(o => o.payment.status === 'Completed').length,
      pending: orders.filter(o => o.payment.status === 'Pending').length,
      free: orders.filter(o => o.freeDeliveryApplied).length
    };
  };

  const openDrawer = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setDrawerOpen(true);
  };

  const openStatusModal = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setCurrentOrderForStatus(order);
    setStatusFormData({
      status: order.status,
      payment: order.payment.status,
      txnId: order.payment.txnId || ''
    });
    setStatusModalOpen(true);
  };

  const handleStatusSubmit = (e) => {
    e.preventDefault();
    if (!currentOrderForStatus) return;
    
    const updatedOrders = orders.map(o => {
      if (o.id === currentOrderForStatus.id) {
        return {
          ...o,
          status: statusFormData.status,
          payment: {
            ...o.payment,
            status: statusFormData.payment,
            txnId: statusFormData.txnId
          }
        };
      }
      return o;
    });
    
    setOrders(updatedOrders);
    setStatusModalOpen(false);
    toast('Order updated');
  };

  const handleFreeSubmit = (e) => {
    e.preventDefault();
    const id = freeFormData.id ? Number(freeFormData.id) : null;
    const payload = {
      id: id || (Math.max(0, ...freeRules.map(r => r.id)) + 1),
      minOrder: Number(freeFormData.minOrder) || 0,
      appliesTo: freeFormData.appliesTo.trim(),
      active: freeFormData.active === 'true'
    };

    if (id) {
      setFreeRules(freeRules.map(r => r.id === id ? { ...r, ...payload } : r));
      toast('Rule updated');
    } else {
      setFreeRules([...freeRules, { ...payload, usageCount: 0 }]);
      toast('Rule created');
    }
  };

  const deleteFreeRule = (id) => {
    setFreeRules(freeRules.filter(r => r.id !== id));
    toast('Rule deleted');
  };

  const markShipped = () => {
    if (!selectedOrder) return;
    const updatedOrders = orders.map(o =>
      o.id === selectedOrder.id ? { ...o, status: 'Shipped' } : o
    );
    setOrders(updatedOrders);
    setDrawerOpen(false);
    toast('Marked shipped');
  };

  const refundOrder = () => {
    if (!selectedOrder) return;
    if (!window.confirm('Process refund?')) return;
    
    const updatedOrders = orders.map(o =>
      o.id === selectedOrder.id ? { ...o, status: 'Refunded', payment: { ...o.payment, status: 'Refunded' } } : o
    );
    setOrders(updatedOrders);
    setDrawerOpen(false);
    toast('Refunded');
  };

  const toast = (msg) => {
    // Simple toast implementation
    alert(msg);
  };

  const kpis = getKPIs();

  const paymentStyles = {
    container: {
      fontFamily: 'Inter, system-ui, sans-serif',
      background: 'linear-gradient(180deg, #0b1020, #0d1226)',
      color: '#e6eef8',
      minHeight: '100vh'
    },
    header: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.06)',
      boxShadow: '0 8px 24px rgba(2,6,23,0.45)',
      position: 'sticky',
      top: 0,
      padding: '12px',
      zIndex: 30
    },
    main: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '16px'
    },
    kpiGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '16px',
      marginBottom: '24px'
    },
    kpiCard: {
      background: 'linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '16px'
    },
    table: {
      width: '100%',
      fontSize: '0.875rem'
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      borderRadius: '10px',
      padding: '8px 12px',
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
    drawer: {
      position: 'fixed',
      right: 0,
      top: 0,
      height: '100%',
      width: '480px',
      transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s',
      zIndex: 40,
      background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
      border: '1px solid rgba(255,255,255,0.06)',
      padding: '16px',
      overflowY: 'auto'
    },
    modal: {
      position: 'fixed',
      inset: 0,
      display: statusModalOpen || freeModalOpen ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(2,6,23,0.6)',
      zIndex: 50
    },
    modalContent: {
      background: '#0f162e',
      padding: '16px',
      borderRadius: '12px',
      maxWidth: '640px',
      width: '100%'
    },
    input: {
      backgroundColor: 'rgba(30, 41, 59, 0.6)',
      padding: '8px 12px',
      borderRadius: '12px',
      border: 'none',
      color: '#e6eef8',
      width: '100%'
    }
  };

  return (
    <div style={paymentStyles.container}>
      <header style={paymentStyles.header}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontWeight: 'bold' }}>Orders & Payments</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Manage orders, payments, refunds and free-delivery rules</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigateTo('admin-dashboard')}
              style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary, marginRight: '20px' }}
            >
              ← Back to Admin Home
            </button>
            <button style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary }}>Catalog</button>
            <button style={{ ...paymentStyles.btn, ...paymentStyles.btnGhost }}>Offers</button>
          </div>
        </div>
      </header>

      <main style={paymentStyles.main}>
        <section style={paymentStyles.kpiGrid}>
          <div style={paymentStyles.kpiCard}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Today Orders</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpis.today}</div>
          </div>
          <div style={paymentStyles.kpiCard}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Paid</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpis.paid}</div>
          </div>
          <div style={paymentStyles.kpiCard}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Pending Payments</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpis.pending}</div>
          </div>
          <div style={paymentStyles.kpiCard}>
            <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Free Delivery Used</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{kpis.free}</div>
          </div>
        </section>

        <section style={{ ...paymentStyles.kpiCard, marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <input
              placeholder="Search order id, customer, txn id"
              style={{ ...paymentStyles.input, flex: 1, minWidth: '288px' }}
            />
            <select style={paymentStyles.input}>
              <option value="">All Status</option>
              <option>Pending</option>
              <option>Paid</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
              <option>Refunded</option>
            </select>
            <button onClick={() => setFreeModalOpen(true)} style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary }}>
              Free Delivery Rules
            </button>
          </div>
        </section>

        <section style={{ ...paymentStyles.kpiCard, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto', maxHeight: '520px' }}>
            <table style={paymentStyles.table}>
              <thead>
                <tr style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Payment</th>
                  <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td style={{ padding: '8px', fontWeight: '600' }}>{order.id}</td>
                    <td style={{ padding: '8px' }}>{order.user}</td>
                    <td style={{ padding: '8px' }}>{new Date(order.date).toLocaleString()}</td>
                    <td style={{ padding: '8px' }}>₹ {order.total}</td>
                    <td style={{ padding: '8px' }}>
                      {order.payment.method}
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        {order.payment.status}{order.payment.txnId ? ' • ' + order.payment.txnId : ''}
                      </div>
                    </td>
                    <td style={{ padding: '8px' }}>{order.status}</td>
                    <td style={{ padding: '8px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '8px' }}>
                        <button onClick={() => openDrawer(order.id)} style={{ ...paymentStyles.btn, ...paymentStyles.btnGhost }}>
                          View
                        </button>
                        <button onClick={() => openStatusModal(order.id)} style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary }}>
                          Update
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* Order Drawer */}
      <aside style={paymentStyles.drawer}>
        {selectedOrder && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Order {selectedOrder.id}</h3>
              <button onClick={() => setDrawerOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ fontSize: '0.875rem', marginTop: '12px', display: 'grid', gap: '12px' }}>
              <div><strong>Customer:</strong> {selectedOrder.user}</div>
              <div><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</div>
              <div><strong>Items:</strong> {selectedOrder.items.map(i => `${i.name} x${i.qty}`).join(', ')}</div>
              <div><strong>Subtotal:</strong> ₹ {selectedOrder.subtotal}</div>
              <div><strong>Discount:</strong> ₹ {selectedOrder.discount}</div>
              <div><strong>Shipping:</strong> ₹ {selectedOrder.shipping}</div>
              <div style={{ fontWeight: 'bold' }}>Total: ₹ {selectedOrder.total}</div>
              <div><strong>Payment:</strong> {selectedOrder.payment.method} • {selectedOrder.payment.status}</div>
              <div><strong>Order Status:</strong> {selectedOrder.status}</div>
            </div>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <button onClick={markShipped} style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary }}>Mark Shipped</button>
              <button onClick={refundOrder} style={{ ...paymentStyles.btn, ...paymentStyles.btnDanger }}>Refund</button>
            </div>
          </div>
        )}
      </aside>

      {/* Status Modal */}
      {statusModalOpen && (
        <div style={paymentStyles.modal} onClick={(e) => e.target === e.currentTarget && setStatusModalOpen(false)}>
          <div style={paymentStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Update Order Status</h3>
              <button onClick={() => setStatusModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={handleStatusSubmit} style={{ display: 'grid', gap: '12px' }}>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Order Status</span>
                <select
                  value={statusFormData.status}
                  onChange={(e) => setStatusFormData({ ...statusFormData, status: e.target.value })}
                  style={paymentStyles.input}
                >
                  <option>Pending</option>
                  <option>Paid</option>
                  <option>Shipped</option>
                  <option>Delivered</option>
                  <option>Cancelled</option>
                  <option>Refunded</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Payment Status</span>
                <select
                  value={statusFormData.payment}
                  onChange={(e) => setStatusFormData({ ...statusFormData, payment: e.target.value })}
                  style={paymentStyles.input}
                >
                  <option>Pending</option>
                  <option>Completed</option>
                  <option>Failed</option>
                  <option>Refunded</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: '4px' }}>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Transaction ID (optional)</span>
                <input
                  value={statusFormData.txnId}
                  onChange={(e) => setStatusFormData({ ...statusFormData, txnId: e.target.value })}
                  style={paymentStyles.input}
                />
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setStatusModalOpen(false)} style={{ ...paymentStyles.btn, ...paymentStyles.btnGhost }}>
                  Cancel
                </button>
                <button type="submit" style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Free Delivery Modal */}
      {freeModalOpen && (
        <div style={paymentStyles.modal} onClick={(e) => e.target === e.currentTarget && setFreeModalOpen(false)}>
          <div style={paymentStyles.modalContent}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h3 style={{ fontWeight: 'bold' }}>Free Delivery Rules</h3>
              <button onClick={() => setFreeModalOpen(false)} style={{ background: 'none', border: 'none', color: '#e6eef8', cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <form onSubmit={handleFreeSubmit} style={{ display: 'grid', gap: '8px' }}>
                <input type="hidden" value={freeFormData.id} />
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Min Order Value (₹)</span>
                  <input
                    type="number"
                    min="0"
                    value={freeFormData.minOrder}
                    onChange={(e) => setFreeFormData({ ...freeFormData, minOrder: e.target.value })}
                    style={paymentStyles.input}
                  />
                </label>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Applies To</span>
                  <input
                    value={freeFormData.appliesTo}
                    onChange={(e) => setFreeFormData({ ...freeFormData, appliesTo: e.target.value })}
                    style={paymentStyles.input}
                  />
                </label>
                <label style={{ display: 'grid', gap: '4px' }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Active</span>
                  <select
                    value={freeFormData.active}
                    onChange={(e) => setFreeFormData({ ...freeFormData, active: e.target.value })}
                    style={paymentStyles.input}
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="submit" style={{ ...paymentStyles.btn, ...paymentStyles.btnPrimary }}>Save Rule</button>
                  <button
                    type="button"
                    onClick={() => setFreeFormData({ id: '', minOrder: '', appliesTo: '', active: 'true' })}
                    style={{ ...paymentStyles.btn, ...paymentStyles.btnGhost }}
                  >
                    New
                  </button>
                </div>
              </form>
              <div>
                <h4 style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '8px' }}>Existing Rules</h4>
                <ul style={{ fontSize: '0.875rem', display: 'grid', gap: '8px' }}>
                  {freeRules.map(rule => (
                    <li key={rule.id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>Min ₹{rule.minOrder} {rule.appliesTo && `• ${rule.appliesTo}`}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setFreeFormData({ id: rule.id.toString(), minOrder: rule.minOrder.toString(), appliesTo: rule.appliesTo || '', active: rule.active ? 'true' : 'false' })}
                          style={{ ...paymentStyles.btn, ...paymentStyles.btnGhost, fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFreeRule(rule.id)}
                          style={{ ...paymentStyles.btn, ...paymentStyles.btnDanger, fontSize: '0.75rem', padding: '4px 8px' }}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Export all components
export default AdminPaymentManagement;