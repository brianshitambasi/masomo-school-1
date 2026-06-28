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
    const [stats, setStats] = useState({
        totalTeachers: 0,
        totalStudents: 0,
        totalParents: 0,
        totalClasses: 0,
        classesWithoutTeacher: 0,
        teachersWithoutClass: 0
    })

    useEffect(() => {
        const fetchStats = async () => {
            const authHeader = {
                headers: { Authorization: `Bearer ${token}` }
            }

            setLoading(true)
            try {
                const [teachersRes, studentsRes, parentsRes, classesRes] = await Promise.all([
                    axios.get(`${API_URL}/teacher`, authHeader).catch(err => ({ data: [] })),
                    axios.get(`${API_URL}/student`, authHeader).catch(err => ({ data: [] })),
                    axios.get(`${API_URL}/parent`, authHeader).catch(err => ({ data: [] })),
                    axios.get(`${API_URL}/classroom`, authHeader).catch(err => ({ data: [] }))
                ])

                const teachers = teachersRes.data || []
                const students = studentsRes.data || []
                const parents = parentsRes.data || []
                const classrooms = classesRes.data || []

                const teachersWithClass = classrooms.filter(cls => cls.teacher).length
                const teachersWithoutClass = teachers.length - teachersWithClass
                const classesWithoutTeacher = classrooms.filter(cls => !cls.teacher).length

                setStats({
                    totalTeachers: teachers.length,
                    totalStudents: students.length,
                    totalParents: parents.length,
                    totalClasses: classrooms.length,
                    classesWithoutTeacher,
                    teachersWithoutClass: teachersWithoutClass > 0 ? teachersWithoutClass : 0
                })
            } catch (error) {
                console.error('Error fetching stats:', error)
                toast.error('Failed to load dashboard data')
            } finally {
                setLoading(false)
            }
        }
        fetchStats()
    }, [token])

    const dashboardCards = [
        {
            id: 1,
            title: 'Teachers',
            count: stats.totalTeachers,
            icon: 'bi-person-badge',
            color: 'primary',
            bgColor: '#e3f2fd',
            link: '/admin-dashboard/teachers',
            description: 'Total teachers',
            subInfo: `${stats.teachersWithoutClass} without class`
        },
        {
            id: 2,
            title: 'Students',
            count: stats.totalStudents,
            icon: 'bi-people-fill',
            color: 'success',
            bgColor: '#e8f5e9',
            link: '/admin-dashboard/students',
            description: 'Total students'
        },
        {
            id: 3,
            title: 'Parents',
            count: stats.totalParents,
            icon: 'bi-person-lines-fill',
            color: 'warning',
            bgColor: '#fff3e0',
            link: '/admin-dashboard/parents',
            description: 'Total parents'
        },
        {
            id: 4,
            title: 'Classes',
            count: stats.totalClasses,
            icon: 'bi-building',
            color: 'info',
            bgColor: '#e1f5fe',
            link: '/admin-dashboard/classes',
            description: 'Total classes',
            subInfo: `${stats.classesWithoutTeacher} without teacher`
        }
    ]

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
                                Welcome, {user?.name || 'Admin'}! í±‹
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
                {dashboardCards.map((card) => (
                    <div className="col-xl-3 col-md-6" key={card.id}>
                        <Link to={card.link} className="text-decoration-none">
                            <div className="card border-0 shadow-sm h-100 hover-card">
                                <div className="card-body p-4">
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div>
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
                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 pt-3">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-lightning-fill text-warning me-2"></i>
                                Quick Actions
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row g-3">
                                <div className="col-6">
                                    <Link to="/admin-dashboard/classes" className="text-decoration-none">
                                        <div className="p-3 rounded-3 text-center border hover-card">
                                            <i className="bi bi-building fs-2 text-info d-block mb-2"></i>
                                            <span className="small fw-semibold">Manage Classes</span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/admin-dashboard/teachers" className="text-decoration-none">
                                        <div className="p-3 rounded-3 text-center border hover-card">
                                            <i className="bi bi-person-badge fs-2 text-primary d-block mb-2"></i>
                                            <span className="small fw-semibold">Manage Teachers</span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/admin-dashboard/students/add" className="text-decoration-none">
                                        <div className="p-3 rounded-3 text-center border hover-card">
                                            <i className="bi bi-person-plus fs-2 text-success d-block mb-2"></i>
                                            <span className="small fw-semibold">Add Student</span>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-6">
                                    <Link to="/admin-dashboard/parents/add" className="text-decoration-none">
                                        <div className="p-3 rounded-3 text-center border hover-card">
                                            <i className="bi bi-person-add fs-2 text-warning d-block mb-2"></i>
                                            <span className="small fw-semibold">Add Parent</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white border-0 pt-3">
                            <h5 className="fw-bold mb-0">
                                <i className="bi bi-clipboard-data text-info me-2"></i>
                                School Summary
                            </h5>
                        </div>
                        <div className="card-body">
                            <div className="row text-center">
                                <div className="col-4">
                                    <div className="p-3 rounded bg-primary bg-opacity-10">
                                        <h4 className="text-primary">{stats.totalTeachers}</h4>
                                        <small className="text-muted">Teachers</small>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-3 rounded bg-success bg-opacity-10">
                                        <h4 className="text-success">{stats.totalStudents}</h4>
                                        <small className="text-muted">Students</small>
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="p-3 rounded bg-info bg-opacity-10">
                                        <h4 className="text-info">{stats.totalClasses}</h4>
                                        <small className="text-muted">Classes</small>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="row text-center">
                                <div className="col-6">
                                    <div className="p-2 rounded bg-warning bg-opacity-10">
                                        <h6 className="text-warning">{stats.classesWithoutTeacher}</h6>
                                        <small className="text-muted">Classes without Teacher</small>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="p-2 rounded bg-danger bg-opacity-10">
                                        <h6 className="text-danger">{stats.teachersWithoutClass}</h6>
                                        <small className="text-muted">Teachers without Class</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx="true">{`
                .hover-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                    cursor: pointer;
                }
                .hover-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
                }
                .display-6 {
                    font-size: 2rem;
                    font-weight: 300;
                }
            `}</style>
        </div>
    )
}

export default AdminDashboard
