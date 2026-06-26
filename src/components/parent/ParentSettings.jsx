import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ParentSettings = () => {
  // ✅ REMOVED: unused token
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: 'en',
    timezone: 'Africa/Nairobi'
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      localStorage.setItem('parentSettings', JSON.stringify(settings));
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const savedSettings = localStorage.getItem('parentSettings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (e) {
        console.error('Error loading settings:', e);
      }
    }
  }, []);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/parent-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Settings</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-gear-fill text-secondary me-2"></i>
          Settings
        </h5>

        <form onSubmit={handleSubmit}>
          <h6 className="fw-bold mt-3">Notification Preferences</h6>
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
                <div className="text-muted small">Receive updates via email</div>
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
                <div className="text-muted small">Receive updates via SMS</div>
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
                <div className="text-muted small">Receive push notifications</div>
              </div>
            </div>
          </div>

          <h6 className="fw-bold mt-4">Preferences</h6>
          <hr />
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Language</label>
              <select
                className="form-control"
                name="language"
                value={settings.language}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="en">English</option>
                <option value="sw">Swahili</option>
                <option value="fr">French</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Timezone</label>
              <select
                className="form-control"
                name="timezone"
                value={settings.timezone}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                <option value="Africa/Lagos">West Africa Time (WAT)</option>
                <option value="Africa/Johannesburg">South Africa Standard Time</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn btn-success mt-3" disabled={loading}>
            {loading ? 'Saving...' : <><i className="bi bi-save me-2"></i>Save Settings</>}
          </button>
        </form>

        <hr className="mt-4" />
        <div className="bg-light p-3 rounded">
          <h6 className="text-danger fw-bold">Danger Zone</h6>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <p className="mb-0">Clear all app data</p>
              <small className="text-muted">This will reset all your preferences</small>
            </div>
            <button 
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                if (window.confirm('Clear all saved data?')) {
                  localStorage.removeItem('parentSettings');
                  toast.success('Data cleared');
                  window.location.reload();
                }
              }}
            >
              <i className="bi bi-trash me-1"></i>
              Clear Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentSettings;
