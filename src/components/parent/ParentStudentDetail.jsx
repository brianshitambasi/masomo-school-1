import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const ParentStudentDetail = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceSummary, setAttendanceSummary] = useState(null);
  const [gradesSummary, setGradesSummary] = useState(null);

  // ✅ FIXED: Added token as dependency
  useEffect(() => {
    const fetchStudentData = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      };

      setLoading(true);
      try {
        const studentRes = await axios.get(`${API_URL}/student/${id}`, authHeader);
        setStudent(studentRes.data);

        try {
          const attendanceRes = await axios.get(`${API_URL}/attendance/student/${id}`, authHeader);
          setAttendanceSummary(attendanceRes.data.summary);
        } catch (e) {
          console.log('Attendance endpoint not available yet');
        }

        try {
          const gradesRes = await axios.get(`${API_URL}/grades/student/${id}`, authHeader);
          setGradesSummary(gradesRes.data.summary);
        } catch (e) {
          console.log('Grades endpoint not available yet');
        }
      } catch (error) {
        console.error('Error fetching student data:', error);
        toast.error('Failed to load student details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudentData();
    }
  }, [id, token]); // ✅ Added token as dependency

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading student details...</p>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Student not found
        </div>
        <Link to="/parent-dashboard/children" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Children
        </Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold"><Link to="/parent-dashboard">Dashboard</Link></li>
          <li className="breadcrumb-item fw-bold"><Link to="/parent-dashboard/children">Children</Link></li>
          <li className="breadcrumb-item-active">/ {student.name}</li>
        </ol>
      </nav>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card p-4 text-center shadow-sm">
            {student.photo ? (
              <img src={`${API_URL}/${student.photo}`} alt={student.name} className="rounded-circle mx-auto mb-3" style={{ width: '120px', height: '120px', objectFit: 'cover' }} />
            ) : (
              <div className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3" style={{ width: '120px', height: '120px', fontSize: '48px', color: 'white' }}>
                {student.name?.charAt(0)?.toUpperCase() || 'S'}
              </div>
            )}
            <h4 className="fw-bold">{student.name}</h4>
            <p className="text-muted"><i className="bi bi-hash me-1"></i>{student.admissionNumber}</p>
            <span className="badge bg-primary">{student.gender || 'N/A'}</span>
            <hr />
            <p className="text-muted small mb-1"><i className="bi bi-mortarboard me-2"></i>{student.classroom?.name || 'No Class'}</p>
            <p className="text-muted small mb-1"><i className="bi bi-calendar me-2"></i>DOB: {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card p-4 shadow-sm mb-4">
            <h5 className="fw-bold mb-3"><i className="bi bi-info-circle text-primary me-2"></i>Student Information</h5>
            <div className="row">
              <div className="col-md-6"><label className="text-muted small">Full Name</label><p className="fw-semibold">{student.name}</p></div>
              <div className="col-md-6"><label className="text-muted small">Admission Number</label><p className="fw-semibold">{student.admissionNumber}</p></div>
              <div className="col-md-6"><label className="text-muted small">Gender</label><p className="fw-semibold">{student.gender || 'N/A'}</p></div>
              <div className="col-md-6"><label className="text-muted small">Date of Birth</label><p className="fw-semibold">{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</p></div>
              <div className="col-md-6"><label className="text-muted small">Classroom</label><p className="fw-semibold">{student.classroom?.name || 'N/A'}</p></div>
              <div className="col-md-6"><label className="text-muted small">Grade Level</label><p className="fw-semibold">{student.classroom?.gradeLevel || 'N/A'}</p></div>
            </div>
          </div>

          {attendanceSummary && (
            <div className="card p-4 shadow-sm mb-4">
              <h5 className="fw-bold mb-3"><i className="bi bi-calendar-check text-success me-2"></i>Attendance Summary</h5>
              <div className="row g-2">
                <div className="col-3"><div className="bg-success text-white text-center p-2 rounded"><h6 className="mb-0">{attendanceSummary.present || 0}</h6><small>Present</small></div></div>
                <div className="col-3"><div className="bg-danger text-white text-center p-2 rounded"><h6 className="mb-0">{attendanceSummary.absent || 0}</h6><small>Absent</small></div></div>
                <div className="col-3"><div className="bg-warning text-dark text-center p-2 rounded"><h6 className="mb-0">{attendanceSummary.late || 0}</h6><small>Late</small></div></div>
                <div className="col-3"><div className="bg-info text-white text-center p-2 rounded"><h6 className="mb-0">{attendanceSummary.percentage || 0}%</h6><small>Rate</small></div></div>
              </div>
            </div>
          )}

          {gradesSummary && (
            <div className="card p-4 shadow-sm">
              <h5 className="fw-bold mb-3"><i className="bi bi-graph-up text-primary me-2"></i>Grades Summary</h5>
              <div className="row g-2">
                <div className="col-4"><div className="bg-primary text-white text-center p-2 rounded"><h6 className="mb-0">{gradesSummary.average || 0}%</h6><small>Average</small></div></div>
                <div className="col-4"><div className="bg-success text-white text-center p-2 rounded"><h6 className="mb-0">{gradesSummary.highest || 0}</h6><small>Highest</small></div></div>
                <div className="col-4"><div className="bg-danger text-white text-center p-2 rounded"><h6 className="mb-0">{gradesSummary.lowest || 0}</h6><small>Lowest</small></div></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentStudentDetail;
