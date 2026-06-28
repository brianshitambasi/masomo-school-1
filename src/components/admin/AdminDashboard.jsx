import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { API_URL } from '../../config'

const AdminDashboard = () => {
    const { token, user } = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const [dashboardData, setDashboardData] = useState({
        teachers: [],
        students: [],
        parents: [],
        classrooms: [],
        stats: {
            totalTeachers: 0,
            totalStudents: 0,
            totalParents: 0,
            totalClassrooms: 0,
            totalStudentsInClasses: 0,
            teachersWithoutClass: 0,
            classesWithoutTeacher: 0
        }
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true)
            try {
                const authHeader = {
                    headers: { Authorization: `Bearer ${token}` }
                }

                // Fetch all data in parallel with error handling for each
                const [teachersRes, studentsRes, parentsRes, classroomsRes] = await Promise.all([
                    axios.get(`${API_URL}/teacher`, authHeader).catch(err => ({ data: [] })),
                    axios.get(`${API_URL}/student`, authHeader).catch(err => ({ data: [] })),
                    axios.get(`${API_URL}/parent`, authHeader).catch(err => ({ data: [] })),
                    axios.get(`${API_URL}/classroom`, authHeader).catch(err => ({ data: [] }))
                ])

                const teachers = teachersRes.data || []
                const students = studentsRes.data || []
                const parents = parentsRes.data || []
                const classrooms = classroomsRes.data || []

                const totalStudentsInClasses = classrooms.reduce((acc, cls) => {
                    return acc + (cls.students?.length || 0)
                }, 0)

                const teachersWithClass = classrooms.filter(cls => cls.teacher).length
                const teachersWithoutClass = teachers.length - teachersWithClass
                const classesWithoutTeacher = classrooms.filter(cls => !cls.teacher).length

                setDashboardData({
                    teachers,
                    students,
                    parents,
                    classrooms,
                    stats: {
                        totalTeachers: teachers.length,
                        totalStudents: students.length,
                        totalParents: parents.length,
                        totalClassrooms: classrooms.length,
                        totalStudentsInClasses,
                        teachersWithoutClass: teachersWithoutClass > 0 ? teachersWithoutClass : 0,
                        classesWithoutTeacher
                    }
                })

            } catch (error) {
                console.error('Error fetching dashboard data:', error)
                toast.error('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }
        fetchDashboardData()
    }, [token])

    const dashboardCards = [
        {
            id: 1,
            title: 'Teachers',
            count: dashboardData.stats.totalTeachers,
            icon: 'bi-person-badge',
            color: 'primary',
            bgColor: '#e3f2fd',
            link: '/admin-dashboard/teachers',
            description: 'Total teachers in school',
            subInfo: `${dashboardData.stats.teachersWithoutClass} without class`
        },
        {
            id: 2,
            title: 'Students',
            count: dashboardData.stats.totalStudents,
            icon: 'bi-people-fill',
            color: 'success',
            bgColor: '#e8f5e9',
            link: '/admin-dashboard/students',
            description: 'Total students enrolled',
            subInfo: `${dashboardData.stats.totalStudentsInClasses} in classes`
        },
        {
            id: 3,
            title: 'Parents',
            count: dashboardData.stats.totalParents,
            icon: 'bi-person-lines-fill',
            color: 'warning',
            bgColor: '#fff3e0',
            link: '/admin-dashboard/parents',
            description: 'Total parents registered'
        },
        {
            id: 4,
            title: 'Classes',
            count: dashboardData.stats.totalClassrooms,
            icon: 'bi-building',
            color: 'info',
            bgColor: '#e1f5fe',
            link: '/admin-dashboard/classes',
            description: 'Total classes available',
            subInfo: `${dashboardData.stats.classesWithoutTeacher} without teacher`
        }
    ]

    const quickActions = [
        { id: 1, title: 'Add Student', icon: 'bi-person-plus', link: '/admin-dashboard/students/add', color: 'success' },
        { id: 2, title: 'Add Teacher', icon: 'bi-person-badge', link: '/admin-dashboard/teachers/add', color: 'primary' },
        { id: 3, title: 'Add Parent', icon: 'bi-person-add', link: '/admin-dashboard/parents/add', color: 'warning' },
        { id: 4, title: 'Add Class', icon: 'bi-building-add', link: '/admin-dashboard/classes/add', color: 'info' }
    ]

    return (
        <div className="container-fluid px-4 py-3">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Welcome Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                        borderRadius: '15px'
                    }}>
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h2 className="text-white fw-bold mb-2">
                                        <i className="bi bi-house-door-fill me-2"></i>
                                        Welcome back, {user?.name || 'Admin'}! í±‹
                                    </h2>
                                    <p className="text-white-50 mb-0">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        {new Date().toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                        <span className="mx-2">â€¢</span>
                                        <i className="bi bi-clock me-1"></i>
                                        {new Date().toLocaleTimeString('en-US', { 
                                            hour: '2-digit', 
                                            minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                                <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                    <button 
                                        className="btn btn-light btn-sm px-4"
                                        onClick={() => window.location.reload()}
                                        disabled={loading}
                                    >
                                        <i className={`bi ${loading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'} me-1`}></i>
                                        {loading ? 'Loading...' : 'Refresh'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="row g-4 mb-4">
                {dashboardCards.map((card) => (
                    <div className="col-xl-3 col-lg-6 col-md-6" key={card.id}>
                        <Link to={card.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100 transition-card">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="flex-grow-1">
                                            <h6 className="text-uppercase text-muted fw-bold small mb-2">
                                                {card.title}
                                            </h6>
                                            {loading ? (
                                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                                    <span className="visually-hidden">Loading...</span>
                                                </div>
                                            ) : (
                                                <>
                                                    <h2 className="fw-bold mb-1 display-6">{card.count}</h2>
                                                    <small className="text-muted d-block">{card.description}</small>
                                                    {card.subInfo && (
                                                        <span className="badge bg-primary bg-opacity-10 text-primary mt-1">
                                                            {card.subInfo}
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                        <div className="rounded-circle d-flex align-items-center justify-content-center"
                                             style={{ 
                                                 width: '55px', 
                                                 height: '55px', 
                                                 backgroundColor: card.bgColor,
                                                 flexShrink: 0
                                             }}>
                                            <i className={`bi ${card.icon} fs-3 text-${card.color}`}></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="row g-4">
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pt-3">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-lightning-fill text-warning me-2"></i>
                                Quick Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                {quickActions.map((action) => (
                                    <div className="col-6" key={action.id}>
                                        <Link to={action.link} className="text-decoration-none">
                                            <div className="p-3 rounded-3 text-center border transition-action"
                                                 style={{ 
                                                     backgroundColor: '#f8f9fa',
                                                     cursor: 'pointer',
                                                     transition: 'all 0.3s'
                                                 }}>
                                                <i className={`bi ${action.icon} fs-2 text-${action.color} d-block mb-2`}></i>
                                                <span className="small fw-semibold">{action.title}</span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pt-3">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-clock-history text-info me-2"></i>
                                Recent Activity
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="text-center py-4">
                                <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                <p className="text-muted">No recent activities</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="row mt-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-3">
                            <p className="text-muted small mb-0">
                                <i className="bi bi-shield-check text-success me-1"></i>
                                Logged in as <strong className="text-primary">{user?.role || 'Admin'}</strong>
                                <span className="mx-2">â€¢</span>
                                <i className="bi bi-database me-1"></i>
                                Data last updated: {new Date().toLocaleString()}
                                {loading && <i className="bi bi-arrow-repeat spin ms-2"></i>}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .hover-shadow:hover {
                    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
                    transform: translateY(-5px);
                }
                .transition {
                    transition: all 0.3s ease;
                }
                .card {
                    border-radius: 12px !important;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
            `}</style>
        </div>
    )
}

export default AdminDashboard
