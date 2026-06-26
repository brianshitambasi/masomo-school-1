import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminNotifications = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ✅ FIXED: Wrap authHeader in useMemo to prevent recreation on every render
  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  // Wrap fetchNotifications in useCallback
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/notification?limit=50`, authHeader);
      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${API_URL}/notification/${id}/read`, {}, authHeader);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, isRead: true } : n
      ));
      toast.success('Marked as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Failed to mark as read');
    }
  };

  const deleteNotification = async (id) => {
    if (!window.confirm('Delete this notification?')) return;
    try {
      await axios.delete(`${API_URL}/notification/${id}`, authHeader);
      setNotifications(notifications.filter(n => n._id !== id));
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  const getTypeBadge = (type) => {
    const badges = {
      info: 'bg-info',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-danger',
      assignment: 'bg-primary',
      attendance: 'bg-success',
      fee: 'bg-warning',
      exam: 'bg-danger'
    };
    return badges[type] || 'bg-secondary';
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.isRead;
    if (filter === 'read') return n.isRead;
    return true;
  });

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active" aria-current="page">
            / Notifications
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-bell me-2"></i>
            Notifications
          </h5>
          <div>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setFilter('all')}>
              All
            </button>
            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => setFilter('unread')}>
              Unread
            </button>
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setFilter('read')}>
              Read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-4">
            <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
            <p className="text-muted">No notifications</p>
          </div>
        ) : (
          <div className="list-group">
            {filteredNotifications.map((notification) => (
              <div
                key={notification._id}
                className={`list-group-item list-group-item-action ${!notification.isRead ? 'bg-light' : ''}`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1">
                    <div className="d-flex align-items-center mb-1">
                      <span className={`badge ${getTypeBadge(notification.type)} me-2`}>
                        {notification.type || 'info'}
                      </span>
                      <h6 className="mb-0">{notification.title}</h6>
                      {!notification.isRead && (
                        <span className="badge bg-primary ms-2">New</span>
                      )}
                    </div>
                    <p className="mb-1">{notification.message}</p>
                    <small className="text-muted">
                      {new Date(notification.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <div className="ms-3">
                    {!notification.isRead && (
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => markAsRead(notification._id)}
                      >
                        <i className="bi bi-check2"></i>
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => deleteNotification(notification._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNotifications;
