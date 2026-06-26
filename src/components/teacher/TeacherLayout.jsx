import React, { useState, useEffect, useContext } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import TeacherSideBar from './TeacherSideBar'

const TeacherLayout = () => {
  const { user, setToken, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) setSidebarOpen(false)
      else setSidebarOpen(true)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const handleLogout = () => {
    toast.info('Logging out...')
    setTimeout(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setToken(null)
      setUser(null)
      toast.success('Logged out successfully')
      navigate('/login')
    }, 500)
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6f9' }}>
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Sidebar */}
      <div 
        style={{
          position: isMobile ? 'fixed' : 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          zIndex: 1000,
          width: sidebarOpen ? '250px' : '0px',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
          backgroundColor: '#1a1a2e'
        }}
      >
        <TeacherSideBar />
      </div>

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 999,
            cursor: 'pointer'
          }}
          onClick={toggleSidebar}
        />
      )}

      {/* Main Content */}
      <div 
        className="flex-grow-1"
        style={{
          marginLeft: isMobile ? 0 : (sidebarOpen ? '250px' : '0px'),
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          width: '100%'
        }}
      >
        {/* Navbar */}
        <nav className="navbar navbar-expand-lg bg-white shadow-sm" style={{ 
          padding: '0 24px',
          borderBottom: '1px solid #e9ecef',
          height: '64px',
          width: '100%',
          position: 'sticky',
          top: 0,
          zIndex: 999,
          background: 'white'
        }}>
          <div className="container-fluid px-0">
            <div className="d-flex align-items-center">
              <button 
                className="btn btn-outline-secondary me-3" 
                onClick={toggleSidebar}
                style={{ border: 'none', fontSize: '1.2rem', padding: '6px 10px', borderRadius: '8px', color: '#495057', background: '#f8f9fa' }}
              >
                <i className={`bi ${isMobile ? 'bi-list' : 'bi-chevron-left'}`}></i>
              </button>
              <Link to="/teacher-dashboard" className="navbar-brand fw-bold">
                <span className="text-success">Masomo</span> <span className="text-secondary">Teacher</span>
              </Link>
            </div>
            <div className="d-flex align-items-center">
              <div className="dropdown">
                <button 
                  className="dropdown-toggle d-flex align-items-center text-decoration-none btn btn-link" 
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  style={{ textDecoration: 'none', color: 'inherit', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <div className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2" 
                       style={{ width: '34px', height: '34px', fontSize: '13px', fontWeight: 'bold', color: 'white' }}>
                    {user?.name?.charAt(0)?.toUpperCase() || 'T'}
                  </div>
                  <div className="d-none d-md-block">
                    <div className="fw-bold small" style={{ fontSize: '13px' }}>{user?.name || 'Teacher'}</div>
                    <small className="text-muted" style={{ fontSize: '10px' }}>
                      <i className="bi bi-shield-check me-1 text-success"></i>Teacher
                    </small>
                  </div>
                </button>
                <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2" style={{ borderRadius: '10px', minWidth: '200px' }}>
                  <li><Link to="/teacher-dashboard/profile" className="dropdown-item py-2"><i className="bi bi-person me-2 text-primary"></i>Profile</Link></li>
                  <li><hr className="dropdown-divider my-1" /></li>
                  <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="p-4" style={{ flex: 1, overflowY: 'auto', backgroundColor: '#f4f6f9', paddingTop: '20px', width: '100%' }}>
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="text-center py-3" style={{ backgroundColor: 'white', borderTop: '1px solid #e9ecef', color: '#6c757d', fontSize: '13px', width: '100%' }}>
          <div className="container-fluid">
            <span>
              <i className="bi bi-mortarboard-fill text-success me-2"></i>
              Masomo School Management System © {new Date().getFullYear()}
              <span className="mx-2">|</span>Teacher Portal v1.0.0
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default TeacherLayout
