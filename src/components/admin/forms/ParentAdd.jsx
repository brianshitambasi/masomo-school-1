import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const ParentAdd = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [nationalId, setNationalId] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const API_URL = 'https://schools-gngz.onrender.com';

  const authHeader = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      toast.info('Adding Parent...');
      const data = { name, email, phone, address, nationalId };
      
      console.log('Adding parent:', data);
      
      const res = await axios.post(`${API_URL}/parent`, data, authHeader);
      
      console.log('Response:', res.data);
      
      toast.dismiss();
      toast.success(res.data?.message || 'Parent added successfully');
      setLoading(false);
      navigate('/admin-dashboard/parents');
      
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      
      console.error('Error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.msg || 
                           'Error adding parent';
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error(error.message || 'Error adding parent');
      }
    }
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard/parents">Parents</Link>
          </li>
          <li className="breadcrumb-item-active" aria-current="page">
            / Add Parent
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-person-plus-fill me-2"></i>Add Parent
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/parents">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Back
          </Link>
        </div>

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
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">National ID</label>
              <input
                type="text"
                className="form-control"
                placeholder="National ID"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                required
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
                  Saving...
                </>
              ) : (
                <>
                  <i className="bi bi-save me-2"></i>
                  Save Parent
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

export default ParentAdd;