import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const TeacherAdd = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  // Use local backend URL
  const API_URL = 'https://schools-gngz.onrender.com'; // or use your config

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
      toast.info('Adding Teacher...');
      const data = { name, subject, email, phone };
      
      console.log('Sending data:', data);
      console.log('Auth header:', authHeader);
      
      const res = await axios.post(`${API_URL}/teacher`, data, authHeader);
      
      console.log('Response:', res.data);
      
      toast.dismiss();
      toast.success(res.data?.message || 'Teacher added successfully');
      setLoading(false);
      
      // Navigate back to teachers list
      navigate('/admin-dashboard/teachers');
      
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      
      console.error('Full error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        const errorMessage = error.response.data?.message || 
                           error.response.data?.msg || 
                           'Server error occurred';
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
        
      } else if (error.request) {
        // The request was made but no response was received
        console.error('Request:', error.request);
        toast.error('Cannot connect to server. Please check if backend is running on port 3004');
        
      } else {
        // Something happened in setting up the request
        console.error('Error message:', error.message);
        toast.error(error.message || 'Error adding teacher');
      }
    }
  };

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
            / Add Teacher
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-person-plus-fill me-2"></i>Add Teacher
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/teachers">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Back
          </Link>
        </div>

        {/* Form to add a teacher */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Teacher Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter teacher name"
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
                placeholder="Enter subject"
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
                placeholder="Enter email address"
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
                placeholder="Enter phone number"
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
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-save me-2"></i>
                Save Teacher
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAdd;