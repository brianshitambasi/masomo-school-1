import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const TeacherAssignmentEdit = () => {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    classroom: ''
  });

  // Fetch assignment details and classrooms
  useEffect(() => {
    const fetchData = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      };

      setFetching(true);
      try {
        // Fetch assignment details
        const assignmentRes = await axios.get(`${API_URL}/assignment/${id}`, authHeader);
        const assignment = assignmentRes.data;
        
        console.log('Assignment data:', assignment);
        
        setFormData({
          title: assignment.title || '',
          description: assignment.description || '',
          dueDate: assignment.dueDate ? new Date(assignment.dueDate).toISOString().split('T')[0] : '',
          classroom: assignment.classroom?._id || assignment.classroom || ''
        });

        // Fetch classrooms for the teacher
        const classroomsRes = await axios.get(`${API_URL}/classroom`, authHeader);
        // Filter classrooms where this teacher is assigned
        const teacherClassrooms = classroomsRes.data.filter(c => {
          if (c.teacher && typeof c.teacher === 'object' && c.teacher._id) {
            return c.teacher._id === user?.teacherId || c.teacher._id === user?.id;
          }
          if (typeof c.teacher === 'string') {
            return c.teacher === user?.teacherId || c.teacher === user?.id;
          }
          return false;
        });
        setClassrooms(teacherClassrooms);
        
        console.log('Teacher classrooms:', teacherClassrooms);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load assignment details');
        navigate('/teacher-dashboard/assignments');
      } finally {
        setFetching(false);
      }
    };

    if (id && token) {
      fetchData();
    }
  }, [id, token, navigate, user]);

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
      toast.info('Updating assignment...');
      const res = await axios.put(
        `${API_URL}/assignment/${id}`,
        formData,
        authHeader
      );
      
      toast.dismiss();
      toast.success(res.data?.message || 'Assignment updated successfully');
      navigate('/teacher-dashboard/assignments');
    } catch (error) {
      toast.dismiss();
      console.error('Error updating assignment:', error);
      toast.error(error.response?.data?.message || 'Failed to update assignment');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading assignment details...</p>
      </div>
    );
  }

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
          <li className="breadcrumb-item-active">/ Edit Assignment</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-warning">
            <i className="bi bi-pencil-square me-2"></i>
            Edit Assignment
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
              className="btn btn-warning"
              disabled={loading || classrooms.length === 0}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  Updating...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Update Assignment
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

export default TeacherAssignmentEdit;
