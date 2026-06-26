import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const ParentDashboard = () => {
  const { token, user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalAssignments: 0,
    pendingAssignments: 0
  })
  const API_URL = 'https://schools-gngz.onrender.com'

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` }
  }

  // FIXED: added authHeader and user to dependencies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, assignmentsRes] = await Promise.all([
          axios.get(`${API_URL}/student`, authHeader),
          axios.get(`${API_URL}/assignment`, authHeader)
        ])
        const children = studentsRes.data?.filter(s => s.parent === user?.id) || []
        const assignments = assignmentsRes.data || []
        setStats({
          totalChildren: children.length,
          totalAssignments: assignments.length,
          pendingAssignments: assignments.filter(a => !a.completed).length
        })
      } catch (error) {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [authHeader, user]) // ✅ Added dependencies

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
                Welcome, {user?.name || 'Parent'}! .
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
                  <h6 className="text-uppercase text-muted fw-bold small mb-2">Children</h6>
                  {loading ? (
                    <div className="spinner-border spinner-border-sm text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  ) : (
                    <h2 className="fw-bold mb-0">{stats.totalChildren}</h2>
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
                    <h2 className="fw-bold mb-0">{stats.totalAssignments}</h2>
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
                    <h2 className="fw-bold mb-0">{stats.pendingAssignments}</h2>
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
    </div>
  )
}

export default ParentDashboard
