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
  const [classrooms, setClassrooms] = useState([]); // Initialize as array for classrooms
  const [selectedClassroom, setSelectedClassroom] = useState(''); // Selected classroom ID
  const [parents, setParents] = useState([]); // Initialize as array for parents
  const [selectedParent, setSelectedParent] = useState(''); // Selected parent ID
  const [nationalId, setNationalId] = useState(''); // State for national ID input
  const [photo, setPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Loading state for API calls

  // Prepare auth header
  const authHeader = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data', // Required for file upload
    },
  };

  // Fetch classrooms from API
  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      toast.info('Loading classrooms...');
      const res = await axios.get('https://schoolapi-d7yp.onrender.com/api/classroom', authHeader);
      setClassrooms(Array.isArray(res.data) ? res.data : []);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to load classrooms');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch parents from API
  const fetchParents = async () => {
    setIsLoading(true);
    try {
      toast.info('Loading parents...');
      const res = await axios.get('https://schoolapi-d7yp.onrender.com/api/parent', authHeader);
      setParents(Array.isArray(res.data) ? res.data : []);
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to load parents');
    } finally {
      setIsLoading(false);
    }
  };

  // Verify parent by national ID
  const verifyParent = async () => {
    if (!nationalId) {
      toast.error('Please enter a national ID');
      return;
    }
    setIsLoading(true);
    try {
      toast.info('Verifying parent...');
      const res = await axios.get(
        `https://schoolapi-d7yp.onrender.com/api/parent/${nationalId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data && res.data._id) {
        setSelectedParent(res.data._id);
        toast.success(`Parent verified: ${res.data.name || 'Parent'}`);
      } else {
        toast.error('Parent not found');
        setSelectedParent('');
      }
      toast.dismiss();
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Failed to verify parent');
      setSelectedParent('');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch classrooms and parents on component mount
  useEffect(() => {
    fetchClasses();
    fetchParents();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent) {
      toast.error('Please verify a parent before submitting');
      return;
    }
    setIsLoading(true);
    try {
      toast.info('Adding Student...');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('admissionNumber', admissionNumber);
      formData.append('gender', gender);
      formData.append('dateOfBirth', dateOfBirth);
      formData.append('classroom', selectedClassroom); 
      formData.append('parent', nationalId); 
      if (photo) formData.append('photo', photo);

      const res = await axios.post(
        'https://schoolapi-d7yp.onrender.com/api/student',
        formData,
        authHeader
      );
      toast.dismiss();
      toast.success(res.data?.message || 'Student added successfully');
      navigate('/admin-dashboard/students');
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Error adding student');
    } finally {
      setIsLoading(false);
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
            <i className="bi bi-person-plus-fill me-2"></i>Add Student
          </h5>
          <Link className="btn btn-success" to="/admin-dashboard/students">
            <i className="bi bi-arrow-left-circle-fill me-2"></i>Back
          </Link>
        </div>

        {/* Form to add a student */}
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Admission Number"
                value={admissionNumber}
                onChange={(e) => setAdmissionNumber(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="date"
                className="form-control"
                placeholder="Date of Birth"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <select
                className="form-control"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                required
                disabled={isLoading}
              >
                <option value="">Select Classroom</option>
                {classrooms.map((classroom) => (
                  <option key={classroom._id} value={classroom._id}>
                    {`${classroom.gradeLevel || classroom.name || 'Unknown'}, ${classroom.name || 'Unknown'}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3 position-relative">
              <input
                type="text"
                className="form-control"
                placeholder="Parent National ID"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                required
                disabled={isLoading}
              />
              <i
                className="bi bi-check-circle-fill"
                onClick={verifyParent}
                style={{
                  position: 'absolute',
                  right: '15px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'green',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  pointerEvents : 'auto',
                }}
                title="Verify Parent"
              ></i>
            </div>
            
            <div className="col-md-6 mb-3">
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                disabled={isLoading}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-success" disabled={isLoading}>
            <i className="bi bi-save"></i> {isLoading ? 'Saving...' : 'Save Student'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentsAdd;