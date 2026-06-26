import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Teachers = () => {
    const [teachers, setTeachers] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const API_URL = 'https://schools-gngz.onrender.com'
    
    // FIXED: authHeader is now defined INSIDE useEffect, not outside
    useEffect(() => {
        const authHeader = {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }

        const FetchTeachers = async () => {
            setLoading(true)
            try {
                toast.info("Loading Teachers...")
                const res = await axios.get(`${API_URL}/teacher`, authHeader)
                console.log('Teachers fetched:', res.data)
                setTeachers(res.data)
                toast.dismiss()
            } catch (error) {
                toast.dismiss()
                console.error('Fetch error:', error)
                toast.error(error.response?.data?.message || 'Failed to load Teachers')
            } finally {
                setLoading(false)
            }
        }
        FetchTeachers()
    }, [token]) // ✅ Only token as dependency

    const handleDelete = async (id) => {
        // authHeader defined inside function where needed
        const authHeader = {
            headers: { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            try {
                toast.warning('Deleting teacher...')
                const res = await axios.delete(`${API_URL}/teacher/${id}`, authHeader)
                toast.dismiss()
                toast.success(res.data?.message || 'Teacher deleted successfully')
                // Refresh list
                const refreshHeader = {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
                const fetchRes = await axios.get(`${API_URL}/teacher`, refreshHeader)
                setTeachers(fetchRes.data)
            } catch (error) {
                toast.dismiss()
                console.error('Delete error:', error)
                toast.error(error.response?.data?.message || 'Error deleting teacher')
            }
        }
    }

    const handleEdit = (teacherData) => {
        console.log('Editing teacher:', teacherData)
        navigate("/admin-dashboard/teachers/edit", { 
            state: { teacherData: teacherData }
        })
    }

    return (
        <div className='container mt-2'>
            <ToastContainer position='top-right' autoClose={3000} />

            <nav aria-label='breadcrumb' className='mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item fw-bold'>
                        <Link to='/admin-dashboard'>Dashboard</Link>
                    </li>
                    <li className='breadcrumb-item-active' aria-current='page'>
                        / Teachers
                    </li>
                </ol>
            </nav>

            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-person-badge me-2'></i>
                        Teachers List
                        {!loading && (
                            <span className="badge bg-success ms-2">{teachers.length}</span>
                        )}
                    </h5>
                    <button 
                        className='btn btn-success' 
                        onClick={() => navigate('/admin-dashboard/teachers/add')}
                    >
                        <i className='bi bi-plus-circle me-2'></i>
                        Add Teacher
                    </button>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading teachers...</p>
                        </div>
                    ) : teachers.length === 0 ? (
                        <div className="alert alert-warning text-center">
                            <i className='bi bi-exclamation-circle me-2'></i>
                            No Teachers Found!
                            <Link to="/admin-dashboard/teachers/add" className="ms-3">
                                <i className="bi bi-plus-circle me-1"></i>
                                Add your first teacher
                            </Link>
                        </div>
                    ) : (
                        <table className='table table-striped table-hover table-bordered'>
                            <thead className='table-success'>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Subject</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teachers.map((teacher, index) => (
                                    <tr key={teacher._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <strong>{teacher.name}</strong>
                                        </td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.phone || 'N/A'}</td>
                                        <td>
                                            <span className="badge bg-primary">
                                                {teacher.subject || 'N/A'}
                                            </span>
                                        </td>
                                        <td>
                                            <button 
                                                className='btn btn-sm btn-warning me-2' 
                                                onClick={() => handleEdit(teacher)}
                                                title="Edit Teacher"
                                            >
                                                <i className='bi bi-pencil-square'></i>
                                            </button>
                                            <button 
                                                className='btn btn-sm btn-danger'
                                                onClick={() => handleDelete(teacher._id)}
                                                title="Delete Teacher"
                                            >
                                                <i className='bi bi-trash'></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Teachers
