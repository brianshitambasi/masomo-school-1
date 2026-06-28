import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../../config';

const TeacherAdd = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    bio: '',
    qualifications: ''
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
    setUploadProgress(0);

    try {
      toast.info('Adding Teacher...');
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key]);
      });
      if (photo) formDataObj.append('photo', photo);

      const res = await axios.post(`${API_URL}/teacher`, formDataObj, {
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
      toast.success(res.data?.message || 'Teacher added successfully');
      setLoading(false);
      navigate('/admin-dashboard/teachers');
    } catch (error) {
      setLoading(false);
      toast.dismiss();
      console.error('Add teacher error:', error);
      toast.error(error.response?.data?.message || 'Error adding teacher');
    }
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item fw-bold"><Link to="/admin-dashboard/teachers">Teachers</Link></li>
          <li className="breadcrumb-item-active">/ Add Teacher</li>
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

        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                placeholder="Enter full name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Phone</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                placeholder="Enter phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Subject</label>
              <input
                type="text"
                className="form-control"
                name="subject"
                placeholder="Enter subject"
                value={formData.subject}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-semibold">Qualifications</label>
              <input
                type="text"
                className="form-control"
                name="qualifications"
                placeholder="Enter qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                disabled={loading}
              />
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
            </div>
            <div className="col-12 mb-3">
              <label className="form-label fw-semibold">Bio</label>
              <textarea
                className="form-control"
                name="bio"
                rows="3"
                placeholder="Enter teacher bio"
                value={formData.bio}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          {photoPreview && (
            <div className="row mb-3">
              <div className="col-12">
                <div className="card bg-light">
                  <div className="card-body text-center">
                    <h6 className="text-muted">Photo Preview</h6>
                    <img 
                      src={photoPreview} 
                      alt="Teacher preview" 
                      className="rounded-circle border border-success"
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

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
            {loading ? 'Saving...' : <><i className="bi bi-cloud-upload me-2"></i>Save Teacher</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TeacherAdd;
