import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { API_URL } from '../../config'

const TeacherClasses = () => {
  const { token } = useContext(AuthContext)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0
  })

  useEffect(() => {
    const fetchClasses = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      }

      setLoading(true)
      try {
        // Fetch teacher's classes from the API
        const res = await axios.get(`${API_URL}/teacher/my-classes`, authHeader)
        const data = res.data || []
        setClasses(data)
        
        // Calculate stats
        let totalStudents = 0
        data.forEach(cls => {
          totalStudents += cls.students?.length || 0
        })
        
        setStats({
          totalClasses: data.length,
          totalStudents: totalStudents
        })
      } catch (error) {
        console.error('Error fetching classes:', error)
        toast.error('Failed to load classes')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchClasses()
    }
  }, [token])

  // Helper function to get student count text
  const getStudentCountText = (count) => {
    if (count === 0) return 'No students'
    if (count === 1) return '1 student'
    return `${count} students`
  }

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ My Classes</li>
        </ol>
      </nav>

      <div className="row mb-4">
        {/* Stats Cards */}
        <div className="col-md-4">
          <div className="card bg-primary text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Classes</h5>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2 className="display-4">{stats.totalClasses}</h2>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Total Students</h5>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2 className="display-4">{stats.totalStudents}</h2>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Average per Class</h5>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h2 className="display-4">
                  {stats.totalClasses > 0 
                    ? Math.round(stats.totalStudents / stats.totalClasses) 
                    : 0}
                </h2>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm">
        <div className="card-header bg-white border-0 pt-3">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-building me-2 text-primary"></i>
            My Classes
            {!loading && (
              <span className="badge bg-primary ms-2">{classes.length}</span>
            )}
          </h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading your classes...</p>
            </div>
          ) : classes.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-building fs-1 text-muted d-block mb-3"></i>
              <p className="text-muted">No classes assigned yet.</p>
              <p className="text-muted small">
                Contact your administrator to assign you to a class.
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {classes.map((cls) => (
                <div className="col-md-6 col-lg-4" key={cls._id}>
                  <div className="card h-100 shadow-sm border-0 hover-card">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title text-success fw-bold">
                          {cls.name}
                        </h5>
                        <span className="badge bg-primary">
                          {cls.gradeLevel || 'N/A'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <p className="card-text text-muted small">
                          <i className="bi bi-calendar me-1"></i>
                          Year: {cls.classYear || 'N/A'}
                        </p>
                        <p className="card-text text-muted small">
                          <i className="bi bi-people me-1"></i>
                          {getStudentCountText(cls.students?.length || 0)}
                        </p>
                      </div>

                      <div className="d-flex gap-2">
                        <Link 
                          to={`/teacher-dashboard/students?class=${cls._id}`} 
                          className="btn btn-sm btn-outline-primary flex-grow-1"
                        >
                          <i className="bi bi-people me-1"></i>
                          View Students
                        </Link>
                        <Link 
                          to={`/teacher-dashboard/attendance?class=${cls._id}`} 
                          className="btn btn-sm btn-outline-success"
                          title="Take Attendance"
                        >
                          <i className="bi bi-calendar-check"></i>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .hover-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .display-4 {
          font-size: 2.5rem;
          font-weight: 300;
        }
      `}</style>
    </div>
  )
}

export default TeacherClasses
