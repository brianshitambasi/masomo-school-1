import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const TeacherMessages = () => {
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState('inbox');

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const endpoint = filter === 'sent' ? 'sent' : 'inbox';
      const res = await axios.get(`${API_URL}/message/${endpoint}`, authHeader);
      setMessages(res.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`${API_URL}/message/${messageId}/read`, {}, authHeader);
      setMessages(messages.map(msg => 
        msg._id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    if (!window.confirm('Delete this message?')) return;
    try {
      await axios.delete(`${API_URL}/message/${messageId}`, authHeader);
      toast.success('Message deleted');
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-danger',
      medium: 'bg-warning text-dark',
      low: 'bg-info text-dark'
    };
    return colors[priority] || 'bg-secondary';
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 30) return `${diffDay}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Messages</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <h6 className="text-muted text-uppercase fw-bold small mb-3">Filters</h6>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'inbox' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('inbox')}
                >
                  Inbox
                  <span className="badge bg-danger rounded-pill">{unreadCount}</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'sent' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('sent')}
                >
                  Sent
                  <span className="badge bg-secondary rounded-pill">{messages.length}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted">No messages found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {messages.map((message) => (
                    <div 
                      key={message._id}
                      className={`list-group-item list-group-item-action ${!message.isRead ? 'bg-light' : ''}`}
                      onClick={() => {
                        if (!message.isRead) markAsRead(message._id);
                        setSelectedMessage(message);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-start">
                        <div className="me-3">
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${getPriorityColor(message.priority)}`}
                               style={{ width: '40px', height: '40px', color: 'white', fontSize: '14px' }}>
                            {getInitials(message.sender?.name || 'System')}
                          </div>
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-0 fw-semibold">
                                {message.subject}
                                {!message.isRead && (
                                  <span className="badge bg-primary ms-2">New</span>
                                )}
                                <span className={`badge ms-2 ${getPriorityColor(message.priority)}`}>
                                  {message.priority}
                                </span>
                              </h6>
                              <small className="text-muted">
                                From: {message.sender?.name || 'Unknown'} • {message.sender?.role || 'Unknown'}
                              </small>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">{getTimeAgo(message.createdAt)}</small>
                              <button
                                className="btn btn-sm btn-outline-danger mt-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMessage(message._id);
                                }}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </div>
                          <p className="mb-0 small text-muted mt-1">
                            {message.message?.length > 150 ? `${message.message.substring(0, 150)}...` : message.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherMessages;
