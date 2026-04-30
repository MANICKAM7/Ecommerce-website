import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiDollarSign, FiPackage, FiTrendingUp, FiGrid, FiList, FiTag } from 'react-icons/fi';
import api from '../../utils/api';
import './Admin.css';

const formatPrice = (p) => `₹${Number(p || 0).toLocaleString('en-IN')}`;

const STATUS_BADGE = {
  pending: 'warning', confirmed: 'info', processing: 'primary',
  shipped: 'primary', delivered: 'success', cancelled: 'danger',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => {
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
        setTopProducts(data.topProducts);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const statCards = [
    { icon: <FiUsers />, label: 'Total Users', value: stats?.totalUsers?.toLocaleString(), color: '#6c63ff', bg: 'rgba(108,99,255,0.12)' },
    { icon: <FiShoppingBag />, label: 'Total Orders', value: stats?.totalOrders?.toLocaleString(), color: '#ff6584', bg: 'rgba(255,101,132,0.12)' },
    { icon: <FiDollarSign />, label: 'Total Revenue', value: formatPrice(stats?.totalRevenue), color: '#43e97b', bg: 'rgba(67,233,123,0.12)' },
    { icon: <FiPackage />, label: 'Active Products', value: stats?.totalProducts?.toLocaleString(), color: '#38f9d7', bg: 'rgba(56,249,215,0.12)' },
  ];

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Dashboard</h1>
            <p className="admin-subtitle">Welcome back! Here's what's happening.</p>
          </div>
          <div className="admin-nav-btns">
            <Link to="/admin/products" className="btn btn-secondary btn-sm"><FiGrid size={14} /> Products</Link>
            <Link to="/admin/orders" className="btn btn-secondary btn-sm"><FiList size={14} /> Orders</Link>
            <Link to="/admin/users" className="btn btn-secondary btn-sm"><FiUsers size={14} /> Users</Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="admin-stats-grid">
          {statCards.map((card, i) => (
            <div className="admin-stat-card" key={i} style={{ '--stat-color': card.color, '--stat-bg': card.bg }}>
              <div className="admin-stat-card__icon">{card.icon}</div>
              <div className="admin-stat-card__info">
                <span className="admin-stat-card__label">{card.label}</span>
                <span className="admin-stat-card__value">{card.value}</span>
              </div>
              <FiTrendingUp className="admin-stat-card__trend" />
            </div>
          ))}
        </div>

        <div className="admin-grid-2">
          {/* Recent Orders */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>Recent Orders</h2>
              <Link to="/admin/orders" className="btn btn-ghost btn-sm">View All →</Link>
            </div>
            <div className="admin-table">
              <div className="admin-table__head">
                <span>Order</span>
                <span>Customer</span>
                <span>Amount</span>
                <span>Status</span>
              </div>
              {recentOrders.map(order => (
                <div className="admin-table__row" key={order.id}>
                  <span className="admin-table__order-num">#{order.order_number}</span>
                  <span>{order.user_name}</span>
                  <span>{formatPrice(order.final_amount)}</span>
                  <span><span className={`badge badge-${STATUS_BADGE[order.status] || 'info'}`}>{order.status}</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h2>Top Selling Products</h2>
              <Link to="/admin/products" className="btn btn-ghost btn-sm">Manage →</Link>
            </div>
            <div className="top-products-list">
              {topProducts.map((p, i) => (
                <div className="top-product-item" key={i}>
                  <span className="top-product-item__rank">#{i + 1}</span>
                  <img src={p.image} alt={p.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                  <div className="top-product-item__info">
                    <span className="top-product-item__name">{p.name}</span>
                    <span className="top-product-item__price">{formatPrice(p.price)}</span>
                  </div>
                  <span className="top-product-item__sold">{p.total_sold} sold</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
