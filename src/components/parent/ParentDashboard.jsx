import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { API_URL } from '../../config'

const ParentDashboard = () => {
  const { token, user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState({
    children: [],
    assignments: [],
    stats: {
      totalChildren: 0,
      totalAssignments: 0,
      pendingAssignments: 0
    }
  })

  useEffect(() => {
    const fetchDashboard = async () => {
      const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
      }

      setLoading(true)
      try {
        // Fetch parent dashboard (only returns their children)
        const res = await axios.get(`${API_URL}/parent/dashboard`, authHeader)
        setDashboardData({
          children: res.data.children || [],
          assignments: res.data.assignments || [],
          stats: res.data.stats || { totalChildren: 0, totalAssignments: 0, pendingAssignments: 0 }
        })
      } catch (error) {
        console.error('Error fetching dashboard:', error)
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchDashboard()
    }
  }, [token])

  return (
    <div className="container-fluid px-4 py-3">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm" style={{ 
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', 
            borderRadius: '15px' 
          }}>
            <div className="card-body p-4">
              <h2 className="text-white fw-bold mb-2">
                <i className="bi bi-house-door-fill me-2"></i>
                Welcome, {user?.name || 'Parent'}! í±‹
              </h2>
              <p className="text-white-50 mb-0">
                <i className="bi bi-calendar3 me-2"></i>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small mb-2">My Children</h6>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h2 className="fw-bold mb-0">{dashboardData.stats.totalChildren}</h2>
                  )}
                </div>
                <div className="bg-primary bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-people-fill fs-2 text-primary"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small mb-2">Assignments</h6>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-warning" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h2 className="fw-bold mb-0">{dashboardData.stats.totalAssignments}</h2>
                  )}
                </div>
                <div className="bg-warning bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-journal-bookmark-fill fs-2 text-warning"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-uppercase text-muted fw-bold small mb-2">Pending</h6>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-danger" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h2 className="fw-bold mb-0">{dashboardData.stats.pendingAssignments}</h2>
                  )}
                </div>
                <div className="bg-danger bg-opacity-10 p-3 rounded-circle">
                  <i className="bi bi-clock-fill fs-2 text-danger"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Children List */}
      <div className="row">
        <div className="col-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-people-fill text-primary me-2"></i>
                My Children
                {!loading && (
                  <span className="badge bg-primary ms-2">{dashboardData.stats.totalChildren}</span>
                )}
              </h5>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : dashboardData.children.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                  <p className="text-muted">No children registered yet</p>
                </div>
              ) : (
                <div className="row g-4">
                  {dashboardData.children.map((child) => (
                    <div className="col-md-4 col-lg-3" key={child._id}>
                      <div className="card h-100 shadow-sm">
                        <div className="card-body text-center">
                          {child.photo ? (
                            <img 
                              src={child.photo} 
                              alt={child.name}
                              className="rounded-circle mb-2"
                              style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center mx-auto mb-2"
                                 style={{ width: '80px', height: '80px' }}>
                              <i className="bi bi-person-fill text-success" style={{ fontSize: '35px' }}></i>
                            </div>
                          )}
                          <h6 className="fw-bold">{child.name}</h6>
                          <p className="text-muted small">
                            <i className="bi bi-mortarboard me-1"></i>
                            {child.classroom?.name || 'No Class'}
                          </p>
                          <p className="text-muted small">
                            <i className="bi bi-hash me-1"></i>
                            Adm: {child.admissionNumber}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParentDashboard
