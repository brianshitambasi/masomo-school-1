import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const ParentProfile = () => {
  const { token, user, setUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      };

      if (formData.newPassword) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }

      const res = await axios.put(
        `${API_URL}/parent/profile`,
        updateData,
        authHeader
      );

      toast.success(res.data?.message || 'Profile updated successfully');
      setUser({
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address
      });
      setEditMode(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/parent-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Profile</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card p-4 text-center shadow-sm">
            <div className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3"
                 style={{ width: '100px', height: '100px', fontSize: '40px', color: 'white' }}>
              {user?.name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <h5 className="fw-bold">{user?.name || 'Parent'}</h5>
            <p className="text-muted small">{user?.email || 'parent@email.com'}</p>
            <span className="badge bg-success mx-auto">Parent</span>
            <hr />
            <button 
              className="btn btn-success w-100"
              onClick={() => setEditMode(!editMode)}
            >
              <i className={`bi ${editMode ? 'bi-x-circle' : 'bi-pencil-square'} me-2`}></i>
              {editMode ? 'Cancel Edit' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-person-fill text-success me-2"></i>
              {editMode ? 'Edit Profile' : 'Profile Information'}
            </h5>

            {!editMode ? (
              <div>
                <div className="row mb-2">
                  <div className="col-4 fw-semibold">Name:</div>
                  <div className="col-8">{user?.name || 'Not set'}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 fw-semibold">Email:</div>
                  <div className="col-8">{user?.email || 'Not set'}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 fw-semibold">Phone:</div>
                  <div className="col-8">{user?.phone || 'Not set'}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 fw-semibold">Address:</div>
                  <div className="col-8">{user?.address || 'Not set'}</div>
                </div>
                <div className="row mb-2">
                  <div className="col-4 fw-semibold">Role:</div>
                  <div className="col-8"><span className="badge bg-success">Parent</span></div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Phone</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>

                <hr />
                <h6 className="fw-bold text-warning">
                  <i className="bi bi-shield-lock me-2"></i>
                  Change Password (Optional)
                </h6>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Current Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="currentPassword"
                      placeholder="Current password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">New Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="newPassword"
                      placeholder="New password"
                      value={formData.newPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Saving...' : <><i className="bi bi-save me-2"></i>Save Changes</>}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentProfile;
