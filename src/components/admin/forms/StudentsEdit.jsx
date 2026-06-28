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
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

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
  }, []);

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
    setCurrentPhoto(selectedStudent?.photo || null);
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
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploadProgress(0);
    
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
        headers: { 
          Authorization: `Bearer ${token}`, 
          'Content-Type': 'multipart/form-data' 
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });
      
      toast.dismiss();
      toast.success('Student updated successfully with new photo!');
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
              <input 
                type="text" 
                className="form-control" 
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
                    {classroom.name || 'Unnamed Class'}
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
                    {parent.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Photo</label>
              <input 
                type="file" 
                className="form-control" 
                accept="image/jpeg,image/png,image/gif,image/webp" 
                onChange={handlePhotoChange} 
                disabled={loading} 
              />
              {photo && (
                <small className="text-success d-block mt-1">
                  <i className="bi bi-cloud-upload me-1"></i>
                  Selected: {photo.name} ({Math.round(photo.size / 1024)} KB)
                </small>
              )}
              <small className="text-muted d-block">
                <i className="bi bi-info-circle me-1"></i>
                Leave empty to keep current photo
              </small>
            </div>
          </div>

          {/* Current Photo */}
          {currentPhoto && !photoPreview && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="text-muted">Current Photo (Cloudinary)</h6>
                    <img 
                      src={currentPhoto} 
                      alt="Current student" 
                      className="rounded-circle border border-success"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <p className="text-muted small mt-2">Stored in Cloudinary</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* New Photo Preview */}
          {photoPreview && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card bg-info bg-opacity-10">
                  <div className="card-body text-center">
                    <h6 className="text-info">New Photo Preview (Will upload to Cloudinary)</h6>
                    <img 
                      src={photoPreview} 
                      alt="New student preview" 
                      className="rounded-circle border border-info"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && uploadProgress < 100 && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card bg-info bg-opacity-10">
                  <div className="card-body">
                    <h6 className="text-info">Uploading to Cloudinary...</h6>
                    <div className="progress">
                      <div 
                        className="progress-bar progress-bar-striped progress-bar-animated bg-success" 
                        style={{ width: `${uploadProgress}%` }}
                      >
                        {uploadProgress}%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-success" disabled={loading}>
            {loading ? 'Updating...' : <><i className="bi bi-cloud-upload me-2"></i>Update Student</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentsEdit;
