import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiCheckCircle, FiPackage, FiArrowRight } from 'react-icons/fi';
import api from '../utils/api';
import './OrderSuccess.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function OrderSuccess() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(({ data }) => setOrder(data.order)).catch(console.error);
  }, [id]);

  return (
    <div className="order-success page-enter">
      <div className="order-success__card">
        <div className="order-success__icon-wrap">
          <div className="order-success__icon">
            <FiCheckCircle />
          </div>
          <div className="order-success__rings">
            <div className="ring ring-1" /><div className="ring ring-2" /><div className="ring ring-3" />
          </div>
        </div>

        <h1 className="order-success__title">Order Placed! 🎉</h1>
        <p className="order-success__subtitle">Thank you for shopping with Mathesh Shopping Store</p>

        {order && (
          <div className="order-success__details">
            <div className="order-success__info-row">
              <span>Order Number</span>
              <span className="order-success__order-num">#{order.order_number}</span>
            </div>
            <div className="order-success__info-row">
              <span>Total Amount</span>
              <span>{formatPrice(order.final_amount)}</span>
            </div>
            <div className="order-success__info-row">
              <span>Status</span>
              <span className="badge badge-warning">{order.status}</span>
            </div>
            <div className="order-success__info-row">
              <span>Shipping To</span>
              <span>{order.shipping_city}, {order.shipping_country}</span>
            </div>

            <div className="order-success__items">
              {order.items?.map(item => (
                <div className="order-success__item" key={item.id}>
                  <img src={item.image} alt={item.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                  <span>{item.name}</span>
                  <span>x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="order-success__actions">
          <Link to="/orders" className="btn btn-primary btn-lg">
            <FiPackage /> Track Order
          </Link>
          <Link to="/products" className="btn btn-secondary btn-lg">
            Continue Shopping <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}
