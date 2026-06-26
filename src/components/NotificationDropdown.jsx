import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_URL } from '../config';

const NotificationDropdown = () => {
  const { token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: Wrap authHeader in useMemo to prevent recreation on every render
  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  // Wrap fetchNotifications in useCallback
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/notification?limit=10`, authHeader);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  // Wrap fetchUnreadCount in useCallback
  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/notification/count`, authHeader);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [authHeader]);

  useEffect(() => {
    if (token) {
      fetchNotifications();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [token, fetchNotifications, fetchUnreadCount]);

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`${API_URL}/notification/${notificationId}/read`, {}, authHeader);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, isRead: true } : n
      ));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${API_URL}/notification/read-all`, {}, authHeader);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  const getIconForType = (type) => {
    const icons = {
      info: 'bi-info-circle text-info',
      success: 'bi-check-circle text-success',
      warning: 'bi-exclamation-triangle text-warning',
      error: 'bi-x-circle text-danger',
      assignment: 'bi-journal-bookmark text-primary',
      attendance: 'bi-calendar-check text-success',
      fee: 'bi-coin text-warning',
      exam: 'bi-clipboard-data text-danger'
    };
    return icons[type] || icons.info;
  };

  return (
    <div className="position-relative">
      <button
        className="btn btn-light btn-sm position-relative"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          borderRadius: '8px',
          padding: '6px 10px',
          background: '#f8f9fa',
          border: '1px solid #e9ecef'
        }}
      >
        <i className="bi bi-bell" style={{ fontSize: '18px' }}></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                style={{ fontSize: '9px', padding: '2px 6px' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 999 }}
            onClick={() => setIsOpen(false)}
          />
          
          <div 
            className="position-absolute end-0 mt-2 shadow-lg rounded" 
            style={{ 
              width: '380px', 
              background: 'white', 
              zIndex: 1000,
              top: '100%',
              right: 0,
              borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              maxHeight: '500px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h6 className="mb-0 fw-bold">
                <i className="bi bi-bell me-2 text-success"></i>
                Notifications
              </h6>
              <div>
                {unreadCount > 0 && (
                  <button
                    className="btn btn-link btn-sm text-decoration-none text-muted"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </button>
                )}
                <button
                  className="btn btn-link btn-sm text-decoration-none text-muted ms-2"
                  onClick={() => setIsOpen(false)}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
            </div>

            <div className="overflow-auto" style={{ maxHeight: '350px' }}>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-success spinner-border-sm" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted mb-0">No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`dropdown-item px-3 py-2 border-bottom ${!notification.isRead ? 'bg-light' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      if (!notification.isRead) {
                        markAsRead(notification._id);
                      }
                      if (notification.link) {
                        window.location.href = notification.link;
                      }
                    }}
                  >
                    <div className="d-flex align-items-start">
                      <div className="me-2">
                        <i className={getIconForType(notification.type)}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-start">
                          <p className="mb-0 small fw-semibold">
                            {notification.title}
                          </p>
                          {!notification.isRead && (
                            <span className="badge bg-primary rounded-pill" style={{ fontSize: '8px' }}>
                              New
                            </span>
                          )}
                        </div>
                        <p className="mb-0 small text-muted">{notification.message}</p>
                        <small className="text-muted" style={{ fontSize: '10px' }}>
                          {new Date(notification.createdAt).toLocaleDateString()} {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </small>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 text-center border-top">
              <Link to="/admin-dashboard/notifications" className="small text-success text-decoration-none">
                View all notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
