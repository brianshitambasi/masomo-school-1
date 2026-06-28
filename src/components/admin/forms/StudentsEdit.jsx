import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../../config';

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
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const getImageUrl = (photoPath) => {
    if (!photoPath) return null;
    if (photoPath.startsWith('http://') || photoPath.startsWith('https://')) {
      return photoPath;
    }
    if (photoPath.startsWith('uploads/')) {
      return `${API_URL}/${photoPath}`;
    }
    return `${API_URL}/${photoPath}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      };

      setIsLoading(true);
      try {
        const [classroomsRes, parentsRes] = await Promise.all([
          axios.get(`${API_URL}/classroom`, authHeader),
          axios.get(`${API_URL}/parent`, authHeader)
        ]);
        setClassrooms(classroomsRes.data || []);
        setParents(parentsRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load form data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    if (!selectedStudent) {
      toast.error('No student data provided');
      setTimeout(() => navigate('/admin-dashboard/students'), 2000);
      return;
    }
    setName(selectedStudent?.name || '');
    setAdmissionNumber(selectedStudent?.admissionNumber || '');
    setGender(selectedStudent?.gender || '');
    setDateOfBirth(selectedStudent?.dateOfBirth ? new Date(selectedStudent.dateOfBirth).toISOString().split('T')[0] : '');
    setSelectedClassroom(selectedStudent?.classroom?._id || selectedStudent?.classroom || '');
    setSelectedParent(selectedStudent?.parent?._id || selectedStudent?.parent || '');
  }, [selectedStudent, navigate]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, GIF, or WEBP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

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

      await axios.put(`${API_URL}/student/${selectedStudent._id}`, formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      toast.dismiss();
      toast.success('Student updated successfully');
      setLoading(false);
      navigate('/admin-dashboard/students');
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Error updating student');
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
          <i className="bi bi-exclamation-triangle me-2"></i>No student data provided.
        </div>
        <div className="text-center">
          <Link to="/admin-dashboard/students" className="btn btn-success">
            <i className="bi bi-arrow-left me-2"></i>Back to Students
          </Link>
        </div>
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
          <li className="breadcrumb-item-active">/ Update Student</li>
        </ol>
      </nav>
      <div className="card p-4 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="text-success"><i className="bi bi-person-lines-fill me-2"></i>Update Student</h5>
          <Link className="btn btn-success" to="/admin-dashboard/students"><i className="bi bi-arrow-left-circle-fill me-2"></i>Back</Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Student Name</label>
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Admission Number</label>
              <input type="text" className="form-control" value={admissionNumber} onChange={(e) => setAdmissionNumber(e.target.value)} required disabled={loading} />
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
              <label className="form-label fw-semibold">Parent</label>
              <select className="form-control" value={selectedParent} onChange={(e) => setSelectedParent(e.target.value)} required disabled={loading}>
                <option value="">Select Parent</option>
                {parents.map((parent) => (
                  <option key={parent._id} value={parent._id}>{parent.name}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Photo</label>
              <input type="file" className="form-control" accept="image/*" onChange={handlePhotoChange} disabled={loading} />
              {selectedStudent?.photo && !photoPreview && (
                <div className="mt-2">
                  <small className="text-muted">Current photo:</small>
                  <div className="mt-1">
                    <img 
                      src={getImageUrl(selectedStudent.photo)} 
                      alt="Student" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #28a745' }} 
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}
              {photoPreview && (
                <div className="mt-2">
                  <small className="text-success">New photo preview:</small>
                  <div className="mt-1">
                    <img 
                      src={photoPreview} 
                      alt="New student" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', border: '2px solid #28a745' }} 
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Updating...' : <><i className="bi bi-save me-2"></i>Update Student</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentsEdit;
