import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const TeacherEdit = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedTeacher = state?.teacherData;
  
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Use local backend URL
  const API_URL = 'https://schools-gngz.onrender.com'; // or use config

  // Prepare auth header
  const authHeader = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      toast.info('Updating Teacher...');
      const data = { name, subject, email, phone };
      
      console.log('Updating teacher with data:', data);
      console.log('Teacher ID:', selectedTeacher._id);
      
      const res = await axios.put(
        `${API_URL}/teacher/${selectedTeacher._id}`,
        data,
        authHeader
      );
      
      console.log('Update response:', res.data);
      
      toast.dismiss();
      toast.success(res.data?.message || 'Teacher updated successfully');
      setLoading(false);
      navigate('/admin-dashboard/teachers');
      
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      
      console.error('Update error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        const errorMessage = error.response.data?.message || 
                           error.response.data?.msg || 
                           'Error updating teacher';
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
        
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running on port 3004');
        
      } else {
        toast.error(error.message || 'Error updating teacher');
      }
    }
  };

  // Populate form with selected teacher data
  useEffect(() => {
    if (!selectedTeacher) {
      toast.error('No teacher data provided');
      setTimeout(() => {
        navigate('/admin-dashboard/teachers');
      }, 2000);
      return;
    }
    
    console.log('Editing teacher:', selectedTeacher);
    
    setName(selectedTeacher?.name || '');
    setSubject(selectedTeacher?.subject || '');
    setEmail(selectedTeacher?.email || '');
    setPhone(selectedTeacher?.phone || '');
    
  }, [selectedTeacher, navigate]);

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard/teachers">Teachers</Link>
          </li>
          <li className="breadcrumb-item-active" aria-current="page">
            / Update Teacher
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-person-lines-fill me-2"></i>Update Teacher
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/teachers">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Back
          </Link>
        </div>

        {/* Form to edit a teacher */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Teacher Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Teacher Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Subject</label>
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-success"
            disabled={loading}
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
                Update Teacher
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherEdit;