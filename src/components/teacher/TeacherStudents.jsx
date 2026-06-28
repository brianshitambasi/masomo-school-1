import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { API_URL } from '../../config'

const TeacherStudents = () => {
  const { token } = useContext(AuthContext)
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGender, setFilterGender] = useState('all')
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0
  })

  useEffect(() => {
    const fetchStudents = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      }

      setLoading(true)
      try {
        const res = await axios.get(`${API_URL}/teacher/my-students`, authHeader)
        const data = res.data || []
        setStudents(data)
        
        // Calculate stats
        const male = data.filter(s => s.gender?.toLowerCase() === 'male').length
        const female = data.filter(s => s.gender?.toLowerCase() === 'female').length
        
        setStats({
          total: data.length,
          male: male,
          female: female
        })
      } catch (error) {
        console.error('Error fetching students:', error)
        toast.error('Failed to load students')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchStudents()
    }
  }, [token])

  // Filter students based on search and gender
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGender = filterGender === 'all' || student.gender?.toLowerCase() === filterGender
    return matchesSearch && matchesGender
  })

  const getGenderBadge = (gender) => {
    if (gender?.toLowerCase() === 'male') {
      return <span className="badge bg-primary">Male</span>
    } else if (gender?.toLowerCase() === 'female') {
      return <span className="badge bg-pink">Female</span>
    }
    return <span className="badge bg-secondary">N/A</span>
  }

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ My Students</li>
        </ol>
      </nav>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-uppercase small">Total Students</h6>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h3 className="display-6">{stats.total}</h3>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-uppercase small">Male</h6>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h3 className="display-6">{stats.male}</h3>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-pink text-white shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-uppercase small">Female</h6>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h3 className="display-6">{stats.female}</h3>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white shadow-sm">
            <div className="card-body text-center">
              <h6 className="card-title text-uppercase small">Classes</h6>
              {loading ? (
                <div className="spinner-border spinner-border-sm text-white" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <h3 className="display-6">
                  {new Set(students.map(s => s.classroom?._id)).size}
                </h3>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text bg-white">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name or admission number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            disabled={loading}
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="col-md-3">
          <button
            className="btn btn-outline-success w-100"
            onClick={() => {
              setSearchTerm('')
              setFilterGender('all')
            }}
            disabled={loading}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            Reset Filters
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="card shadow-sm">
        <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
          <h5 className="fw-bold mb-0">
            <i className="bi bi-people-fill me-2 text-primary"></i>
            My Students
            {!loading && (
              <span className="badge bg-primary ms-2">{filteredStudents.length}</span>
            )}
          </h5>
          <div>
            {!loading && students.length > 0 && (
              <small className="text-muted">
                Showing {filteredStudents.length} of {students.length} students
              </small>
            )}
          </div>
        </div>
        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading your students...</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-people fs-1 text-muted d-block mb-3"></i>
              {students.length === 0 ? (
                <>
                  <p className="text-muted">No students assigned yet.</p>
                  <p className="text-muted small">
                    Students will appear here once they are added to your classes.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted">No students match your filters.</p>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => {
                      setSearchTerm('')
                      setFilterGender('all')
                    }}
                  >
                    <i className="bi bi-arrow-counterclockwise me-1"></i>
                    Clear Filters
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover mb-0">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Admission No</th>
                    <th>Gender</th>
                    <th>Class</th>
                    <th>Parent</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>
                        {student.photo ? (
                          <img
                            src={student.photo}
                            alt={student.name}
                            className="rounded-circle"
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div
                            className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '40px' }}
                          >
                            <i className="bi bi-person-fill text-secondary"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        <strong>{student.name}</strong>
                      </td>
                      <td>{student.admissionNumber || 'N/A'}</td>
                      <td>{getGenderBadge(student.gender)}</td>
                      <td>
                        <span className="badge bg-info">
                          {student.classroom?.name || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <small className="text-muted">
                          {student.parent?.name || 'N/A'}
                        </small>
                      </td>
                      <td>
                        <Link
                          to={`/teacher-dashboard/student/${student._id}`}
                          className="btn btn-sm btn-outline-primary me-1"
                          title="View Profile"
                        >
                          <i className="bi bi-eye"></i>
                        </Link>
                        <Link
                          to={`/teacher-dashboard/grades?student=${student._id}`}
                          className="btn btn-sm btn-outline-success"
                          title="View Grades"
                        >
                          <i className="bi bi-graph-up"></i>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style jsx="true">{`
        .bg-pink {
          background-color: #d63384;
          color: white;
        }
        .display-6 {
          font-size: 2rem;
          font-weight: 300;
        }
        .table td {
          vertical-align: middle;
        }
      `}</style>
    </div>
  )
}

export default TeacherStudents
