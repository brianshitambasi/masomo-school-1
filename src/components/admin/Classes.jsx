import React, { useContext, useEffect, useState, useCallback, useMemo } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { API_URL } from '../../config'

const Classes = () => {
    const [classes, setClasses] = useState([])
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedClass, setSelectedClass] = useState(null)
    const [showAssignModal, setShowAssignModal] = useState(false)
    const [selectedTeacher, setSelectedTeacher] = useState('')
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()

    // ✅ FIXED: Wrap authHeader in useMemo to prevent recreation on every render
    const authHeader = useMemo(() => ({
        headers: { Authorization: `Bearer ${token}` }
    }), [token])

    // ✅ FIXED: Wrap fetchData in useCallback with authHeader dependency
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [classesRes, teachersRes] = await Promise.all([
                axios.get(`${API_URL}/classroom`, authHeader),
                axios.get(`${API_URL}/teacher`, authHeader)
            ])
            setClasses(classesRes.data || [])
            setTeachers(teachersRes.data || [])
        } catch (error) {
            console.error('Error fetching data:', error)
            toast.error('Failed to load data')
        } finally {
            setLoading(false)
        }
    }, [authHeader])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleDelete = async (id) => {
        if (window.confirm('Delete this class?')) {
            try {
                await axios.delete(`${API_URL}/classroom/${id}`, authHeader)
                toast.success('Class deleted successfully')
                fetchData()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to delete class')
            }
        }
    }

    const handleAssignTeacher = async () => {
        if (!selectedClass || !selectedTeacher) {
            toast.error('Please select a class and teacher')
            return
        }

        try {
            await axios.put(
                `${API_URL}/classroom/${selectedClass}`,
                { teacher: selectedTeacher },
                authHeader
            )
            toast.success('Teacher assigned successfully')
            setShowAssignModal(false)
            setSelectedTeacher('')
            setSelectedClass(null)
            fetchData()
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to assign teacher')
        }
    }

    const handleRemoveTeacher = async (classId) => {
        if (window.confirm('Remove teacher from this class?')) {
            try {
                await axios.put(
                    `${API_URL}/classroom/${classId}`,
                    { teacher: null },
                    authHeader
                )
                toast.success('Teacher removed from class')
                fetchData()
            } catch (error) {
                toast.error(error.response?.data?.message || 'Failed to remove teacher')
            }
        }
    }

    const getTeacherName = (teacherId) => {
        const teacher = teachers.find(t => t._id === teacherId)
        return teacher ? teacher.name : 'Not Assigned'
    }

    return (
        <div className='container mt-2'>
            <ToastContainer position='top-right' autoClose={3000} />

            <nav aria-label='breadcrumb' className='mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item fw-bold'>
                        <Link to='/admin-dashboard'>Dashboard</Link>
                    </li>
                    <li className='breadcrumb-item-active'>/ Classes</li>
                </ol>
            </nav>

            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-building me-2'></i>
                        Classes Management
                        {!loading && <span className="badge bg-success ms-2">{classes.length}</span>}
                    </h5>
                    <div>
                        <button 
                            className='btn btn-success me-2'
                            onClick={() => navigate('/admin-dashboard/classes/add')}
                        >
                            <i className='bi bi-plus-circle'></i> Add Class
                        </button>
                        <button 
                            className='btn btn-outline-success'
                            onClick={fetchData}
                            disabled={loading}
                        >
                            <i className={`bi ${loading ? 'bi-arrow-repeat spin' : 'bi-arrow-clockwise'}`}></i>
                            Refresh
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-success" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-2 text-muted">Loading classes...</p>
                    </div>
                ) : classes.length === 0 ? (
                    <div className="alert alert-warning text-center">
                        <i className='bi bi-exclamation-circle me-2'></i>
                        No Classes Found!
                        <Link to="/admin-dashboard/classes/add" className="ms-3">
                            <i className="bi bi-plus-circle me-1"></i>
                            Add your first class
                        </Link>
                    </div>
                ) : (
                    <div className="table-responsive">
                        <table className='table table-striped table-hover table-bordered'>
                            <thead className='table-success'>
                                <tr>
                                    <th>#</th>
                                    <th>Class Name</th>
                                    <th>Grade Level</th>
                                    <th>Class Year</th>
                                    <th>Teacher</th>
                                    <th>Students</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.map((cls, index) => (
                                    <tr key={cls._id}>
                                        <td>{index + 1}</td>
                                        <td><strong>{cls.name}</strong></td>
                                        <td>{cls.gradeLevel}</td>
                                        <td>{cls.classYear}</td>
                                        <td>
                                            {cls.teacher ? (
                                                <div className="d-flex align-items-center">
                                                    <span className="badge bg-success me-2">
                                                        {getTeacherName(cls.teacher)}
                                                    </span>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={() => handleRemoveTeacher(cls._id)}
                                                        title="Remove Teacher"
                                                    >
                                                        <i className="bi bi-x-circle"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    className="btn btn-sm btn-warning"
                                                    onClick={() => {
                                                        setSelectedClass(cls._id)
                                                        setShowAssignModal(true)
                                                    }}
                                                >
                                                    <i className="bi bi-person-plus me-1"></i>
                                                    Assign Teacher
                                                </button>
                                            )}
                                        </td>
                                        <td>
                                            <span className="badge bg-info">
                                                {cls.students?.length || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className='btn btn-sm btn-warning me-2'
                                                onClick={() => navigate(`/admin-dashboard/classes/edit/${cls._id}`)}
                                            >
                                                <i className='bi bi-pencil-square'></i>
                                            </button>
                                            <button 
                                                className='btn btn-sm btn-danger'
                                                onClick={() => handleDelete(cls._id)}
                                            >
                                                <i className='bi bi-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Assign Teacher Modal */}
            {showAssignModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-success text-white">
                                <h5 className="modal-title">
                                    <i className="bi bi-person-plus me-2"></i>
                                    Assign Teacher to Class
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close btn-close-white"
                                    onClick={() => {
                                        setShowAssignModal(false)
                                        setSelectedTeacher('')
                                        setSelectedClass(null)
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label fw-semibold">Select Teacher</label>
                                    <select
                                        className="form-control"
                                        value={selectedTeacher}
                                        onChange={(e) => setSelectedTeacher(e.target.value)}
                                    >
                                        <option value="">Choose a teacher...</option>
                                        {teachers.map((teacher) => (
                                            <option key={teacher._id} value={teacher._id}>
                                                {teacher.name} - {teacher.subject || 'No Subject'}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setShowAssignModal(false)
                                        setSelectedTeacher('')
                                        setSelectedClass(null)
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={handleAssignTeacher}
                                    disabled={!selectedTeacher}
                                >
                                    <i className="bi bi-check-circle me-2"></i>
                                    Assign Teacher
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx="true">{`
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1050;
                }
                .modal-dialog {
                    max-width: 500px;
                    width: 90%;
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    )
}

export default Classes
