import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ParentEdit = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedParent = state?.parentData;
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

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
      toast.info('Updating Parent...');
      const data = { name, email, phone, address };
      
      console.log('Updating parent with data:', data);
      console.log('Parent ID:', selectedParent._id);
      
      const res = await axios.put(
        `${API_URL}/parent/${selectedParent._id}`,
        data,
        authHeader
      );
      
      console.log('Update response:', res.data);
      
      toast.dismiss();
      toast.success(res.data?.message || 'Parent updated successfully');
      setLoading(false);
      navigate('/admin-dashboard/parents');
      
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      
      console.error('Update error:', error);
      
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        
        const errorMessage = error.response.data?.message || 
                           error.response.data?.msg || 
                           'Error updating parent';
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
        
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running on port 3004');
        
      } else {
        toast.error(error.message || 'Error updating parent');
      }
    }
  };

  // Populate form with selected parent data
  useEffect(() => {
    if (!selectedParent) {
      toast.error('No parent data provided');
      setTimeout(() => {
        navigate('/admin-dashboard/parents');
      }, 2000);
      return;
    }
    
    console.log('Editing parent:', selectedParent);
    
    setName(selectedParent?.name || '');
    setEmail(selectedParent?.email || '');
    setPhone(selectedParent?.phone || '');
    setAddress(selectedParent?.address || '');
  }, [selectedParent, navigate]);

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
            <Link to="/admin-dashboard/parents">Parents</Link>
          </li>
          <li className="breadcrumb-item-active" aria-current="page">
            / Update Parent
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-person-lines-fill me-2"></i>Update Parent
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/parents">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Back
          </Link>
        </div>

        {/* Form to edit a parent */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Parent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Address</label>
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="mt-3 d-flex gap-2">
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
                  Update Parent
                </>
              )}
            </button>
            <Link 
              to="/admin-dashboard/parents" 
              className="btn btn-secondary"
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ParentEdit;