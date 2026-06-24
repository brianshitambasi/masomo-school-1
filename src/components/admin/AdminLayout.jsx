import React, { useState, useEffect } from 'react'
import SideBar from './SideBar'
import { Outlet, useNavigate } from 'react-router-dom'
import DashboardNavbar from '../DashboardNavbar'

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (mobile) {
        setSidebarOpen(false)
      } else {
        setSidebarOpen(true)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f4f6f9' }}>
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
        <SideBar />
      </div>

      {/* Mobile overlay */}
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
        {/* Navbar - Full Width */}
        <DashboardNavbar toggleSidebar={toggleSidebar} isMobile={isMobile} />

        {/* Main Content Area */}
        <main 
          className="p-4"
          style={{
            flex: 1,
            overflowY: 'auto',
            backgroundColor: '#f4f6f9',
            paddingTop: '20px',
            width: '100%'
          }}
        >
          <Outlet />
        </main>

        {/* Footer */}
        <footer 
          className="text-center py-3"
          style={{
            backgroundColor: 'white',
            borderTop: '1px solid #e9ecef',
            color: '#6c757d',
            fontSize: '13px',
            width: '100%'
          }}
        >
          <div className="container-fluid">
            <span>
              <i className="bi bi-mortarboard-fill text-success me-2"></i>
              Masomo School Management System © {new Date().getFullYear()}
              <span className="mx-2">|</span>
              Version 1.0.0
            </span>
          </div>
        </footer>
      </div>

      <style jsx="true">{`
        @media (max-width: 768px) {
          .sidebar-wrapper {
            width: ${sidebarOpen ? '280px' : '0px'} !important;
          }
        }
      `}</style>
    </div>
  )
}

export default AdminLayout