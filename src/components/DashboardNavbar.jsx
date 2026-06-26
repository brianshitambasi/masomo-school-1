import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast } from 'react-toastify'

const DashboardNavbar = ({ toggleSidebar, isMobile }) => {
  const { user, setToken, setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)

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

  const notifications = [
    { id: 1, message: 'New student enrolled', time: '2 min ago', type: 'success' },
    { id: 2, message: 'Teacher John Doe added', time: '15 min ago', type: 'info' },
    { id: 3, message: 'New parent registered', time: '1 hour ago', type: 'warning' },
  ]

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
              background: '#f8f9fa',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#e9ecef'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#f8f9fa'}
          >
            <i className={`bi ${isMobile ? 'bi-list' : 'bi-chevron-left'}`}></i>
          </button>

          <Link 
            to="/admin-dashboard" 
            className="navbar-brand fw-bold d-flex align-items-center"
            style={{ color: '#2c3e50', fontSize: '1.1rem' }}
          >
            <div className="bg-success rounded-circle d-flex align-items-center justify-content-center me-2" 
                 style={{ width: '34px', height: '34px' }}>
              <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '16px' }}></i>
            </div>
            <span className="d-none d-sm-inline">
              <span className="text-success">Masomo</span> <span className="text-secondary">School</span>
            </span>
            <span className="badge bg-success ms-2 d-none d-md-inline">Admin</span>
          </Link>
        </div>

        <div className="d-flex align-items-center">
          <div className="d-none d-lg-block me-3">
            <div className="position-relative">
              <input 
                type="text" 
                className="form-control form-control-sm" 
                placeholder="Search..."
                style={{ 
                  borderRadius: '20px', 
                  paddingLeft: '32px',
                  paddingRight: '15px',
                  width: '200px',
                  border: '1px solid #e9ecef',
                  height: '34px',
                  fontSize: '13px'
                }}
              />
              <i className="bi bi-search position-absolute" 
                 style={{ 
                   left: '10px', 
                   top: '50%', 
                   transform: 'translateY(-50%)',
                   color: '#adb5bd',
                   fontSize: '14px'
                 }}>
              </i>
            </div>
          </div>

          <div className="position-relative me-2">
            <button 
              className="btn btn-light btn-sm position-relative"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ 
                borderRadius: '8px',
                padding: '6px 10px',
                background: '#f8f9fa',
                border: '1px solid #e9ecef'
              }}
            >
              <i className="bi bi-bell" style={{ fontSize: '18px' }}></i>
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" 
                    style={{ fontSize: '9px', padding: '2px 6px' }}>
                {notifications.length}
              </span>
            </button>

            {showNotifications && (
              <div className="position-absolute end-0 mt-2 shadow-lg rounded" 
                   style={{ 
                     width: '300px', 
                     background: 'white', 
                     zIndex: 1000,
                     top: '100%',
                     right: 0,
                     borderRadius: '10px',
                     boxShadow: '0 10px 40px rgba(0,0,0,0.15)'
                   }}>
                <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
                  <h6 className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
                    <i className="bi bi-bell me-2 text-success"></i>
                    Notifications
                  </h6>
                  <small className="text-muted" style={{ cursor: 'pointer', fontSize: '11px' }}>
                    Mark all read
                  </small>
                </div>
                <div className="p-2" style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {notifications.map((notif) => (
                    <div key={notif.id} className="dropdown-item px-3 py-2 rounded" 
                         style={{ cursor: 'pointer' }}>
                      <div className="d-flex align-items-start">
                        <div className={`bg-${notif.type} bg-opacity-10 p-2 rounded-circle me-2`}>
                          <i className={`bi bi-circle-fill text-${notif.type}`} style={{ fontSize: '6px' }}></i>
                        </div>
                        <div className="flex-grow-1">
                          <p className="mb-0 small">{notif.message}</p>
                          <small className="text-muted" style={{ fontSize: '10px' }}>{notif.time}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-2 text-center border-top">
                  <Link to="/admin-dashboard/notifications" className="small text-success text-decoration-none">
                    View all notifications
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ✅ FIXED: Replaced <a> with <button> */}
          <div className="dropdown">
            <button 
              className="dropdown-toggle d-flex align-items-center text-decoration-none" 
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'inherit', 
                cursor: 'pointer',
                padding: '4px 8px',
                borderRadius: '8px'
              }}
            >
              <div 
                className="rounded-circle bg-gradient d-flex align-items-center justify-content-center me-2"
                style={{ 
                  width: '34px', 
                  height: '34px', 
                  fontSize: '13px', 
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #28a745, #20c997)',
                  color: 'white'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="d-none d-md-block">
                <div className="fw-bold small" style={{ lineHeight: '1.2', fontSize: '13px' }}>
                  {user?.name || 'Admin'}
                </div>
                <small className="text-muted" style={{ fontSize: '10px', textTransform: 'capitalize' }}>
                  <i className="bi bi-shield-check me-1 text-success"></i>
                  {user?.role || 'Admin'}
                </small>
              </div>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 py-2" 
                style={{ borderRadius: '10px', minWidth: '200px' }}>
              <li>
                <div className="dropdown-item-text border-bottom pb-2">
                  <div className="fw-bold" style={{ fontSize: '14px' }}>{user?.name || 'Admin'}</div>
                  <small className="text-muted" style={{ fontSize: '12px' }}>{user?.email || 'admin@school.com'}</small>
                </div>
              </li>
              <li>
                <Link to="/admin-dashboard/profile" className="dropdown-item py-2" style={{ fontSize: '13px' }}>
                  <i className="bi bi-person me-2 text-primary"></i>My Profile
                </Link>
              </li>
              <li>
                <Link to="/admin-dashboard/settings" className="dropdown-item py-2" style={{ fontSize: '13px' }}>
                  <i className="bi bi-gear me-2 text-secondary"></i>Settings
                </Link>
              </li>
              <li><hr className="dropdown-divider my-1" /></li>
              <li>
                <button className="dropdown-item py-2 text-danger" onClick={handleLogout} style={{ fontSize: '13px' }}>
                  <i className="bi bi-box-arrow-right me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>

          <button 
            className="navbar-toggler border-0 ms-2 d-lg-none" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            style={{ padding: '4px 8px' }}
          >
            <span className="navbar-toggler-icon" style={{ fontSize: '14px' }}></span>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default DashboardNavbar
