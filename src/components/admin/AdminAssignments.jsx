import React, { useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminAssignments = () => {
  const { token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ✅ FIXED: authHeader in useMemo
  const authHeader = useMemo(() => ({
    headers: { Authorization: `Bearer ${token}` }
  }), [token]);

  // ✅ FIXED: fetchAssignments in useCallback with authHeader dependency
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/assignment`, authHeader);
      setAssignments(res.data || []);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      toast.error('Failed to load assignments');
    } finally {
      setLoading(false);
    }
  }, [authHeader]);

  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this assignment?')) return;
    
    try {
      await axios.delete(`${API_URL}/assignment/${id}`, authHeader);
      toast.success('Assignment deleted successfully');
      fetchAssignments();
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  const getStatusBadge = (dueDate) => {
    const now = new Date();
    const due = new Date(dueDate);
    if (due < now) {
      return <span className="badge bg-danger">Overdue</span>;
    } else if (due < new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)) {
      return <span className="badge bg-warning text-dark">Due Soon</span>;
    } else {
      return <span className="badge bg-success">Active</span>;
    }
  };

  const getFilteredAssignments = () => {
    let filtered = assignments;
    if (filter === 'active') {
      filtered = filtered.filter(a => new Date(a.dueDate) > new Date());
    } else if (filter === 'overdue') {
      filtered = filtered.filter(a => new Date(a.dueDate) < new Date());
    } else if (filter === 'upcoming') {
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(a => {
        const due = new Date(a.dueDate);
        return due > now && due < nextWeek;
      });
    }
    return filtered;
  };

  const filteredAssignments = getFilteredAssignments();

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Assignments</li>
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
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'all' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('all')}
                >
                  All Assignments
                  <span className="badge bg-secondary rounded-pill">{assignments.length}</span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'active' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('active')}
                >
                  Active
                  <span className="badge bg-success rounded-pill">
                    {assignments.filter(a => new Date(a.dueDate) > new Date()).length}
                  </span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'upcoming' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('upcoming')}
                >
                  Upcoming (7 days)
                  <span className="badge bg-warning rounded-pill text-dark">
                    {assignments.filter(a => {
                      const now = new Date();
                      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                      const due = new Date(a.dueDate);
                      return due > now && due < nextWeek;
                    }).length}
                  </span>
                </button>
                <button
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${filter === 'overdue' ? 'active bg-success text-white' : ''}`}
                  onClick={() => setFilter('overdue')}
                >
                  Overdue
                  <span className="badge bg-danger rounded-pill">
                    {assignments.filter(a => new Date(a.dueDate) < new Date()).length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-lg-9">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              {/* Header with stats */}
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-journal-bookmark-fill text-warning me-2"></i>
                  Assignments
                  {!loading && (
                    <span className="badge bg-primary ms-2">{assignments.length}</span>
                  )}
                </h5>
                <div>
                  <small className="text-muted">
                    Showing {filteredAssignments.length} of {assignments.length}
                  </small>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading assignments...</p>
                </div>
              ) : filteredAssignments.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-journal-bookmark fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted">No assignments found</p>
                  {filter !== 'all' && (
                    <button
                      className="btn btn-sm btn-outline-primary mt-2"
                      onClick={() => setFilter('all')}
                    >
                      <i className="bi bi-arrow-counterclockwise me-1"></i>
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped table-hover">
                    <thead className="table-success">
                      <tr>
                        <th>#</th>
                        <th>Title</th>
                        <th>Class</th>
                        <th>Teacher</th>
                        <th>Due Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssignments.map((assignment, index) => (
                        <tr key={assignment._id}>
                          <td>{index + 1}</td>
                          <td>
                            <strong>{assignment.title}</strong>
                            <br />
                            <small className="text-muted">
                              {assignment.description?.substring(0, 50)}
                              {assignment.description?.length > 50 ? '...' : ''}
                            </small>
                          </td>
                          <td>{assignment.classroom?.name || 'N/A'}</td>
                          <td>{assignment.postedBy?.name || 'N/A'}</td>
                          <td>
                            {new Date(assignment.dueDate).toLocaleDateString()}
                            <br />
                            <small className="text-muted">
                              {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </small>
                          </td>
                          <td>{getStatusBadge(assignment.dueDate)}</td>
                          <td>
                            <Link
                              to={`/admin-dashboard/assignments/edit/${assignment._id}`}
                              className="btn btn-sm btn-warning me-1"
                              title="Edit"
                            >
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(assignment._id)}
                              title="Delete"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAssignments;
