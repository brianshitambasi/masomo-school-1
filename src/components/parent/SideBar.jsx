import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const SideBar = () => {
  const { user, setToken, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login')
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
      {/* Brand */}
      <div className="text-center mb-4">
        <i className="bi bi-mortarboard-fill text-success" style={{ fontSize: '2.5rem' }}></i>
        <h5 className="mt-2 fw-bold">Admin Panel</h5>
        <small className="text-white-50">School Management</small>
      </div>

      <hr className="border-light opacity-25" />

      {/* Navigation */}
      <ul className="nav nav-pills flex-column mb-auto">
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
      </ul>

      <hr className="border-light opacity-25" />

      {/* Logout & Version */}
      <div className="mt-auto">
        <button 
          className="btn btn-outline-danger w-100 text-start mb-2"
          onClick={handleLogout}
          style={{ borderRadius: '8px' }}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>
        <div className="small text-white-50 text-center">
          <i className="bi bi-shield-check me-1"></i>
          v1.0.0
        </div>
      </div>
    </div>
  )
}

export default SideBar