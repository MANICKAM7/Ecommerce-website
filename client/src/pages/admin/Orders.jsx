import { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled','refunded'];
const STATUS_BADGE = { pending:'warning', confirmed:'info', processing:'primary', shipped:'primary', delivered:'success', cancelled:'danger', refunded:'danger' };

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    api.get(`/admin/orders${filter ? `?status=${filter}` : ''}`)
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      toast.success('Order status updated!');
      fetchOrders();
    } catch { toast.error('Failed.'); }
  };

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Orders</h1>
            <p className="admin-subtitle">{orders.length} orders</p>
          </div>
        </div>
        <div className="admin-toolbar">
          <select className="form-input" style={{ maxWidth: 200, fontSize: 13, padding: '9px 12px' }} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
          </select>
        </div>
        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <div className="admin-full-table">
            <div className="admin-full-table__head" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 140px' }}>
              <span>Order</span><span>Customer</span><span>Date</span><span>Amount</span><span>Payment</span><span>Status</span>
            </div>
            {orders.map(order => (
              <div className="admin-full-table__row" key={order.id} style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr 1fr 140px' }}>
                <span style={{ fontWeight: 700, color: 'var(--primary-light)', fontSize: 12 }}>#{order.order_number}</span>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{order.user_name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{order.user_email}</div>
                </div>
                <span>{new Date(order.created_at).toLocaleDateString('en-IN')}</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(order.final_amount)}</span>
                <span><span className={`badge badge-${order.payment_status === 'paid' ? 'success' : 'warning'}`}>{order.payment_status}</span></span>
                <select
                  className="form-input"
                  style={{ fontSize: 12, padding: '6px 8px' }}
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
