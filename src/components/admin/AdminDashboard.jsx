import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

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
        },
        recentActivities: []
    })

    const API_URL = 'https://schools-gngz.onrender.com'

    const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const fetchDashboardData = async () => {
        setLoading(true)
        try {
            const [teachersRes, studentsRes, parentsRes, classroomsRes] = await Promise.all([
                axios.get(`${API_URL}/teacher`, authHeader),
                axios.get(`${API_URL}/student`, authHeader),
                axios.get(`${API_URL}/parent`, authHeader),
                axios.get(`${API_URL}/classroom`, authHeader)
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

            const recentActivities = generateRecentActivities(teachers, students, parents, classrooms)

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
                },
                recentActivities
            })

        } catch (error) {
            console.error('Error fetching dashboard data:', error)
            toast.error('Failed to load dashboard data')
        } finally {
            setLoading(false)
        }
    }

    const generateRecentActivities = (teachers, students, parents, classrooms) => {
        const activities = []

        const latestTeachers = [...teachers]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
        
        latestTeachers.forEach(teacher => {
            activities.push({
                id: `teacher-${teacher._id}`,
                action: `New teacher registered: ${teacher.name}`,
                time: formatTimeAgo(teacher.createdAt),
                icon: 'bi-person-badge',
                color: 'primary',
                type: 'teacher'
            })
        })

        const latestStudents = [...students]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
        
        latestStudents.forEach(student => {
            activities.push({
                id: `student-${student._id}`,
                action: `New student enrolled: ${student.name}`,
                time: formatTimeAgo(student.createdAt),
                icon: 'bi-person-plus',
                color: 'success',
                type: 'student'
            })
        })

        const latestParents = [...parents]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
        
        latestParents.forEach(parent => {
            activities.push({
                id: `parent-${parent._id}`,
                action: `New parent registered: ${parent.name}`,
                time: formatTimeAgo(parent.createdAt),
                icon: 'bi-person-add',
                color: 'warning',
                type: 'parent'
            })
        })

        const latestClassrooms = [...classrooms]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 2)
        
        latestClassrooms.forEach(cls => {
            activities.push({
                id: `classroom-${cls._id}`,
                action: `New class created: ${cls.name}`,
                time: formatTimeAgo(cls.createdAt),
                icon: 'bi-building-add',
                color: 'info',
                type: 'classroom'
            })
        })

        return activities
            .sort((a, b) => {
                const timeA = parseTimeAgo(a.time)
                const timeB = parseTimeAgo(b.time)
                return timeA - timeB
            })
            .slice(0, 6)
    }

    const formatTimeAgo = (dateString) => {
        if (!dateString) return 'Just now'
        
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now - date
        const diffSec = Math.floor(diffMs / 1000)
        const diffMin = Math.floor(diffSec / 60)
        const diffHour = Math.floor(diffMin / 60)
        const diffDay = Math.floor(diffHour / 24)

        if (diffSec < 60) return 'Just now'
        if (diffMin < 60) return `${diffMin}m ago`
        if (diffHour < 24) return `${diffHour}h ago`
        if (diffDay < 30) return `${diffDay}d ago`
        return `${diffDay}d ago`
    }

    const parseTimeAgo = (timeString) => {
        if (timeString === 'Just now') return Date.now()
        const match = timeString.match(/(\d+)([mhd])/)
        if (match) {
            const value = parseInt(match[1])
            const unit = match[2]
            const units = { 'm': 60 * 1000, 'h': 60 * 60 * 1000, 'd': 24 * 60 * 60 * 1000 }
            return Date.now() - (value * (units[unit] || 0))
        }
        return Date.now()
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

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
        { id: 4, title: 'Add Class', icon: 'bi-building-add', link: '/admin-dashboard/classes/add', color: 'info' },
    ]

    return (
        <div className="container-fluid px-4">
            <ToastContainer position="top-right" autoClose={3000} />

            {/* Welcome Section */}
            <div className="row mb-4">
                <div className="col-12">
                    <div className="card border-0 shadow-sm" style={{
                        background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
                        borderRadius: '15px',
                        border: 'none'
                    }}>
                        <div className="card-body p-4">
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <h2 className="text-white fw-bold mb-2">
                                        <i className="bi bi-house-door-fill me-2"></i>
                                        Welcome back, {user?.name || 'Admin'}! 👋
                                    </h2>
                                    <p className="text-white-50 mb-0">
                                        <i className="bi bi-calendar3 me-2"></i>
                                        {new Date().toLocaleDateString('en-US', { 
                                            weekday: 'long', 
                                            year: 'numeric', 
                                            month: 'long', 
                                            day: 'numeric' 
                                        })}
                                        <span className="mx-2">•</span>
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
                                        onClick={fetchDashboardData}
                                        disabled={loading}
                                    >
                                        <i className={`bi ${loading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'} me-1`}></i>
                                        Refresh
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - 4 in a row */}
            <div className="row g-4 mb-4">
                {dashboardCards.map((card) => (
                    <div className="col-xl-3 col-lg-6 col-md-6" key={card.id}>
                        <Link to={card.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100 transition">
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
                                                    <h2 className="fw-bold mb-1">{card.count}</h2>
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

            {/* Quick Actions & Recent Activity - 2 columns */}
            <div className="row g-4 mb-4">
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
                                            <div className="p-3 rounded-3 text-center border hover-shadow transition"
                                                 style={{ 
                                                     backgroundColor: '#f8f9fa',
                                                     cursor: 'pointer',
                                                     transition: 'all 0.3s'
                                                 }}
                                                 onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e9ecef'}
                                                 onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}>
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

                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white border-0 pt-3 d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-clock-history text-info me-2"></i>
                                Recent Activity
                            </h5>
                            <small className="text-muted">
                                {loading ? 'Loading...' : `${dashboardData.recentActivities.length} activities`}
                            </small>
                        </div>
                        <div className="card-body">
                            {loading ? (
                                <div className="text-center py-4">
                                    <div className="spinner-border text-info" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : dashboardData.recentActivities.length === 0 ? (
                                <div className="text-center py-4">
                                    <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                                    <p className="text-muted">No recent activities</p>
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {dashboardData.recentActivities.map((activity) => (
                                        <div className="list-group-item border-0 px-0 py-2 d-flex align-items-center" key={activity.id}>
                                            <div className={`bg-${activity.color} bg-opacity-10 p-2 rounded-circle me-3`}>
                                                <i className={`bi ${activity.icon} text-${activity.color}`}></i>
                                            </div>
                                            <div className="flex-grow-1">
                                                <p className="mb-0 small fw-semibold">{activity.action}</p>
                                                <small className="text-muted">{activity.time}</small>
                                            </div>
                                            <span className={`badge bg-${activity.color} bg-opacity-10 text-${activity.color} text-capitalize`}>
                                                {activity.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="row">
                <div className="col-12">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body text-center py-3">
                            <p className="text-muted small mb-0">
                                <i className="bi bi-shield-check text-success me-1"></i>
                                Logged in as <strong className="text-primary">{user?.role || 'Admin'}</strong>
                                <span className="mx-2">•</span>
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