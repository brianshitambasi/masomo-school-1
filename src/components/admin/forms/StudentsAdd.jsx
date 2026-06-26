import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../../config';

const StudentsAdd = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ✅ FIXED: Added token to dependency array
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get(`${API_URL}/classroom`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassrooms(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        toast.error('Failed to load classrooms');
      }
    };

    const fetchParents = async () => {
      try {
        const res = await axios.get(`${API_URL}/parent`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParents(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Error fetching parents:', error);
        toast.error('Failed to load parents');
      }
    };

    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchClasses(), fetchParents()]);
      setIsLoading(false);
    };
    loadData();
  }, [token]); // ✅ Added token as dependency

  const verifyParent = async () => {
    if (!nationalId) {
      toast.error('Please enter a national ID');
      return;
    }
    
    setLoading(true);
    try {
      toast.info('Verifying parent...');
      const foundParent = parents.find(p => p.nationalId === nationalId);
      if (foundParent) {
        setSelectedParent(foundParent._id);
        toast.dismiss();
        toast.success(`Parent verified: ${foundParent.name}`);
      } else {
        toast.dismiss();
        toast.error('Parent not found with this National ID.');
        setSelectedParent('');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error verifying parent:', error);
      toast.error('Failed to verify parent');
      setSelectedParent('');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent) {
      toast.error('Please verify a parent before submitting');
      return;
    }
    setLoading(true);
    try {
      toast.info('Adding Student...');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('admissionNumber', admissionNumber);
      formData.append('gender', gender);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('classromId', selectedClassroom);
      formData.append('parentNationalId', nationalId);
      if (photo) formData.append('photo', photo);

      const res = await axios.post(`${API_URL}/student`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.dismiss();
      toast.success(res.data?.message || 'Student added successfully');
      setLoading(false);
      navigate('/admin-dashboard/students');
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      console.error('Add student error:', error);
      if (error.response) {
        toast.error(`Error ${error.response.status}: ${error.response.data?.message || 'Error adding student'}`);
      } else {
        toast.error('Error adding student');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading form data...</p>
      </div>
    );
  }

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard/students">Students</Link></li>
          <li className="breadcrumb-item-active">/ Add Student</li>
        </ol>
      </nav>
      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success"><i className="bi bi-person-plus-fill me-2"></i>Add Student</h5>
          <Link className="btn btn-success" to="/admin-dashboard/students"><i className="bi bi-arrow-left-circle-fill me-2"></i>Back</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Student Name</label>
              <input type="text" className="form-control" placeholder="Enter student name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Admission Number</label>
              <input type="text" className="form-control" placeholder="Enter admission number" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Gender</label>
              <select className="form-control" value={gender} onChange={(e) => setGender(e.target.value)} required disabled={loading}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Date of Birth</label>
              <input type="date" className="form-control" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Classroom</label>
              <select className="form-control" value={selectedClassroom} onChange={(e) => setSelectedClassroom(e.target.value)} required disabled={loading}>
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>{classroom.name || 'Unnamed Class'}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent National ID</label>
              <div className="input-group">
                <input type="text" className="form-control" placeholder="Enter parent's national ID" value={nationalId} onChange={(e) => setNationalId(e.target.value)} required disabled={loading} />
                <button type="button" className="btn btn-outline-success" onClick={verifyParent} disabled={loading || !nationalId}>
                  <i className="bi bi-check-circle"></i> Verify
                </button>
              </div>
              {selectedParent && (
                <small className="text-success d-block mt-1">
                  <i className="bi bi-check-circle-fill me-1"></i>Parent verified
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Photo</label>
              <input type="file" className="form-control" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} disabled={loading} />
              {photo && (
                <small className="text-success d-block mt-1">
                  <i className="bi bi-image me-1"></i>Selected: {photo.name}
                </small>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-success" disabled={loading || !selectedParent}>
            {loading ? 'Saving...' : <><i className="bi bi-save me-2"></i>Save Student</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentsAdd;
