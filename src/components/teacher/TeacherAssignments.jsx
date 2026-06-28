import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const TeacherAssignments = () => {
  const { token } = useContext(AuthContext);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      };

      setLoading(true);
      try {
        // Fetch only teacher's own assignments
        const res = await axios.get(`${API_URL}/teacher/my-assignments`, authHeader);
        setAssignments(res.data || []);
      } catch (error) {
        console.error('Error fetching assignments:', error);
        toast.error('Failed to load assignments');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAssignments();
    }
  }, [token]);

  const deleteAssignment = async (id) => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    if (!window.confirm('Delete this assignment?')) return;
    try {
      await axios.delete(`${API_URL}/assignment/${id}`, authHeader);
      toast.success('Assignment deleted');
      
      // Refresh list
      const res = await axios.get(`${API_URL}/teacher/my-assignments`, authHeader);
      setAssignments(res.data || []);
    } catch (error) {
      console.error('Error deleting assignment:', error);
      toast.error('Failed to delete assignment');
    }
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Assignments</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-journal-bookmark-fill me-2"></i>
            My Assignments
            {!loading && (
              <span className="badge bg-success ms-2">{assignments.length}</span>
            )}
          </h5>
          <Link
            to="/teacher-dashboard/assignments/add"
            className="btn btn-success"
          >
            <i className="bi bi-plus-circle me-2"></i>
            Create Assignment
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No assignments created yet.
            <Link to="/teacher-dashboard/assignments/add" className="ms-3">
              Create your first assignment
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {assignments.map((assignment) => (
              <div className="col-md-6" key={assignment._id}>
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <h5 className="card-title text-success">{assignment.title}</h5>
                      <span className={`badge ${new Date(assignment.dueDate) > new Date() ? 'bg-warning' : 'bg-secondary'}`}>
                        {new Date(assignment.dueDate) > new Date() ? 'Active' : 'Past'}
                      </span>
                    </div>
                    <p className="card-text text-muted small">{assignment.description}</p>
                    <div className="d-flex justify-content-between align-items-center mt-3">
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
                      </div>
                      <div>
                        <Link
                          to={`/teacher-dashboard/assignments/edit/${assignment._id}`}
                          className="btn btn-sm btn-warning me-1"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteAssignment(assignment._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
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

export default TeacherAssignments;
