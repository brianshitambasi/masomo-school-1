import React, { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const TeacherAdd = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');

  // Prepare auth header
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Adding Teacher...');
      const data = { name, subject, email, phone };
      const res = await axios.post('https://schoolapi-d7yp.onrender.com/api/teacher', data, authHeader);
      toast.dismiss();
      toast.success(res.data?.message || 'Teacher added successfully');
      navigate('/admin-dashboard/teachers');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error adding teacher');
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
              <input
                type="text"
                className="form-control"
                placeholder="Teacher Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
          </div>
          <button type="submit" className="btn btn-success">
            <i className="bi bi-save"></i> Save Teacher
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAdd;