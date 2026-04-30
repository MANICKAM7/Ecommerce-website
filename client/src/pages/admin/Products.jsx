import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import './Admin.css';

const formatPrice = (p) => `₹${Number(p).toLocaleString('en-IN')}`;

const emptyForm = { name: '', description: '', price: '', original_price: '', stock: '', category_id: '', image: '', is_featured: false };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    const { data } = await api.get(`/products?limit=100&search=${search}`);
    setProducts(data.products);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [search]);
  useEffect(() => { api.get('/categories').then(({ data }) => setCategories(data.categories)); }, []);

  const openCreate = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name: p.name, description: p.description, price: p.price, original_price: p.original_price || '', stock: p.stock, category_id: p.category_id, image: p.image, is_featured: p.is_featured });
    setEditingId(p.id); setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, { ...form, is_active: true });
        toast.success('Product updated!');
      } else {
        await api.post('/products', form);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed.');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Product deleted.');
    fetchProducts();
  };

  return (
    <div className="admin-page page-enter">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Products</h1>
            <p className="admin-subtitle">{products.length} products found</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate}><FiPlus /> Add Product</button>
        </div>

        <div className="admin-toolbar">
          <div className="admin-search">
            <FiSearch color="var(--text-muted)" />
            <input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
          <div className="admin-full-table">
            <div className="admin-full-table__head" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 100px' }}>
              <span>Product</span><span>Category</span><span>Price</span><span>Stock</span><span>Featured</span><span>Actions</span>
            </div>
            {products.map(p => (
              <div className="admin-full-table__row" key={p.id} style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 80px 100px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img src={p.image} alt={p.name} style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 8 }}
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=60'; }} />
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>{p.name}</span>
                </div>
                <span>{p.category_name || '-'}</span>
                <span style={{ fontWeight: 600 }}>{formatPrice(p.price)}</span>
                <span>
                  <span className={`badge ${p.stock > 10 ? 'badge-success' : p.stock > 0 ? 'badge-warning' : 'badge-danger'}`}>
                    {p.stock}
                  </span>
                </span>
                <span>{p.is_featured ? '⭐' : '-'}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="icon-btn" onClick={() => openEdit(p)} title="Edit"><FiEdit2 size={14} /></button>
                  <button className="icon-btn" style={{ color: '#ff6b6b' }} onClick={() => handleDelete(p.id)} title="Delete"><FiTrash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal__header">
              <h2 className="modal__title">{editingId ? 'Edit Product' : 'Add Product'}</h2>
              <button className="icon-btn" onClick={() => setShowModal(false)}><FiX /></button>
            </div>
            <form className="modal__form" onSubmit={handleSubmit}>
              <div className="modal__form-grid">
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Product Name *</label>
                  <input name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Price (₹) *</label>
                  <input name="price" type="number" className="form-input" value={form.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Original Price (₹)</label>
                  <input name="original_price" type="number" className="form-input" value={form.original_price} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Stock *</label>
                  <input name="stock" type="number" className="form-input" value={form.stock} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select name="category_id" className="form-input" value={form.category_id} onChange={handleChange}>
                    <option value="">Select category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Image URL</label>
                  <input name="image" className="form-input" value={form.image} onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Description</label>
                  <textarea name="description" className="form-input" rows={3} value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                    <span className="form-label" style={{ margin: 0 }}>Featured Product</span>
                  </label>
                </div>
              </div>
              <div className="modal__actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : editingId ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
