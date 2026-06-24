import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const TeacherDashboard = () => {
  const { token, user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalStudents: 0, totalClasses: 0, totalAssignments: 0 })
  const API_URL = 'https://schools-gngz.onrender.com'
  const authHeader = { headers: { Authorization: `Bearer ${token}` } }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, classesRes, assignmentsRes] = await Promise.all([
          axios.get(`${API_URL}/student`, authHeader),
          axios.get(`${API_URL}/classroom`, authHeader),
          axios.get(`${API_URL}/assignment`, authHeader)
        ])
        setStats({
          totalStudents: studentsRes.data?.length || 0,
          totalClasses: classesRes.data?.length || 0,
          totalAssignments: assignmentsRes.data?.length || 0
        })
      } catch (error) {
        toast.error('Failed to load dashboard data')
      } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const quickActions = [
    { title: 'Take Attendance', icon: 'bi-calendar-check', link: '/teacher-dashboard/attendance', color: 'primary' },
    { title: 'Add Assignment', icon: 'bi-plus-circle', link: '/teacher-dashboard/assignments/add', color: 'success' },
    { title: 'View Students', icon: 'bi-people', link: '/teacher-dashboard/students', color: 'info' },
    { title: 'My Classes', icon: 'bi-building', link: '/teacher-dashboard/classes', color: 'warning' },
  ]

  return (
    <div className="container-fluid px-4 py-3">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', borderRadius: '15px' }}>
            <div className="card-body p-4">
              <h2 className="text-white fw-bold mb-2"><i className="bi bi-house-door-fill me-2"></i>Welcome, {user?.name || 'Teacher'}! í±‹</h2>
              <p className="text-white-50 mb-0"><i className="bi bi-calendar3 me-2"></i>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-md-4"><div className="card border-0 shadow-sm h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-start"><div><h6 className="text-uppercase text-muted fw-bold small mb-2">Students</h6>{loading ? <div className="spinner-border spinner-border-sm text-primary" role="status"><span className="visually-hidden">Loading...</span></div> : <h2 className="fw-bold mb-0">{stats.totalStudents}</h2>}</div><div className="bg-primary bg-opacity-10 p-3 rounded-circle"><i className="bi bi-people-fill fs-2 text-primary"></i></div></div></div></div></div>
        <div className="col-md-4"><div className="card border-0 shadow-sm h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-start"><div><h6 className="text-uppercase text-muted fw-bold small mb-2">Classes</h6>{loading ? <div className="spinner-border spinner-border-sm text-warning" role="status"><span className="visually-hidden">Loading...</span></div> : <h2 className="fw-bold mb-0">{stats.totalClasses}</h2>}</div><div className="bg-warning bg-opacity-10 p-3 rounded-circle"><i className="bi bi-building fs-2 text-warning"></i></div></div></div></div></div>
        <div className="col-md-4"><div className="card border-0 shadow-sm h-100"><div className="card-body p-4"><div className="d-flex justify-content-between align-items-start"><div><h6 className="text-uppercase text-muted fw-bold small mb-2">Assignments</h6>{loading ? <div className="spinner-border spinner-border-sm text-success" role="status"><span className="visually-hidden">Loading...</span></div> : <h2 className="fw-bold mb-0">{stats.totalAssignments}</h2>}</div><div className="bg-success bg-opacity-10 p-3 rounded-circle"><i className="bi bi-journal-bookmark-fill fs-2 text-success"></i></div></div></div></div></div>
      </div>
      <div className="row g-4"><div className="col-12"><div className="card border-0 shadow-sm"><div className="card-body p-4"><h5 className="fw-bold mb-3"><i className="bi bi-lightning-fill text-warning me-2"></i>Quick Actions</h5><div className="row g-3">{quickActions.map((action, index) => (<div className="col-md-3 col-6" key={index}><Link to={action.link} className="text-decoration-none"><div className="p-3 rounded-3 text-center border" style={{ backgroundColor: '#f8f9fa', cursor: 'pointer', transition: 'all 0.3s' }}><i className={`bi ${action.icon} fs-2 text-${action.color} d-block mb-2`}></i><span className="small fw-semibold">{action.title}</span></div></Link></div>))}</div></div></div></div></div>
    </div>
  )
}
export default TeacherDashboard
