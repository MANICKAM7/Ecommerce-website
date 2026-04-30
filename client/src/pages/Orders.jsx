import { useState, useEffect } from 'react';
import { FiPackage, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import api from '../utils/api';
import './Orders.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const STATUS_COLORS = {
  pending: 'warning', confirmed: 'info', processing: 'primary',
  shipped: 'primary', delivered: 'success', cancelled: 'danger', refunded: 'danger',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    api.get('/orders')
      .then(({ data }) => setOrders(data.orders))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="orders-page page-enter">
      <div className="container">
        <h1 className="orders-page__title"><FiPackage /> My Orders</h1>

        {orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders__icon">📦</div>
            <h3>No orders yet</h3>
            <p>Your order history will appear here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div className="order-card" key={order.id}>
                <div className="order-card__header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="order-card__meta">
                    <span className="order-card__num">#{order.order_number}</span>
                    <span className={`badge badge-${STATUS_COLORS[order.status] || 'info'}`}>{order.status}</span>
                  </div>
                  <div className="order-card__info">
                    <span className="order-card__date">{new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="order-card__total">{formatPrice(order.final_amount)}</span>
                    <span className="order-card__items">{order.item_count} item{order.item_count !== 1 ? 's' : ''}</span>
                  </div>
                  {expanded === order.id ? <FiChevronUp /> : <FiChevronDown />}
                </div>

                {expanded === order.id && (
                  <div className="order-card__details">
                    <div className="order-items-list">
                      {order.items?.map(item => (
                        <div className="order-item" key={item.id}>
                          <img src={item.image} alt={item.name}
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                          <div className="order-item__info">
                            <span className="order-item__name">{item.name}</span>
                            <span className="order-item__qty">Qty: {item.quantity} × {formatPrice(item.price)}</span>
                          </div>
                          <span className="order-item__total">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="order-card__summary">
                      <div className="order-card__addr">
                        <strong>Shipping To:</strong><br />
                        {order.shipping_name}, {order.shipping_address},<br />
                        {order.shipping_city}, {order.shipping_country} – {order.shipping_zip}
                      </div>
                      <div className="order-card__totals">
                        <div className="order-total-row"><span>Subtotal</span><span>{formatPrice(order.total_amount)}</span></div>
                        {order.discount_amount > 0 && <div className="order-total-row" style={{ color: 'var(--accent)' }}><span>Discount</span><span>-{formatPrice(order.discount_amount)}</span></div>}
                        <div className="order-total-row"><span>Shipping</span><span>{order.shipping_amount > 0 ? formatPrice(order.shipping_amount) : 'Free'}</span></div>
                        <div className="order-total-row"><span>Tax</span><span>{formatPrice(order.tax_amount)}</span></div>
                        <div className="order-total-row order-total-row--final"><span>Total</span><span>{formatPrice(order.final_amount)}</span></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
