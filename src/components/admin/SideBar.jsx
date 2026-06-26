import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const SideBar = () => {
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
    <div 
      className="d-flex flex-column p-3 vh-100"
      style={{
        width: '100%',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: 'white',
        overflowY: 'auto'
      }}
    >
      {/* Brand / Logo */}
      <div className="text-center mb-4 pb-2 border-bottom border-secondary">
        <div className="bg-success rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" 
             style={{ width: '50px', height: '50px' }}>
          <i className="bi bi-mortarboard-fill text-white" style={{ fontSize: '24px' }}></i>
        </div>
        <h5 className="fw-bold mb-0">Masomo School</h5>
        <small className="text-white-50">Admin Panel</small>
      </div>

      {/* User Info */}
      <div className="d-flex align-items-center mb-3 p-2 rounded" 
           style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div 
          className="rounded-circle bg-success d-flex align-items-center justify-content-center me-2"
          style={{ width: '35px', height: '35px', fontSize: '14px', fontWeight: 'bold' }}
        >
          {user?.name?.charAt(0)?.toUpperCase() || 'A'}
        </div>
        <div className="flex-grow-1">
          <div className="fw-bold small">{user?.name || 'Admin'}</div>
          <small className="text-white-50" style={{ fontSize: '10px' }}>
            <i className="bi bi-shield-check me-1"></i>
            {user?.role || 'Admin'}
          </small>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow-1">
        <ul className="nav nav-pills flex-column">
          {/* Dashboard */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard' 
              end 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-grid me-2'></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Students */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/students' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-people-fill me-2'></i>
              <span>Students</span>
            </NavLink>
          </li>

          {/* Parents */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/parents' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-person-lines-fill me-2'></i>
              <span>Parents</span>
            </NavLink>
          </li>

          {/* Teachers */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/teachers' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-person-badge me-2'></i>
              <span>Teachers</span>
            </NavLink>
          </li>

          {/* Classes */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/classes' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-building me-2'></i>
              <span>Classes</span>
            </NavLink>
          </li>

          {/* Assignments */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/assignments' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-journal-bookmark-fill me-2'></i>
              <span>Assignments</span>
            </NavLink>
          </li>

          {/* Attendance */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/attendance' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-calendar-check-fill me-2'></i>
              <span>Attendance</span>
            </NavLink>
          </li>

          {/* Messages */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/messages' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-envelope-fill me-2'></i>
              <span>Messages</span>
            </NavLink>
          </li>

          {/* Notifications */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/notifications' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-bell-fill me-2'></i>
              <span>Notifications</span>
            </NavLink>
          </li>

          {/* Profile */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/profile' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-person-fill me-2'></i>
              <span>Profile</span>
            </NavLink>
          </li>

          {/* Settings */}
          <li className="nav-item mb-2">
            <NavLink 
              to='/admin-dashboard/settings' 
              className={({ isActive }) => 
                isActive ? 'nav-link bg-success text-light fw-bold rounded-3' : 'nav-link text-light rounded-3'
              }
            >
              <i className='bi bi-gear me-2'></i>
              <span>Settings</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="mt-auto">
        <hr className="border-secondary opacity-25" />
        
        {/* Logout Button */}
        <button 
          className="btn btn-outline-danger w-100 text-start mb-2"
          onClick={handleLogout}
          style={{ borderRadius: '8px', padding: '10px 15px' }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>

        {/* Version */}
        <div className="text-center">
          <small className="text-white-50" style={{ fontSize: '10px' }}>
            <i className="bi bi-code me-1"></i>
            v1.0.0
          </small>
        </div>
      </div>

      {/* Custom Scrollbar */}
      <style jsx="true">{`
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.2);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.3);
        }
        .nav-link {
          transition: all 0.3s ease;
        }
        .nav-link:hover:not(.bg-success) {
          background: rgba(255,255,255,0.08);
          transform: translateX(5px);
        }
        .nav-link.bg-success {
          background: linear-gradient(135deg, #28a745, #20c997) !important;
          box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
        }
      `}</style>
    </div>
  )
}

export default SideBar
