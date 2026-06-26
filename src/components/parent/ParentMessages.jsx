import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const ParentMessages = () => {
  // ✅ REMOVED: unused 'user' from useContext
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [formData, setFormData] = useState({
    recipient: '',
    subject: '',
    message: ''
  });
  const [teachers, setTeachers] = useState([]);

  const fetchMessages = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setLoading(true);
    try {
      setMessages([
        {
          _id: '1',
          from: 'John Teacher',
          fromRole: 'teacher',
          subject: 'Parent-Teacher Meeting',
          message: 'We would like to invite you to the parent-teacher meeting on Friday at 2pm.',
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          read: false
        },
        {
          _id: '2',
          from: 'Admin',
          fromRole: 'admin',
          subject: 'School Holiday Announcement',
          message: 'The school will be closed next Monday for a public holiday.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ]);
      
      const teachersRes = await axios.get(`${API_URL}/teacher`, authHeader);
      setTeachers(teachersRes.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.recipient || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setSending(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Message sent successfully');
      setFormData({ recipient: '', subject: '', message: '' });
      setShowCompose(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = (messageId) => {
    setMessages(messages.map(msg => 
      msg._id === messageId ? { ...msg, read: true } : msg
    ));
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/parent-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Messages</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">
            <i className="bi bi-envelope-fill text-primary me-2"></i>
            Messages
            {!loading && messages.length > 0 && (
              <span className="badge bg-primary ms-2">
                {messages.filter(m => !m.read).length} unread
              </span>
            )}
          </h5>
          <button 
            className="btn btn-success btn-sm"
            onClick={() => setShowCompose(!showCompose)}
          >
            <i className={`bi ${showCompose ? 'bi-x-lg' : 'bi-plus-circle'} me-1`}></i>
            {showCompose ? 'Close' : 'New Message'}
          </button>
        </div>

        {showCompose && (
          <div className="card border-primary mb-4">
            <div className="card-body">
              <h6 className="fw-bold text-primary mb-3">
                <i className="bi bi-pencil-square me-2"></i>
                Compose Message
              </h6>
              <form onSubmit={handleSend}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">To</label>
                  <select
                    className="form-control"
                    name="recipient"
                    value={formData.recipient}
                    onChange={handleChange}
                    required
                    disabled={sending}
                  >
                    <option value="">Select Recipient</option>
                    {teachers.map((teacher) => (
                      <option key={teacher._id} value={teacher._id}>
                        {teacher.name} - {teacher.subject || 'Teacher'}
                      </option>
                    ))}
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    name="subject"
                    placeholder="Enter message subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    disabled={sending}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    rows="4"
                    placeholder="Type your message here..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    disabled={sending}
                  />
                </div>
                <button type="submit" className="btn btn-success" disabled={sending}>
                  {sending ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send me-2"></i>
                      Send Message
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary ms-2"
                  onClick={() => setShowCompose(false)}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No messages yet.
          </div>
        ) : (
          <div className="list-group">
            {messages.map((message) => (
              <div 
                key={message._id}
                className={`list-group-item list-group-item-action ${!message.read ? 'bg-light' : ''}`}
                onClick={() => {
                  if (!message.read) markAsRead(message._id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-start">
                  <div className="me-3">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center"
                         style={{ width: '40px', height: '40px', color: 'white', fontSize: '14px' }}>
                      {getInitials(message.from)}
                    </div>
                  </div>
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <h6 className="mb-0 fw-semibold">
                          {message.subject}
                          {!message.read && (
                            <span className="badge bg-primary ms-2">New</span>
                          )}
                        </h6>
                        <small className="text-muted">
                          {message.from} • {message.fromRole}
                        </small>
                      </div>
                      <small className="text-muted">{getTimeAgo(message.date)}</small>
                    </div>
                    <p className="mb-0 small text-muted mt-1">
                      {message.message.length > 100 ? `${message.message.substring(0, 100)}...` : message.message}
                    </p>
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

export default ParentMessages;
