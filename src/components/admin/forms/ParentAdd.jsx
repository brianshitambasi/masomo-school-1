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

  // Prepare auth header
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Adding Parent...');
      const data = { name, email, phone, address, nationalId };
      const res = await axios.post('https://schoolapi-d7yp.onrender.com/api/parent', data, authHeader);
      toast.dismiss();
      toast.success(res.data?.message || 'Parent added successfully');
      navigate('/admin-dashboard/students/add');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error adding parent');
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

        {/* Form to add a parent */}
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
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="National Id"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
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

export default ParentAdd;