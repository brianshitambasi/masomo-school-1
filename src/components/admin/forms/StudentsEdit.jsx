import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';

const StudentsEdit = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const { state } = useLocation();
  const selectedStudent = state?.studentData;
  
  const [name, setName] = useState('');
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [gender, setGender] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [parents, setParents] = useState([]);
  const [selectedParent, setSelectedParent] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const API_URL = 'https://schools-gngz.onrender.com'; // or use config

  const authHeader = {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  };

  // Fetch classrooms and parents
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

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchClasses(), fetchParents()]);
      setIsLoading(false);
    };
    loadData();
  }, []);

  // Populate form with selected student data
  useEffect(() => {
    if (!selectedStudent) {
      toast.error('No student data provided');
      setTimeout(() => {
        navigate('/admin-dashboard/students');
      }, 2000);
      return;
    }

    console.log('Editing student:', selectedStudent);

    setName(selectedStudent?.name || '');
    setAdmissionNumber(selectedStudent?.admissionNumber || '');
    setGender(selectedStudent?.gender || '');
    setDateOfBirth(selectedStudent?.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toISOString().split('T')[0] : '');
    setSelectedClassroom(selectedStudent?.classroom?._id || selectedStudent?.classroom || '');
    setSelectedParent(selectedStudent?.parent?._id || selectedStudent?.parent || '');
  }, [selectedStudent, navigate]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!selectedStudent?._id) {
      toast.error('Invalid student data');
      setLoading(false);
      return;
    }

    try {
      toast.info('Updating Student...');
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('admissionNumber', admissionNumber);
      formData.append('gender', gender);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('classroom', selectedClassroom);
      formData.append('parent', selectedParent);
      if (photo) formData.append('photo', photo);

      const res = await axios.put(
        `${API_URL}/student/${selectedStudent._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      console.log('Update response:', res.data);

      toast.dismiss();
      toast.success(res.data?.message || 'Student updated successfully');
      setLoading(false);
      navigate('/admin-dashboard/students');
      
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      
      console.error('Update error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 'Error updating student';
        toast.error(`Error ${error.response.status}: ${errorMessage}`);
      } else if (error.request) {
        toast.error('Cannot connect to server. Please check if backend is running.');
      } else {
        toast.error(error.message || 'Error updating student');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading student data...</p>
      </div>
    );
  }

  if (!selectedStudent) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          No student data provided. Please go back and select a student to edit.
        </div>
        <div className="text-center">
          <Link to="/admin-dashboard/students" className="btn btn-success">
            <i className="bi bi-arrow-left me-2"></i>
            Back to Students
          </Link>
        </div>
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
            / Update Student
          </li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success">
            <i className="bi bi-person-lines-fill me-2"></i>
            Update Student
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/students">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>
            Back
          </Link>
        </div>

        {/* Form to edit a student */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Student Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Student Name"
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
                placeholder="Admission Number"
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
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Parent</label>
              <select
                className="form-control"
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Parent</option>
                {parents.map((parent) => (
                  <option key={parent._id} value={parent._id}>
                    {parent.name} ({parent.phone || 'No Phone'})
                  </option>
                ))}
              </select>
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
              {selectedStudent?.photo && (
                <div className="mt-2">
                  <small className="text-muted">Current photo:</small>
                  <div className="mt-1">
                    <img 
                      src={`${API_URL}/${selectedStudent.photo}`} 
                      alt="Student" 
                      style={{ 
                        width: '60px', 
                        height: '60px', 
                        objectFit: 'cover',
                        borderRadius: '50%',
                        border: '2px solid #28a745'
                      }} 
                    />
                  </div>
                </div>
              )}
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
                  Update Student
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

export default StudentsEdit;