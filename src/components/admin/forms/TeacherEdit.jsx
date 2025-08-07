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

  // Prepare auth header
  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.info('Updating Teacher...');
      const data = { name, subject, email, phone };
      const res = await axios.put(
        `https://schoolapi-d7yp.onrender.com/api/teacher/${selectedTeacher._id}`,
        data,
        authHeader
      );
      console.log(data)
      console.log(selectedTeacher)
      
      toast.dismiss();
      toast.success(res.data?.message || 'Teacher updated successfully');
      navigate('/admin-dashboard/teachers');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error updating teacher');
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

      <div className="card p-4 shadow-sm mb-4-catenin">
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

export default TeacherEdit;