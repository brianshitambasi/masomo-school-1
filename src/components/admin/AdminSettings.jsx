import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminSettings = () => {
  // ✅ Only import what's actually used
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General Settings
    schoolName: 'Masomo School',
    schoolEmail: 'info@masomoschool.com',
    schoolPhone: '+254 700 123 456',
    schoolAddress: 'Nairobi, Kenya',
    schoolWebsite: 'www.masomoschool.com',

    // Security Settings
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',

    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,

    // System Settings
    maintenanceMode: false,
    allowRegistration: true,
    sessionTimeout: '3600'
  });

  const [activeTab, setActiveTab] = useState('general');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Load settings from localStorage or API
  useEffect(() => {
    const savedSettings = localStorage.getItem('schoolSettings');
    if (savedSettings) {
      try {
        setSettings(prev => ({
          ...prev,
          ...JSON.parse(savedSettings)
        }));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleGeneralSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem('schoolSettings', JSON.stringify({
        schoolName: settings.schoolName,
        schoolEmail: settings.schoolEmail,
        schoolPhone: settings.schoolPhone,
        schoolAddress: settings.schoolAddress,
        schoolWebsite: settings.schoolWebsite
      }));
      
      toast.success('General settings updated successfully');
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error('Failed to update general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    if (settings.newPassword && settings.newPassword !== settings.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (settings.newPassword && settings.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        currentPassword: settings.currentPassword,
        newPassword: settings.newPassword
      };

      const res = await axios.put(
        `${API_URL}/user/change-password`,
        updateData,
        authHeader
      );

      toast.success(res.data?.message || 'Password changed successfully');
      setSettings({
        ...settings,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('notificationSettings', JSON.stringify({
      emailNotifications: settings.emailNotifications,
      smsNotifications: settings.smsNotifications,
      pushNotifications: settings.pushNotifications
    }));
    toast.success('Notification preferences updated');
  };

  const handleSystemSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('systemSettings', JSON.stringify({
      maintenanceMode: settings.maintenanceMode,
      allowRegistration: settings.allowRegistration,
      sessionTimeout: settings.sessionTimeout
    }));
    toast.success('System settings updated');
  };

  const clearCache = () => {
    if (window.confirm('This will clear all cached data. Continue?')) {
      localStorage.clear();
      toast.success('Cache cleared successfully');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const handleLogoutAll = async () => {
    if (window.confirm('This will log out all users. Are you sure?')) {
      try {
        await axios.post(`${API_URL}/user/logout-all`, {}, authHeader);
        toast.success('All users logged out');
      } catch (error) {
        console.error('Error logging out all users:', error);
        toast.error('Failed to log out all users');
      }
    }
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active" aria-current="page">
            / Settings
          </li>
        </ol>
      </nav>

      <div className="row">
        {/* Sidebar - Settings Tabs */}
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <h6 className="text-muted text-uppercase fw-bold small mb-3">Settings</h6>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'general' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setActiveTab('general')}
                >
                  <i className="bi bi-gear me-2"></i>
                  General
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'security' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  <i className="bi bi-shield-lock me-2"></i>
                  Security
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'notifications' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  <i className="bi bi-bell me-2"></i>
                  Notifications
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center ${activeTab === 'system' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setActiveTab('system')}
                >
                  <i className="bi bi-server me-2"></i>
                  System
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex align-items-center text-danger ${activeTab === 'danger' ? 'active bg-danger text-white' : ''}`}
                  onClick={() => setActiveTab('danger')}
                >
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Danger Zone
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              {/* General Settings */}
              {activeTab === 'general' && (
                <form onSubmit={handleGeneralSubmit}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-gear text-success me-2"></i>
                    General Settings
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">School Name</label>
                      <input
                        type="text"
                        className="form-control"
                        name="schoolName"
                        value={settings.schoolName}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">School Email</label>
                      <input
                        type="email"
                        className="form-control"
                        name="schoolEmail"
                        value={settings.schoolEmail}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">School Phone</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="schoolPhone"
                        value={settings.schoolPhone}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">School Website</label>
                      <input
                        type="text"
                        className="form-control"
                        name="schoolWebsite"
                        value={settings.schoolWebsite}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">School Address</label>
                      <input
                        type="text"
                        className="form-control"
                        name="schoolAddress"
                        value={settings.schoolAddress}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Saving...' : 'Save General Settings'}
                  </button>
                </form>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <form onSubmit={handleSecuritySubmit}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-shield-lock text-success me-2"></i>
                    Security Settings
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Current Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="currentPassword"
                        placeholder="Enter current password"
                        value={settings.currentPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">New Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={settings.newPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label className="form-label fw-semibold">Confirm Password</label>
                      <input
                        type="password"
                        className="form-control"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={settings.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success" disabled={loading}>
                    {loading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              )}

              {/* Notification Settings */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleNotificationSubmit}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-bell text-success me-2"></i>
                    Notification Preferences
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="emailNotifications"
                          checked={settings.emailNotifications}
                          onChange={handleChange}
                          id="emailNotifications"
                        />
                        <label className="form-check-label fw-semibold" htmlFor="emailNotifications">
                          Email Notifications
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="smsNotifications"
                          checked={settings.smsNotifications}
                          onChange={handleChange}
                          id="smsNotifications"
                        />
                        <label className="form-check-label fw-semibold" htmlFor="smsNotifications">
                          SMS Notifications
                        </label>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="pushNotifications"
                          checked={settings.pushNotifications}
                          onChange={handleChange}
                          id="pushNotifications"
                        />
                        <label className="form-check-label fw-semibold" htmlFor="pushNotifications">
                          Push Notifications
                        </label>
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">Save Preferences</button>
                </form>
              )}

              {/* System Settings */}
              {activeTab === 'system' && (
                <form onSubmit={handleSystemSubmit}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-server text-success me-2"></i>
                    System Settings
                  </h5>
                  <hr />
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="maintenanceMode"
                          checked={settings.maintenanceMode}
                          onChange={handleChange}
                          id="maintenanceMode"
                        />
                        <label className="form-check-label fw-semibold" htmlFor="maintenanceMode">
                          Maintenance Mode
                        </label>
                        <div className="text-muted small">When enabled, only admins can access the system</div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="allowRegistration"
                          checked={settings.allowRegistration}
                          onChange={handleChange}
                          id="allowRegistration"
                        />
                        <label className="form-check-label fw-semibold" htmlFor="allowRegistration">
                          Allow Registration
                        </label>
                        <div className="text-muted small">Allow new users to register</div>
                      </div>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Session Timeout (seconds)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="sessionTimeout"
                        value={settings.sessionTimeout}
                        onChange={handleChange}
                        disabled={loading}
                      />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-success">Save System Settings</button>
                </form>
              )}

              {/* Danger Zone */}
              {activeTab === 'danger' && (
                <div>
                  <h5 className="fw-bold mb-3 text-danger">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Danger Zone
                  </h5>
                  <hr />
                  <div className="bg-light p-4 rounded">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="card border-danger">
                          <div className="card-body">
                            <h6 className="text-danger fw-bold">Clear Cache</h6>
                            <p className="small text-muted">Clear all cached data from the system</p>
                            <button className="btn btn-outline-danger btn-sm" onClick={clearCache}>
                              <i className="bi bi-trash me-2"></i>Clear Cache
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card border-danger">
                          <div className="card-body">
                            <h6 className="text-danger fw-bold">Logout All Users</h6>
                            <p className="small text-muted">Force logout all active users from the system</p>
                            <button className="btn btn-outline-danger btn-sm" onClick={handleLogoutAll}>
                              <i className="bi bi-box-arrow-right me-2"></i>Logout All
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card border-danger">
                          <div className="card-body">
                            <h6 className="text-danger fw-bold">Delete Account</h6>
                            <p className="small text-muted">Permanently delete your admin account. This action cannot be undone.</p>
                            <button className="btn btn-danger btn-sm" onClick={() => {
                              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone!')) {
                                toast.warning('Account deletion feature coming soon');
                              }
                            }}>
                              <i className="bi bi-person-x me-2"></i>Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
