import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { API_URL } from '../../config'

const TeacherStudentDetail = () => {
  const { token } = useContext(AuthContext)
  const { id } = useParams()
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [attendanceSummary, setAttendanceSummary] = useState(null)
  const [gradesSummary, setGradesSummary] = useState(null)
  const [activeTab, setActiveTab] = useState('profile')

  useEffect(() => {
    const fetchStudentData = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      }

      setLoading(true)
      try {
        // Fetch student details
        const studentRes = await axios.get(`${API_URL}/student/${id}`, authHeader)
        setStudent(studentRes.data)

        // Fetch attendance summary (if available)
        try {
          const attendanceRes = await axios.get(
            `${API_URL}/attendance/student/${id}`,
            authHeader
          )
          setAttendanceSummary(attendanceRes.data.summary)
        } catch (e) {
          console.log('Attendance endpoint not available yet')
        }

        // Fetch grades summary (if available)
        try {
          const gradesRes = await axios.get(
            `${API_URL}/grades/student/${id}`,
            authHeader
          )
          setGradesSummary(gradesRes.data.summary)
        } catch (e) {
          console.log('Grades endpoint not available yet')
        }
      } catch (error) {
        console.error('Error fetching student data:', error)
        toast.error('Failed to load student details')
        navigate('/teacher-dashboard/students')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchStudentData()
    }
  }, [id, token, navigate])

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading student details...</p>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Student not found
        </div>
        <Link to="/teacher-dashboard/students" className="btn btn-secondary">
          <i className="bi bi-arrow-left me-2"></i>
          Back to Students
        </Link>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard/students">Students</Link>
          </li>
          <li className="breadcrumb-item-active">/ {student.name}</li>
        </ol>
      </nav>

      <div className="row">
        {/* Profile Card */}
        <div className="col-lg-4 mb-4">
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center p-4">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.name}
                  className="rounded-circle mx-auto mb-3 border border-success"
                  style={{ width: '150px', height: '150px', objectFit: 'cover', borderWidth: '3px' }}
                />
              ) : (
                <div
                  className="rounded-circle bg-success d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '150px', height: '150px', fontSize: '60px', color: 'white' }}
                >
                  {student.name?.charAt(0)?.toUpperCase() || 'S'}
                </div>
              )}
              <h4 className="fw-bold">{student.name}</h4>
              <p className="text-muted">
                <i className="bi bi-hash me-1"></i>
                {student.admissionNumber || 'N/A'}
              </p>
              <div className="mb-2">
                <span className="badge bg-primary me-1">{student.gender || 'N/A'}</span>
                <span className="badge bg-info">{student.classroom?.name || 'No Class'}</span>
              </div>
              <hr />
              <div className="row text-center">
                <div className="col-4">
                  <h6 className="fw-bold text-success">{attendanceSummary?.present || 0}</h6>
                  <small className="text-muted">Present</small>
                </div>
                <div className="col-4">
                  <h6 className="fw-bold text-danger">{attendanceSummary?.absent || 0}</h6>
                  <small className="text-muted">Absent</small>
                </div>
                <div className="col-4">
                  <h6 className="fw-bold text-primary">{attendanceSummary?.percentage || 0}%</h6>
                  <small className="text-muted">Attendance</small>
                </div>
              </div>
              <hr />
              <Link to="/teacher-dashboard/students" className="btn btn-secondary w-100">
                <i className="bi bi-arrow-left me-2"></i>
                Back to Students
              </Link>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="col-lg-8">
          {/* Tabs */}
          <ul className="nav nav-tabs mb-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'profile' ? 'active text-success fw-bold' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="bi bi-person me-1"></i>
                Profile
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'attendance' ? 'active text-success fw-bold' : ''}`}
                onClick={() => setActiveTab('attendance')}
              >
                <i className="bi bi-calendar-check me-1"></i>
                Attendance
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'grades' ? 'active text-success fw-bold' : ''}`}
                onClick={() => setActiveTab('grades')}
              >
                <i className="bi bi-graph-up me-1"></i>
                Grades
              </button>
            </li>
          </ul>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Student Information
                </h5>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Full Name</label>
                    <p className="fw-semibold">{student.name}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Admission Number</label>
                    <p className="fw-semibold">{student.admissionNumber}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Gender</label>
                    <p className="fw-semibold">{student.gender || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Date of Birth</label>
                    <p className="fw-semibold">
                      {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Classroom</label>
                    <p className="fw-semibold">{student.classroom?.name || 'N/A'}</p>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="text-muted small fw-bold">Grade Level</label>
                    <p className="fw-semibold">{student.classroom?.gradeLevel || 'N/A'}</p>
                  </div>
                  <div className="col-12 mb-3">
                    <label className="text-muted small fw-bold">Parent</label>
                    <p className="fw-semibold">
                      {student.parent?.name || 'N/A'}
                      {student.parent?.phone && (
                        <span className="text-muted small ms-2">
                          <i className="bi bi-telephone me-1"></i>
                          {student.parent.phone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Tab */}
          {activeTab === 'attendance' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-calendar-check text-success me-2"></i>
                  Attendance Summary
                </h5>
                {attendanceSummary ? (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-3">
                        <div className="bg-success text-white text-center p-3 rounded">
                          <h4 className="mb-0">{attendanceSummary.present || 0}</h4>
                          <small>Present</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="bg-danger text-white text-center p-3 rounded">
                          <h4 className="mb-0">{attendanceSummary.absent || 0}</h4>
                          <small>Absent</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="bg-warning text-dark text-center p-3 rounded">
                          <h4 className="mb-0">{attendanceSummary.late || 0}</h4>
                          <small>Late</small>
                        </div>
                      </div>
                      <div className="col-3">
                        <div className="bg-info text-white text-center p-3 rounded">
                          <h4 className="mb-0">{attendanceSummary.percentage || 0}%</h4>
                          <small>Rate</small>
                        </div>
                      </div>
                    </div>
                    <div className="progress" style={{ height: '20px' }}>
                      <div
                        className="progress-bar bg-success"
                        style={{ width: `${attendanceSummary.percentage || 0}%` }}
                      >
                        {attendanceSummary.percentage || 0}% Attendance
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-calendar-check fs-1 text-muted d-block mb-2"></i>
                    <p className="text-muted">No attendance records available</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Grades Tab */}
          {activeTab === 'grades' && (
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h5 className="fw-bold mb-3">
                  <i className="bi bi-graph-up text-primary me-2"></i>
                  Grades Summary
                </h5>
                {gradesSummary ? (
                  <div>
                    <div className="row g-3 mb-4">
                      <div className="col-4">
                        <div className="bg-primary text-white text-center p-3 rounded">
                          <h4 className="mb-0">{gradesSummary.average || 0}%</h4>
                          <small>Average</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-success text-white text-center p-3 rounded">
                          <h4 className="mb-0">{gradesSummary.highest || 0}</h4>
                          <small>Highest</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="bg-danger text-white text-center p-3 rounded">
                          <h4 className="mb-0">{gradesSummary.lowest || 0}</h4>
                          <small>Lowest</small>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-graph-up fs-1 text-muted d-block mb-2"></i>
                    <p className="text-muted">No grades available yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TeacherStudentDetail
