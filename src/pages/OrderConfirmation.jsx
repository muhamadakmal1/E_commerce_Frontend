import { Link } from 'react-router-dom';

export const OrderConfirmation = () => {
  return (
    <div className="order-confirmation">
      <div className="container">
        <div className="confirmation-content">
          <div className="confirmation-icon">✓</div>
          <h2>Order Confirmed!</h2>
          <p>Thank you for your purchase. Your order has been successfully placed.</p>
          <p className="confirmation-subtext">
            You will receive an email confirmation shortly with your order details.
          </p>
          <Link to="/" className="btn-primary btn-large">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

