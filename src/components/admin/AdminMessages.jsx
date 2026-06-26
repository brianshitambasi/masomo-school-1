import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminMessages = () => {
  // ✅ REMOVED: unused 'user'
  const { token } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);
  // ✅ REMOVED: unused 'selectedMessage'
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    recipientType: 'all',
    recipientIds: [],
    subject: '',
    message: '',
    priority: 'medium',
    sendEmail: false,
    sendSMS: false
  });
  const [recipients, setRecipients] = useState({
    teachers: [],
    parents: [],
    students: []
  });

  // ✅ FIXED: authHeader is now inside useCallback
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
          read: false,
          priority: 'high',
          recipientType: 'parents'
        },
        {
          _id: '2',
          from: 'Admin',
          fromRole: 'admin',
          subject: 'School Holiday Announcement',
          message: 'The school will be closed next Monday for a public holiday.',
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          read: true,
          priority: 'medium',
          recipientType: 'all'
        },
        {
          _id: '3',
          from: 'Jane Parent',
          fromRole: 'parent',
          subject: 'Question about fees',
          message: 'I would like to inquire about the school fees structure for next term.',
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          read: false,
          priority: 'low',
          recipientType: 'admin'
        }
      ]);

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
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success('Message sent successfully');
      setFormData({
        recipientType: 'all',
        recipientIds: [],
        subject: '',
        message: '',
        priority: 'medium',
        sendEmail: false,
        sendSMS: false
      });
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

  const deleteMessage = (messageId) => {
    if (window.confirm('Delete this message?')) {
      setMessages(messages.filter(msg => msg._id !== messageId));
      toast.success('Message deleted');
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

  const getRecipientLabel = (type) => {
    const labels = {
      all: 'All Users',
      teachers: 'Teachers',
      parents: 'Parents',
      students: 'Students',
      admin: 'Admin'
    };
    return labels[type] || type;
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !msg.read;
    if (filter === 'read') return msg.read;
    if (filter === 'sent') return msg.fromRole === 'admin';
    if (filter === 'received') return msg.fromRole !== 'admin';
    return true;
  });

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
        <div className="col-lg-3 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-3">
              <h6 className="text-muted text-uppercase fw-bold small mb-3">Filters</h6>
              <div className="list-group list-group-flush">
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'all' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Messages
                  <span className="badge bg-secondary rounded-pill">{messages.length}</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'unread' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('unread')}
                >
                  Unread
                  <span className="badge bg-danger rounded-pill">{messages.filter(m => !m.read).length}</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'read' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('read')}
                >
                  Read
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'sent' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('sent')}
                >
                  Sent
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'received' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('received')}
                >
                  Received
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

        <div className="col-lg-9">
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
                    </select>
                  </div>

                  {formData.recipientType !== 'all' && (
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
                        {formData.recipientType === 'teachers' && 
                          recipients.teachers.map(t => (
                            <option key={t._id} value={t._id}>{t.name} - {t.email}</option>
                          ))
                        }
                        {formData.recipientType === 'parents' && 
                          recipients.parents.map(p => (
                            <option key={p._id} value={p._id}>{p.name} - {p.email}</option>
                          ))
                        }
                        {formData.recipientType === 'students' && 
                          recipients.students.map(s => (
                            <option key={s._id} value={s._id}>{s.name} - {s.admissionNumber}</option>
                          ))
                        }
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

                  <div className="row mb-3">
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Additional Options</label>
                      <div className="mt-2">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="sendEmail"
                            checked={formData.sendEmail}
                            onChange={handleChange}
                            id="sendEmail"
                            disabled={sending}
                          />
                          <label className="form-check-label" htmlFor="sendEmail">
                            Send as Email
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            name="sendSMS"
                            checked={formData.sendSMS}
                            onChange={handleChange}
                            id="sendSMS"
                            disabled={sending}
                          />
                          <label className="form-check-label" htmlFor="sendSMS">
                            Send as SMS
                          </label>
                        </div>
                      </div>
                    </div>
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

          <div className="card border-0 shadow-sm">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading messages...</p>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted">No messages found</p>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {filteredMessages.map((message) => (
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
                          <div className={`rounded-circle d-flex align-items-center justify-content-center ${getPriorityColor(message.priority)}`}
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
                                <span className={`badge ms-2 ${getPriorityColor(message.priority)}`}>
                                  {message.priority}
                                </span>
                              </h6>
                              <small className="text-muted">
                                {message.from} • {message.fromRole} • To: {getRecipientLabel(message.recipientType)}
                              </small>
                            </div>
                            <div className="text-end">
                              <small className="text-muted d-block">{getTimeAgo(message.date)}</small>
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
                            {message.message.length > 150 ? `${message.message.substring(0, 150)}...` : message.message}
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
