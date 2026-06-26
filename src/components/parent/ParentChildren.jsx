import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const ParentChildren = () => {
  const { token, user } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/student`, authHeader);
      const allStudents = res.data || [];
      
      // Filter by parent ID
      const parentChildren = allStudents.filter(s => s.parent?._id === user?.id || s.parent === user?.id);
      setChildren(parentChildren);
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/parent-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ My Children</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-people-fill text-primary me-2"></i>
          My Children
          {!loading && children.length > 0 && (
            <span className="badge bg-primary ms-2">{children.length}</span>
          )}
        </h5>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-2">Loading children...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No children registered yet.
          </div>
        ) : (
          <div className="row g-4">
            {children.map((child) => (
              <div className="col-md-4" key={child._id}>
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body text-center">
                    {child.photo ? (
                      <img
                        src={`${API_URL}/${child.photo}`}
                        alt={child.name}
                        className="rounded-circle mb-3"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-3"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <i className="bi bi-person-fill text-success" style={{ fontSize: '35px' }}></i>
                      </div>
                    )}
                    <h5 className="fw-bold">{child.name}</h5>
                    <p className="text-muted small">
                      <i className="bi bi-mortarboard me-2"></i>
                      {child.classroom?.name || 'No Class'}
                    </p>
                    <p className="text-muted small">
                      <i className="bi bi-hash me-2"></i>
                      Adm: {child.admissionNumber}
                    </p>
                    <p className="text-muted small">
                      <i className="bi bi-gender-ambiguous me-2"></i>
                      {child.gender || 'N/A'}
                    </p>
                    <div className="d-flex justify-content-center gap-2 mt-2">
                      <Link 
                        to={`/parent-dashboard/children/${child._id}`} 
                        className="btn btn-sm btn-success"
                      >
                        <i className="bi bi-eye me-1"></i>
                        View Details
                      </Link>
                      <Link 
                        to={`/parent-dashboard/assignments?student=${child._id}`} 
                        className="btn btn-sm btn-outline-primary"
                      >
                        <i className="bi bi-journal-bookmark me-1"></i>
                        Assignments
                      </Link>
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

export default ParentChildren;
