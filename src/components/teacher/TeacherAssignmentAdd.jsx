import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const TeacherAssignmentAdd = () => {
  const { token, user } = useContext(AuthContext); // ✅ Added user
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    classroom: ''
  });

  useEffect(() => {
    const fetchClassrooms = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      };

      try {
        const res = await axios.get(`${API_URL}/classroom`, authHeader);
        console.log('All classrooms:', res.data);
        console.log('User:', user);
        console.log('Teacher ID from user:', user?.teacherId);
        
        // ✅ FIXED: Compare teacher ID correctly
        // The classroom.teacher can be an ObjectId or a populated object
        const teacherClassrooms = res.data.filter(c => {
          // If teacher is populated (object), check _id
          if (c.teacher && typeof c.teacher === 'object' && c.teacher._id) {
            return c.teacher._id === user?.teacherId || c.teacher._id === user?.id;
          }
          // If teacher is a string (ObjectId), compare directly
          if (typeof c.teacher === 'string') {
            return c.teacher === user?.teacherId || c.teacher === user?.id;
          }
          return false;
        });
        
        console.log('Filtered classrooms:', teacherClassrooms);
        setClassrooms(teacherClassrooms);
        
        if (teacherClassrooms.length === 0) {
          toast.warning('No classrooms assigned to you. Please contact admin.');
        }
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        toast.error('Failed to load classrooms');
      }
    };

    if (token && user) {
      fetchClassrooms();
    }
  }, [token, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.classroom) {
      toast.error('Please select a classroom');
      return;
    }

    setLoading(true);
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      toast.info('Creating assignment...');
      const res = await axios.post(
        `${API_URL}/assignment`,
        formData,
        authHeader
      );
      
      toast.dismiss();
      toast.success(res.data?.message || 'Assignment created successfully');
      navigate('/teacher-dashboard/assignments');
    } catch (error) {
      toast.dismiss();
      console.error('Error creating assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
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
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard/assignments">Assignments</Link>
          </li>
          <li className="breadcrumb-item-active">/ Create Assignment</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-plus-circle-fill me-2"></i>
            Create Assignment
          </h5>
          <Link className="btn btn-secondary" to="/teacher-dashboard/assignments">
            <i className="bi bi-arrow-left me-2"></i>
            Back
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Assignment Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              placeholder="Enter assignment title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Description</label>
            <textarea
              className="form-control"
              name="description"
              rows="4"
              placeholder="Enter assignment description"
              value={formData.description}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Due Date</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Classroom</label>
              <select
                className="form-control"
                name="classroom"
                value={formData.classroom}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {classroom.name} - {classroom.gradeLevel || 'N/A'}
                  </option>
                ))}
              </select>
              {classrooms.length === 0 && (
                <div className="alert alert-warning mt-2">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  No classrooms assigned yet. Please contact admin.
                </div>
              )}
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-success"
              disabled={loading || classrooms.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Create Assignment
                </>
              )}
            </button>
            <Link
              to="/teacher-dashboard/assignments"
              className="btn btn-secondary"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherAssignmentAdd;
