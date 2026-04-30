import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiTruck, FiTag, FiCheck, FiChevronRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import './Checkout.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

export default function Checkout() {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const [shipping, setShipping] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    country: 'India',
    zip: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [notes, setNotes] = useState('');

  const subtotal = cart.total;
  const shippingCost = subtotal >= 5000 ? 0 : 99;
  const tax = (subtotal - couponDiscount) * 0.18;
  const finalTotal = subtotal - couponDiscount + shippingCost + tax;

  const handleShippingChange = (e) => {
    setShipping(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) return;
    setValidatingCoupon(true);
    try {
      const { data } = await api.post('/orders/validate-coupon', { code: couponCode, amount: subtotal });
      setCouponDiscount(data.discount);
      setCouponApplied(true);
      toast.success(`Coupon applied! You saved ${formatPrice(data.discount)} 🎉`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon.');
      setCouponApplied(false);
      setCouponDiscount(0);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setCouponDiscount(0);
    setCouponApplied(false);
  };

  const placeOrder = async () => {
    const required = ['name', 'email', 'phone', 'address', 'city', 'country', 'zip'];
    for (const field of required) {
      if (!shipping[field]) {
        toast.error(`Please fill in ${field}.`);
        setStep(1);
        return;
      }
    }
    setLoading(true);
    try {
      const { data } = await api.post('/orders', {
        shipping,
        payment_method: paymentMethod,
        coupon_code: couponApplied ? couponCode : null,
        notes,
      });
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-success/${data.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page page-enter">
      <div className="container">
        <h1 className="checkout-page__title">Checkout</h1>

        {/* Steps Indicator */}
        <div className="checkout-steps">
          {['Shipping', 'Payment', 'Review'].map((label, i) => (
            <div key={i} className={`checkout-step ${step > i + 1 ? 'done' : ''} ${step === i + 1 ? 'active' : ''}`}>
              <div className="checkout-step__num">
                {step > i + 1 ? <FiCheck /> : i + 1}
              </div>
              <span className="checkout-step__label">{label}</span>
              {i < 2 && <FiChevronRight className="checkout-step__sep" />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left - Steps Content */}
          <div className="checkout-left">

            {/* Step 1 - Shipping */}
            {step === 1 && (
              <div className="checkout-card">
                <div className="checkout-card__header">
                  <FiTruck className="checkout-card__icon" />
                  <h2>Shipping Information</h2>
                </div>
                <div className="checkout-form-grid">
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input name="name" className="form-input" value={shipping.name} onChange={handleShippingChange} placeholder="John Doe" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input name="email" type="email" className="form-input" value={shipping.email} onChange={handleShippingChange} placeholder="john@example.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input name="phone" className="form-input" value={shipping.phone} onChange={handleShippingChange} placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">ZIP / Postal Code *</label>
                    <input name="zip" className="form-input" value={shipping.zip} onChange={handleShippingChange} placeholder="560001" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Street Address *</label>
                    <input name="address" className="form-input" value={shipping.address} onChange={handleShippingChange} placeholder="123, MG Road, Apartment 4B" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">City *</label>
                    <input name="city" className="form-input" value={shipping.city} onChange={handleShippingChange} placeholder="Bangalore" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Country *</label>
                    <select name="country" className="form-input" value={shipping.country} onChange={handleShippingChange}>
                      <option value="India">India</option>
                      <option value="USA">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="Canada">Canada</option>
                      <option value="Australia">Australia</option>
                    </select>
                  </div>
                </div>
                <div className="form-group" style={{ marginTop: 16 }}>
                  <label className="form-label">Order Notes (optional)</label>
                  <textarea className="form-input" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions..." style={{ resize: 'vertical' }} />
                </div>
                <button className="btn btn-primary btn-lg" style={{ marginTop: 20 }} onClick={() => setStep(2)}>
                  Continue to Payment <FiChevronRight />
                </button>
              </div>
            )}

            {/* Step 2 - Payment */}
            {step === 2 && (
              <div className="checkout-card">
                <div className="checkout-card__header">
                  <FiCreditCard className="checkout-card__icon" />
                  <h2>Payment Method</h2>
                </div>
                <div className="payment-methods">
                  {[
                    { value: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when your order arrives' },
                    { value: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, RuPay' },
                    { value: 'upi', label: 'UPI Payment', icon: '📱', desc: 'GPay, PhonePe, Paytm' },
                    { value: 'netbanking', label: 'Net Banking', icon: '🏦', desc: 'All major banks supported' },
                  ].map(method => (
                    <label key={method.value} className={`payment-method ${paymentMethod === method.value ? 'active' : ''}`}>
                      <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={() => setPaymentMethod(method.value)} />
                      <span className="payment-method__icon">{method.icon}</span>
                      <div className="payment-method__info">
                        <span className="payment-method__label">{method.label}</span>
                        <span className="payment-method__desc">{method.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Coupon */}
                <div className="coupon-section">
                  <div className="coupon-section__header">
                    <FiTag size={16} />
                    <h3>Apply Coupon</h3>
                  </div>
                  {couponApplied ? (
                    <div className="coupon-applied">
                      <FiCheck />
                      <span>Coupon <strong>{couponCode.toUpperCase()}</strong> applied! Saved {formatPrice(couponDiscount)}</span>
                      <button className="btn btn-ghost btn-sm" onClick={removeCoupon}>Remove</button>
                    </div>
                  ) : (
                    <div className="coupon-input-row">
                      <input className="form-input" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Enter coupon code (e.g. WELCOME10)" style={{ flex: 1 }} />
                      <button className="btn btn-outline" onClick={validateCoupon} disabled={validatingCoupon || !couponCode.trim()}>
                        {validatingCoupon ? 'Validating...' : 'Apply'}
                      </button>
                    </div>
                  )}
                  <p className="coupon-section__hint">Try: WELCOME10, SAVE500, FLASH20</p>
                </div>

                <div className="checkout-nav-btns">
                  <button className="btn btn-secondary" onClick={() => setStep(1)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={() => setStep(3)}>Review Order <FiChevronRight /></button>
                </div>
              </div>
            )}

            {/* Step 3 - Review */}
            {step === 3 && (
              <div className="checkout-card">
                <div className="checkout-card__header">
                  <FiCheck className="checkout-card__icon" />
                  <h2>Review Your Order</h2>
                </div>

                {/* Order Items */}
                <div className="review-items">
                  {cart.items.map(item => (
                    <div className="review-item-row" key={item.id}>
                      <img src={item.image} alt={item.name} className="review-item-row__img"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80'; }} />
                      <div className="review-item-row__info">
                        <span className="review-item-row__name">{item.name}</span>
                        <span className="review-item-row__qty">Qty: {item.quantity}</span>
                      </div>
                      <span className="review-item-row__price">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping Address Summary */}
                <div className="review-summary-card">
                  <h4>Shipping To</h4>
                  <p>{shipping.name} · {shipping.phone}</p>
                  <p>{shipping.address}, {shipping.city}, {shipping.country} – {shipping.zip}</p>
                </div>

                <div className="review-summary-card">
                  <h4>Payment Method</h4>
                  <p style={{ textTransform: 'capitalize' }}>{paymentMethod.replace('_', ' ')}</p>
                </div>

                <div className="checkout-nav-btns">
                  <button className="btn btn-secondary" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={placeOrder} disabled={loading}>
                    {loading ? 'Placing Order...' : `Place Order · ${formatPrice(finalTotal)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right - Order Summary */}
          <div className="checkout-summary">
            <h2 className="checkout-summary__title">Order Summary</h2>
            <div className="checkout-summary__items">
              {cart.items.map(item => (
                <div className="checkout-summary__item" key={item.id}>
                  <img src={item.image} alt={item.name}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                  <div className="checkout-summary__item-info">
                    <span>{item.name}</span>
                    <span>x{item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__line"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            {couponDiscount > 0 && <div className="checkout-summary__line" style={{ color: 'var(--accent)' }}><span>Coupon Discount</span><span>- {formatPrice(couponDiscount)}</span></div>}
            <div className="checkout-summary__line"><span>Shipping</span><span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span></div>
            <div className="checkout-summary__line"><span>Tax (18%)</span><span>{formatPrice(tax)}</span></div>
            <div className="checkout-summary__divider" />
            <div className="checkout-summary__line checkout-summary__total">
              <span>Total</span>
              <span>{formatPrice(finalTotal)}</span>
            </div>
            <p className="checkout-summary__secure">🔒 Secure encrypted checkout</p>
          </div>
        </div>
      </div>
    </div>
  );
}
