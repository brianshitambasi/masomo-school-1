import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const ParentAssignments = () => {
  const { token, user } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  // ✅ FIXED: fetchData wrapped in useCallback
  const fetchData = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setLoading(true);
    try {
      // Fetch all students
      const studentsRes = await axios.get(`${API_URL}/student`, authHeader);
      const allStudents = studentsRes.data || [];
      
      // Filter by parent ID
      const parentChildren = allStudents.filter(s => s.parent?._id === user?.id || s.parent === user?.id);
      setChildren(parentChildren);

      // Fetch all assignments
      const assignmentsRes = await axios.get(`${API_URL}/assignment`, authHeader);
      setAssignments(assignmentsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  // ✅ FIXED: Added fetchData as dependency
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter assignments
  const getFilteredAssignments = () => {
    let filtered = assignments;

    // Filter by child
    if (selectedChild) {
      const child = children.find(c => c._id === selectedChild);
      if (child && child.classroom) {
        filtered = filtered.filter(a => a.classroom?._id === child.classroom);
      }
    }

    // Filter by status
    if (filter === 'pending') {
      filtered = filtered.filter(a => new Date(a.dueDate) > new Date());
    } else if (filter === 'completed') {
      filtered = filtered.filter(a => new Date(a.dueDate) < new Date());
    }

    return filtered;
  };

  const filteredAssignments = getFilteredAssignments();

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

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/parent-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Assignments</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold">
            <i className="bi bi-journal-bookmark-fill text-warning me-2"></i>
            Assignments
            {!loading && assignments.length > 0 && (
              <span className="badge bg-primary ms-2">{assignments.length}</span>
            )}
          </h5>
          <div className="d-flex gap-2">
            <select
              className="form-select form-select-sm"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="">All Children</option>
              {children.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
            <select
              className="form-select form-select-sm"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="all">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading assignments...</p>
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No assignments found.
            {selectedChild && ' Try selecting a different child or clear the filter.'}
          </div>
        ) : (
          <div className="row g-4">
            {filteredAssignments.map((assignment) => (
              <div className="col-md-6" key={assignment._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start">
                      <h5 className="card-title text-primary">
                        {assignment.title}
                      </h5>
                      {getStatusBadge(assignment.dueDate)}
                    </div>
                    <p className="card-text text-muted small mt-2">
                      {assignment.description}
                    </p>
                    <div className="mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <small className="text-muted">
                            <i className="bi bi-calendar me-1"></i>
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </small>
                          <br />
                          <small className="text-muted">
                            <i className="bi bi-building me-1"></i>
                            Class: {assignment.classroom?.name || 'N/A'}
                          </small>
                          <br />
                          <small className="text-muted">
                            <i className="bi bi-person me-1"></i>
                            Teacher: {assignment.postedBy?.name || 'N/A'}
                          </small>
                        </div>
                        <div className="text-end">
                          <span className={`badge ${new Date(assignment.dueDate) > new Date() ? 'bg-warning' : 'bg-secondary'}`}>
                            {new Date(assignment.dueDate) > new Date() ? 'Active' : 'Past'}
                          </span>
                        </div>
                      </div>
                    </div>
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

export default ParentAssignments;
