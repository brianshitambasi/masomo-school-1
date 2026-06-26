import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'
import NotificationDropdown from './NotificationDropdown' // ✅ ADD THIS

const DashboardNavbar = ({ toggleSidebar, isMobile }) => {
  const { user, setToken, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

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
    <nav 
      className="navbar navbar-expand-lg bg-white shadow-sm"
      style={{ 
        padding: '0 24px',
        borderBottom: '1px solid #e9ecef',
        height: '64px',
        width: '100%',
        position: 'sticky',
        top: 0,
        zIndex: 999,
        background: 'white'
      }}
    >
      <div className="container-fluid px-0">
        <div className="d-flex align-items-center">
          <button 
            className="btn btn-outline-secondary me-3" 
            onClick={toggleSidebar}
            style={{ 
              border: 'none',
              fontSize: '1.2rem',
              padding: '6px 10px',
              borderRadius: '8px',
              color: '#495057',
              background: '#f8f9fa'
            }}
          >
            <i className={`bi ${isMobile ? 'bi-list' : 'bi-chevron-left'}`}></i>
          </button>

          <Link to="/admin-dashboard" className="navbar-brand fw-bold">
            <span className="text-success">Masomo</span> <span className="text-secondary">School</span>
          </Link>
        </div>

        <div className="d-flex align-items-center">
          {/* ✅ REPLACE OLD NOTIFICATION BELL WITH DROPDOWN */}
          <NotificationDropdown />
          
          <div className="dropdown ms-3">
            <button 
              className="dropdown-toggle d-flex align-items-center btn btn-link text-decoration-none" 
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ color: 'inherit' }}
            >
              <div 
                className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2"
                style={{ width: '34px', height: '34px', color: 'white', fontSize: '13px', fontWeight: 'bold' }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="d-none d-md-block">
                <div className="fw-bold small">{user?.name || 'Admin'}</div>
                <small className="text-muted" style={{ fontSize: '10px' }}>
                  <i className="bi bi-shield-check me-1 text-success"></i>
                  {user?.role || 'Admin'}
                </small>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2">
              <li><Link to="/admin-dashboard/profile" className="dropdown-item py-2"><i className="bi bi-person me-2"></i>Profile</Link></li>
              <li><Link to="/admin-dashboard/settings" className="dropdown-item py-2"><i className="bi bi-gear me-2"></i>Settings</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item py-2 text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
