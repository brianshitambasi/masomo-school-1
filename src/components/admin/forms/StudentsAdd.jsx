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
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch classrooms and parents
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

  // Handle photo selection
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image (JPEG, PNG, GIF, or WEBP)');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setPhoto(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Verify parent by national ID
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedParent) {
      toast.error('Please verify a parent before submitting');
      return;
    }

    setLoading(true);
    setUploadProgress(0);
    
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
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      toast.dismiss();
      toast.success(res.data?.message || 'Student added successfully with photo!');
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
                    {classroom.name || 'Unnamed Class'}
                  </option>
                ))}
              </select>
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
                  <i className="bi bi-check-circle-fill me-1"></i>Parent verified
                </small>
              )}
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Photo (Cloudinary)</label>
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
                Supported: JPG, PNG, GIF, WEBP (Max 5MB)
              </small>
            </div>
          </div>

          {/* Photo Preview */}
          {photoPreview && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="text-muted">Photo Preview</h6>
                    <img 
                      src={photoPreview} 
                      alt="Student preview" 
                      className="rounded-circle border border-success"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <p className="text-muted small mt-2">Photo will be uploaded to Cloudinary</p>
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

          <button type="submit" className="btn btn-success" disabled={loading || !selectedParent}>
            {loading ? 'Saving...' : <><i className="bi bi-cloud-upload me-2"></i>Save Student</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentsAdd;
