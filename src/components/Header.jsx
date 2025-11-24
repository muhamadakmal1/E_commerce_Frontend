import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';

export const Header = () => {
  const { getTotalItems } = useCart();
  const { user, logout } = useAuth();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>MINIMAL</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Shop</Link>
          <Link to="/cart" className="nav-link cart-link">
            Cart
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
          <button 
            className="dark-mode-toggle" 
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          <div className="auth-actions">
            {user ? (
              <>
                <Link to="/profile" className="nav-link">Profile</Link>
                <button type="button" className="logout-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/signup" className="nav-link nav-link-primary">Sign up</Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
