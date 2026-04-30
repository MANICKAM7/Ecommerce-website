import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiFilter, FiX, FiChevronDown, FiSearch, FiGrid, FiList } from 'react-icons/fi';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import './Products.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const featured = searchParams.get('featured') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (search) params.set('search', search);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      if (featured) params.set('featured', featured);
      params.set('page', page);
      params.set('limit', 12);

      const { data } = await api.get(`/products?${params}`);
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [category, search, sort, minPrice, maxPrice, featured, page]);

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const updateParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const applyPriceFilter = () => {
    const p = new URLSearchParams(searchParams);
    if (localMin) p.set('minPrice', localMin); else p.delete('minPrice');
    if (localMax) p.set('maxPrice', localMax); else p.delete('maxPrice');
    p.delete('page');
    setSearchParams(p);
  };

  const clearFilters = () => {
    setLocalMin(''); setLocalMax('');
    setSearchParams({});
  };

  const hasFilters = category || search || minPrice || maxPrice || featured;

  return (
    <div className="products-page page-enter">
      <div className="container">
        {/* Header */}
        <div className="products-page__header">
          <div>
            <h1 className="products-page__title">
              {search ? `Results for "${search}"` : featured ? '⭐ Featured Products' : category ? categories.find(c => c.slug === category)?.name || 'Products' : 'All Products'}
            </h1>
            <p className="products-page__count">
              {loading ? 'Loading...' : `${pagination.total.toLocaleString()} products found`}
            </p>
          </div>
          <div className="products-page__controls">
            <button className="btn btn-secondary btn-sm" onClick={() => setFilterOpen(!filterOpen)}>
              <FiFilter size={14} /> Filters {hasFilters && <span className="filter-badge" />}
            </button>
            <select
              className="form-input"
              style={{ fontSize: '13px', padding: '8px 12px' }}
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="products-page__layout">
          {/* Sidebar Filters */}
          <aside className={`products-sidebar ${filterOpen ? 'products-sidebar--open' : ''}`}>
            <div className="products-sidebar__header">
              <h3>Filters</h3>
              {hasFilters && (
                <button className="btn btn-ghost btn-sm" onClick={clearFilters}>
                  <FiX size={13} /> Clear All
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="filter-group">
              <h4 className="filter-group__title">Category</h4>
              <div className="filter-group__list">
                <label className="filter-option">
                  <input type="radio" name="category" checked={!category} onChange={() => updateParam('category', '')} />
                  <span>All Categories</span>
                </label>
                {categories.map(cat => (
                  <label className="filter-option" key={cat.id}>
                    <input type="radio" name="category" checked={category === cat.slug} onChange={() => updateParam('category', cat.slug)} />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="filter-group">
              <h4 className="filter-group__title">Price Range</h4>
              <div className="filter-price-inputs">
                <input
                  type="number"
                  className="form-input"
                  placeholder="Min ₹"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  style={{ fontSize: '13px', padding: '8px 10px' }}
                />
                <input
                  type="number"
                  className="form-input"
                  placeholder="Max ₹"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  style={{ fontSize: '13px', padding: '8px 10px' }}
                />
              </div>
              <button className="btn btn-primary btn-sm btn-full" onClick={applyPriceFilter}>Apply</button>
            </div>

            {/* Featured */}
            <div className="filter-group">
              <h4 className="filter-group__title">Featured</h4>
              <label className="filter-option">
                <input type="checkbox" checked={featured === 'true'} onChange={(e) => updateParam('featured', e.target.checked ? 'true' : '')} />
                <span>Featured Only</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="products-page__content">
            {loading ? (
              <div className="loading-screen"><div className="spinner" /><span>Loading products...</span></div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <div className="no-products__icon">🔍</div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms</p>
                <button className="btn btn-primary" onClick={clearFilters}>Clear filters</button>
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="pagination">
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={page === 1}
                      onClick={() => updateParam('page', page - 1)}
                    >← Prev</button>
                    <div className="pagination__pages">
                      {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                        const pg = i + 1;
                        return (
                          <button
                            key={pg}
                            className={`pagination__btn ${pg === page ? 'active' : ''}`}
                            onClick={() => updateParam('page', pg)}
                          >{pg}</button>
                        );
                      })}
                    </div>
                    <button
                      className="btn btn-secondary btn-sm"
                      disabled={page === pagination.pages}
                      onClick={() => updateParam('page', page + 1)}
                    >Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
