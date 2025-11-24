import { useState, useEffect } from 'react';
import { ProductCard } from '../components/ProductCard';
import { getProducts } from '../utils/api';

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="home">
        <div className="hero">
          <h2>Minimal Design, Maximum Quality</h2>
          <p>Discover our curated collection of thoughtfully designed products</p>
        </div>
        <div className="products-grid">
          <p>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home">
        <div className="hero">
          <h2>Minimal Design, Maximum Quality</h2>
          <p>Discover our curated collection of thoughtfully designed products</p>
        </div>
        <div className="products-grid">
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="hero">
        <h2>Minimal Design, Maximum Quality</h2>
        <p>Discover our curated collection of thoughtfully designed products</p>
      </div>
      <div className="products-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};
