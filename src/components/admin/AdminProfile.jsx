import React, { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminProfile = () => {
  const { token, user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
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
    setLoading(true);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

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
        `${API_URL}/user/profile`,
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
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item-active">/ Profile</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              <div className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3"
                   style={{ width: '120px', height: '120px', fontSize: '48px', color: 'white' }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <h4 className="fw-bold mb-1">{user?.name || 'Admin'}</h4>
              <p className="text-muted small">
                <i className="bi bi-shield-check text-success me-1"></i>
                {user?.role?.toUpperCase() || 'ADMIN'}
              </p>
              <p className="text-muted small">
                <i className="bi bi-envelope me-1"></i>
                {user?.email || 'admin@school.com'}
              </p>
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
        </div>

        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-person-fill me-2 text-success"></i>
                {editMode ? 'Edit Profile' : 'Profile Information'}
              </h5>
              <hr />
              
              {!editMode ? (
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Full Name</label>
                    <p className="fw-semibold mb-0">{user?.name || 'Not set'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Email</label>
                    <p className="fw-semibold mb-0">{user?.email || 'Not set'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Phone</label>
                    <p className="fw-semibold mb-0">{user?.phone || 'Not set'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Role</label>
                    <p className="fw-semibold mb-0">
                      <span className="badge bg-success">{user?.role || 'Admin'}</span>
                    </p>
                  </div>
                  <div className="col-12">
                    <label className="text-muted small fw-bold">Address</label>
                    <p className="fw-semibold mb-0">{user?.address || 'Not set'}</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Email</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Phone</label>
                      <input type="tel" className="form-control" name="phone" value={formData.phone} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Address</label>
                      <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} disabled={loading} />
                    </div>

                    <div className="col-12 mt-3">
                      <hr />
                      <h6 className="fw-bold text-warning">
                        <i className="bi bi-shield-lock me-2"></i>Change Password (Optional)
                      </h6>
                    </div>

                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Current Password</label>
                      <input type="password" className="form-control" name="currentPassword" placeholder="Enter current password" value={formData.currentPassword} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <input type="password" className="form-control" name="newPassword" placeholder="Enter new password" value={formData.newPassword} onChange={handleChange} disabled={loading} />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Confirm Password</label>
                      <input type="password" className="form-control" name="confirmPassword" placeholder="Confirm new password" value={formData.confirmPassword} onChange={handleChange} disabled={loading} />
                    </div>

                    <div className="col-12 mt-3 d-flex gap-2">
                      <button type="submit" className="btn btn-success" disabled={loading}>
                        {loading ? 'Saving...' : <><i className="bi bi-save me-2"></i>Save Changes</>}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)} disabled={loading}>
                        <i className="bi bi-x-circle me-2"></i>Cancel
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
