import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

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

  const API_URL = 'https://schools-gngz.onrender.com';

  // Prepare auth header for JSON requests
  const authHeader = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
  };

  // Fetch classrooms
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

  // Fetch parents
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

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchClasses(), fetchParents()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Verify parent by national ID
  const verifyParent = async () => {
    if (!nationalId) {
      toast.error('Please enter a national ID');
      return;
    }
    
    setLoading(true);
    try {
      toast.info('Verifying parent...');
      
      // Find parent by national ID
      const foundParent = parents.find(p => p.nationalId === nationalId);
      
      if (foundParent) {
        setSelectedParent(foundParent._id);
        toast.dismiss();
        toast.success(`Parent verified: ${foundParent.name}`);
      } else {
        toast.dismiss();
        toast.error('Parent not found with this National ID. Please add parent first.');
        setSelectedParent('');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error verifying parent:', error);
      toast.error(error.response?.data?.message || 'Failed to verify parent');
      setSelectedParent('');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
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

      const res = await axios.post(
        `${API_URL}/student`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Add student response:', res.data);

      toast.dismiss();
      toast.success(res.data?.message || 'Student added successfully');
      setLoading(false);
      navigate('/admin-dashboard/students');
      
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      
      console.error('Add student error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Error adding student';
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error(error.message || 'Error adding student');
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

      {/* Breadcrumbs */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard/students">Students</Link>
          </li>
          <li className="breadcrumb-item-active" aria-current="page">
            / Add Student
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-person-plus-fill me-2"></i>
            Add Student
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/students">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>
            Back
          </Link>
        </div>

        {/* Form to add a student */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Student Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter student name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Admission Number</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter admission number"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Gender</label>
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Date of Birth</label>
              <input
                type="date"
                className="form-control"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Classroom</label>
              <select
                className="form-control"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {`${classroom.gradeLevel || ''} ${classroom.name || ''}`.trim() || 'Unnamed Class'}
                  </option>
                ))}
              </select>
              {classrooms.length === 0 && (
                <small className="text-warning">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  No classrooms available. Please add a classroom first.
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent National ID</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter parent's national ID"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn btn-outline-success"
                  onClick={verifyParent}
                  disabled={loading || !nationalId}
                >
                  <i className="bi bi-check-circle"></i> Verify
                </button>
              </div>
              {selectedParent && (
                <small className="text-success d-block mt-1">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Parent verified: {parents.find(p => p._id === selectedParent)?.name || 'Verified'}
                </small>
              )}
              {parents.length === 0 && (
                <small className="text-warning d-block mt-1">
                  <i className="bi bi-exclamation-triangle me-1"></i>
                  No parents available. Please add a parent first.
                </small>
              )}
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Photo</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                disabled={loading}
              />
              {photo && (
                <small className="text-success d-block mt-1">
                  <i className="bi bi-image me-1"></i>
                  Selected: {photo.name}
                </small>
              )}
            </div>
          </div>

          <div className="mt-3 d-flex gap-2">
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={loading || !selectedParent}
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
                  Save Student
                </>
              )}
            </button>
            <Link 
              to="/admin-dashboard/students" 
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

export default StudentsAdd;