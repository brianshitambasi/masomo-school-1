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


  // Prepare auth header
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Updating Parent...');
      const data = { name, email, phone, address };
      const res = await axios.put(
        `https://schoolapi-d7yp.onrender.com/api/parent/${selectedParent._id}`,
        data,
        authHeader
      );
      toast.dismiss();
      toast.success(res.data?.message || 'Parent updated successfully');
      navigate('/admin-dashboard/parents');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error updating parent');
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
    setName(selectedParent?.name || '');
    setEmail(selectedParent?.email || '');
    setPhone(selectedParent?.phone || '');
    setAddress(selectedParent?.address || '')
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
              <input
                type="text"
                className="form-control"
                placeholder="Parent Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="tel"
                className="form-control"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success">
            <i className="bi bi-save"></i> Save Parent
          </button>
        </form>
      </div>
    </div>
  );
};

export default ParentEdit;