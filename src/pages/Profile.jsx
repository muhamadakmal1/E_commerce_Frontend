import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentUser, updateProfile, updateProfilePicture } from '../utils/api';

export const Profile = () => {
  const { user, isAuthenticated, logout, isInitializing, token, setUser } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zip: ''
    }
  });

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isInitializing, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (token) {
        try {
          const data = await getCurrentUser(token);
          setProfileData(data);
          // Initialize form data
          const userData = data.user || user;
          setFormData({
            name: userData.name || '',
            phone: userData.phone || '',
            address: {
              street: userData.address?.street || '',
              city: userData.address?.city || '',
              state: userData.address?.state || '',
              zip: userData.address?.zip || ''
            }
          });
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (user && token) {
      fetchProfileData();
    }
  }, [user, token]);

  if (isInitializing || loading) {
    return (
      <div className="profile">
        <div className="container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Reset form data
    const userData = profileData?.user || user;
    setFormData({
      name: userData.name || '',
      phone: userData.phone || '',
      address: {
        street: userData.address?.street || '',
        city: userData.address?.city || '',
        state: userData.address?.state || '',
        zip: userData.address?.zip || ''
      }
    });
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await updateProfile(formData);
      setProfileData(prev => ({ ...prev, user: response.user }));
      setUser(response.user);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await updateProfilePicture(reader.result);
        setProfileData(prev => ({ ...prev, user: response.user }));
        setUser(response.user);
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('Failed to upload profile picture. Please try again.');
      }
    };
    reader.readAsDataURL(file);
  };

  const userData = profileData?.user || user;
  const orderCount = profileData?.orderCount || 0;
  const totalSpent = profileData?.totalSpent || 0;
  const purchasedProducts = profileData?.purchasedProducts || [];

  return (
    <div className="profile">
      <div className="container">
        <div className="profile-header">
          <h2>My Profile</h2>
          <Link to="/" className="back-link">← Back to Shop</Link>
        </div>

        <div className="profile-content">
          {/* Profile Card */}
          <div className="profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {userData.profilePicture ? (
                  <img src={userData.profilePicture} alt={userData.name} className="avatar-image" />
                ) : (
                  userData.name?.charAt(0).toUpperCase() || 'U'
                )}
              </div>
              <label htmlFor="profile-picture-upload" className="avatar-upload-label">
                <input
                  type="file"
                  id="profile-picture-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
                <span className="avatar-upload-btn">📷 Change Picture</span>
              </label>
            </div>
            
            <div className="profile-info">
              <h3>{userData.name}</h3>
              <p className="profile-email">{userData.email}</p>
            </div>
          </div>

          {/* Order Statistics */}
          <div className="profile-stats">
            <div className="stat-card">
              <div className="stat-value">{orderCount}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${totalSpent.toFixed(2)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{purchasedProducts.length}</div>
              <div className="stat-label">Products Purchased</div>
            </div>
          </div>

          {/* Account Details */}
          <div className="profile-details">
            <div className="profile-details-header">
              <h3>Account Details</h3>
              {!isEditing && (
                <button className="btn-edit" onClick={handleEdit}>
                  ✏️ Edit Profile
                </button>
              )}
            </div>
            
            {isEditing ? (
              <>
                <div className="detail-row">
                  <span className="detail-label">Full Name</span>
                  <input
                    type="text"
                    className="detail-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{userData.email}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Phone Number</span>
                  <input
                    type="tel"
                    className="detail-input"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{formatDate(userData.createdAt)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="detail-row">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{userData.name}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{userData.email}</span>
                </div>

                {userData.phone && (
                  <div className="detail-row">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{userData.phone}</span>
                  </div>
                )}

                <div className="detail-row">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">{formatDate(userData.createdAt)}</span>
                </div>
              </>
            )}
          </div>

          {/* Shipping Information */}
          <div className="profile-details">
            <h3>Shipping Information</h3>
            
            {isEditing ? (
              <>
                <div className="detail-row">
                  <span className="detail-label">Street Address</span>
                  <input
                    type="text"
                    className="detail-input"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value }
                    })}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">City</span>
                  <input
                    type="text"
                    className="detail-input"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value }
                    })}
                    placeholder="Enter city"
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">State</span>
                  <input
                    type="text"
                    className="detail-input"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, state: e.target.value }
                    })}
                    placeholder="Enter state"
                  />
                </div>

                <div className="detail-row">
                  <span className="detail-label">ZIP Code</span>
                  <input
                    type="text"
                    className="detail-input"
                    value={formData.address.zip}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, zip: e.target.value }
                    })}
                    placeholder="Enter ZIP code"
                  />
                </div>
              </>
            ) : (
              <>
                {userData.address?.street && (
                  <div className="detail-row">
                    <span className="detail-label">Street Address</span>
                    <span className="detail-value">{userData.address.street}</span>
                  </div>
                )}

                {userData.address?.city && (
                  <div className="detail-row">
                    <span className="detail-label">City</span>
                    <span className="detail-value">{userData.address.city}</span>
                  </div>
                )}

                {userData.address?.state && (
                  <div className="detail-row">
                    <span className="detail-label">State</span>
                    <span className="detail-value">{userData.address.state}</span>
                  </div>
                )}

                {userData.address?.zip && (
                  <div className="detail-row">
                    <span className="detail-label">ZIP Code</span>
                    <span className="detail-value">{userData.address.zip}</span>
                  </div>
                )}

                {!userData.address?.street && !userData.address?.city && (
                  <p className="no-data">No shipping information added yet.</p>
                )}
              </>
            )}
          </div>

          {/* Edit Mode Actions */}
          {isEditing && (
            <div className="profile-edit-actions">
              <button className="btn-secondary" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSave} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Purchased Products */}
          {purchasedProducts.length > 0 && (
            <div className="profile-section">
              <h3>Purchase History</h3>
              <div className="purchased-products">
                {purchasedProducts.map((product) => (
                  <Link 
                    key={product._id} 
                    to={`/product/${product._id}`} 
                    className="purchased-product-card"
                  >
                    <div className="purchased-product-image">
                      <img src={product.image} alt={product.name} />
                    </div>
                    <div className="purchased-product-info">
                      <h4>{product.name}</h4>
                      <p className="purchased-product-price">${product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="profile-actions">
              <button className="btn-secondary btn-large" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
