import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminMessages = () => {
  const { token, user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  const [filter, setFilter] = useState('inbox');
  const [formData, setFormData] = useState({
    recipientType: 'all',
    recipientIds: [],
    subject: '',
    message: '',
    priority: 'medium'
  });
  const [recipients, setRecipients] = useState({
    teachers: [],
    parents: [],
    students: []
  });

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Fetch messages
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

  // Fetch recipients for compose
  const fetchRecipients = useCallback(async () => {
    try {
      const [teachersRes, parentsRes, studentsRes] = await Promise.all([
        axios.get(`${API_URL}/teacher`, authHeader),
        axios.get(`${API_URL}/parent`, authHeader),
        axios.get(`${API_URL}/student`, authHeader)
      ]);
      
      setRecipients({
        teachers: teachersRes.data || [],
        parents: parentsRes.data || [],
        students: studentsRes.data || []
      });
    } catch (error) {
      console.error('Error fetching recipients:', error);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchRecipients();
  }, [fetchMessages, fetchRecipients]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleRecipientChange = (e) => {
    const options = e.target.options;
    const selectedIds = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedIds.push(options[i].value);
      }
    }
    setFormData({
      ...formData,
      recipientIds: selectedIds
    });
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.message) {
      toast.error('Please fill in subject and message');
      return;
    }

    setSending(true);
    try {
      const payload = {
        ...formData,
        recipientType: formData.recipientType === 'specific' ? 'specific' : formData.recipientType
      };

      const res = await axios.post(`${API_URL}/message`, payload, authHeader);
      
      toast.success(res.data.message || 'Message sent successfully');
      setFormData({
        recipientType: 'all',
        recipientIds: [],
        subject: '',
        message: '',
        priority: 'medium'
      });
      setShowCompose(false);
      fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

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
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Messages</li>
        </ol>
      </nav>

      <div className="row">
        {/* Sidebar Filters */}
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

              <hr />
              <button 
                className="btn btn-success w-100"
                onClick={() => setShowCompose(!showCompose)}
              >
                <i className={`bi ${showCompose ? 'bi-x-lg' : 'bi-plus-circle'} me-2`}></i>
                {showCompose ? 'Close' : 'New Message'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          {/* Compose Message */}
          {showCompose && (
            <div className="card border-success mb-4 shadow-sm">
              <div className="card-header bg-success text-white">
                <h6 className="mb-0 fw-bold">
                  <i className="bi bi-pencil-square me-2"></i>
                  Compose Message
                </h6>
              </div>
              <div className="card-body">
                <form onSubmit={handleSend}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Send To</label>
                    <select
                      className="form-control"
                      name="recipientType"
                      value={formData.recipientType}
                      onChange={handleChange}
                      required
                      disabled={sending}
                    >
                      <option value="all">All Users</option>
                      <option value="teachers">Teachers Only</option>
                      <option value="parents">Parents Only</option>
                      <option value="students">Students Only</option>
                      <option value="admin">Admin Only</option>
                      <option value="specific">Specific Users</option>
                    </select>
                  </div>

                  {formData.recipientType === 'specific' && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Select Recipients</label>
                      <select
                        className="form-control"
                        multiple
                        value={formData.recipientIds}
                        onChange={handleRecipientChange}
                        disabled={sending}
                        style={{ height: '100px' }}
                      >
                        {recipients.teachers.map(t => (
                          <option key={t._id} value={t._id}>ÔøΩÔøΩ‚ÄçÌø´ {t.name} - Teacher</option>
                        ))}
                        {recipients.parents.map(p => (
                          <option key={p._id} value={p._id}>Ì±®‚ÄçÌ±©‚ÄçÌ±ß {p.name} - Parent</option>
                        ))}
                        {recipients.students.map(s => (
                          <option key={s._id} value={s._id}>Ì±®‚ÄçÌæì {s.name} - Student</option>
                        ))}
                      </select>
                      <small className="text-muted">Hold Ctrl/Cmd to select multiple</small>
                    </div>
                  )}

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
                      rows="5"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                      disabled={sending}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Priority</label>
                    <select
                      className="form-control"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      disabled={sending}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div className="d-flex gap-2">
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
                      className="btn btn-secondary"
                      onClick={() => setShowCompose(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Messages List */}
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
                                From: {message.sender?.name || 'Unknown'} ‚Ä¢ {message.sender?.role || 'Unknown'}
                              </small>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">{getTimeAgo(message.createdAt)}</small>
                              <div className="mt-1">
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteMessage(message._id);
                                  }}
                                >
                                  <i className="bi bi-trash"></i>
                                </button>
                              </div>
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

export default AdminMessages;
