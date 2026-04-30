import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight, FiTag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function Cart() {
  const { cart, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.items.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <div className="cart-empty__icon"><FiShoppingCart /></div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn btn-primary btn-lg">
          <FiShoppingCart /> Start Shopping
        </Link>
      </div>
    );
  }

  const shipping = cart.total >= 5000 ? 0 : 99;
  const tax = cart.total * 0.18;
  const total = cart.total + shipping + tax;

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <h1 className="cart-page__title">
          <FiShoppingCart /> Shopping Cart
          <span className="cart-page__count">{cart.count} {cart.count === 1 ? 'item' : 'items'}</span>
        </h1>

        <div className="cart-page__layout">
          {/* Cart Items */}
          <div className="cart-items">
            <div className="cart-items__header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {cart.items.map(item => (
              <div className="cart-item" key={item.id}>
                <div className="cart-item__product">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="cart-item__image"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100'; }}
                  />
                  <div className="cart-item__details">
                    <Link to={`/products/${item.slug}`} className="cart-item__name">{item.name}</Link>
                    {item.stock < 5 && item.stock > 0 && (
                      <span className="badge badge-warning" style={{ fontSize: '10px' }}>Only {item.stock} left!</span>
                    )}
                  </div>
                </div>
                <div className="cart-item__price">{formatPrice(item.price)}</div>
                <div className="cart-item__qty">
                  <div className="qty-control">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}><FiMinus /></button>
                    <span className="qty-value">{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stock}><FiPlus /></button>
                  </div>
                </div>
                <div className="cart-item__total">{formatPrice(item.price * item.quantity)}</div>
                <button className="icon-btn" style={{ color: '#ff6b6b' }} onClick={() => removeItem(item.id)} title="Remove">
                  <FiTrash2 />
                </button>
              </div>
            ))}

            <div className="cart-items__footer">
              <Link to="/products" className="btn btn-secondary btn-sm">← Continue Shopping</Link>
              <button className="btn btn-ghost btn-sm" onClick={clearCart} style={{ color: '#ff6b6b' }}>
                <FiTrash2 /> Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="cart-summary">
            <h2 className="cart-summary__title">Order Summary</h2>

            <div className="cart-summary__line">
              <span>Subtotal ({cart.count} items)</span>
              <span>{formatPrice(cart.total)}</span>
            </div>
            <div className="cart-summary__line">
              <span>Shipping</span>
              <span>{shipping === 0 ? <span style={{ color: 'var(--accent)' }}>FREE</span> : formatPrice(shipping)}</span>
            </div>
            {shipping > 0 && (
              <div className="cart-summary__free-shipping">
                Add {formatPrice(5000 - cart.total)} more for FREE shipping!
              </div>
            )}
            <div className="cart-summary__line">
              <span>Tax (18%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__line cart-summary__total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            <div className="cart-summary__coupon">
              <FiTag size={14} />
              <span>Have a coupon? Apply at checkout.</span>
            </div>

            <button className="btn btn-primary btn-lg btn-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout <FiArrowRight />
            </button>

            <div className="cart-summary__trust">
              <span>🔒 Secure & Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
