import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Student = () => {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const API_URL = 'https://schools-gngz.onrender.com'
    
    useEffect(() => {
        const authHeader = {
            headers: { Authorization: `Bearer ${token}` }
        }

        const FetchStudents = async () => {
            setLoading(true)
            try {
                toast.info("Loading Students...")
                const res = await axios.get(`${API_URL}/student`, authHeader)
                console.log('Students fetched:', res.data)
                setStudents(res.data)
                toast.dismiss()
            } catch (error) {
                toast.dismiss()
                console.error('Fetch error:', error)
                toast.error(error.response?.data?.message || 'Failed to load Students')
            } finally {
                setLoading(false)
            }
        }
        FetchStudents()
    }, [token])

    const handleDelete = async (id) => {
        const authHeader = {
            headers: { Authorization: `Bearer ${token}` }
        }
        if (window.confirm('Delete this student?')) {
            try {
                toast.warning('Deleting student...')
                const res = await axios.delete(`${API_URL}/student/${id}`, authHeader)
                toast.dismiss()
                toast.success(res.data?.message || 'Student deleted successfully')
                const fetchRes = await axios.get(`${API_URL}/student`, authHeader)
                setStudents(fetchRes.data)
            } catch (error) {
                toast.dismiss()
                toast.error(error.response?.data?.message || 'Error deleting student')
            }
        }
    }

    const handleEdit = (studentData) => {
        navigate("/admin-dashboard/students/edit", { state: { studentData } })
    }

    // Helper function to get image URL
    const getImageUrl = (photoPath) => {
        if (!photoPath) return null
        // If photoPath already starts with http, use it as is
        if (photoPath.startsWith('http')) {
            return photoPath
        }
        // Otherwise, prepend the API URL
        return `${API_URL}/${photoPath}`
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
                        / Students
                    </li>
                </ol>
            </nav>

            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-people-fill me-2'></i>
                        Students List
                        {!loading && (
                            <span className="badge bg-success ms-2">{students.length}</span>
                        )}
                    </h5>
                    <button 
                        className='btn btn-success' 
                        onClick={() => navigate('/admin-dashboard/students/add')}
                    >
                        <i className='bi bi-plus-circle me-2'></i>
                        Add Student
                    </button>
                </div>

                <div className="table-responsive">
                    {loading ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-success" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2 text-muted">Loading students...</p>
                        </div>
                    ) : students.length === 0 ? (
                        <div className="alert alert-warning text-center">
                            <i className='bi bi-exclamation-circle me-2'></i>
                            No Students Found!
                            <Link to="/admin-dashboard/students/add" className="ms-3">
                                <i className="bi bi-plus-circle me-1"></i>
                                Add your first student
                            </Link>
                        </div>
                    ) : (
                        <table className='table table-striped table-hover table-bordered'>
                            <thead className='table-success'>
                                <tr>
                                    <th>#</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Adm No</th>
                                    <th>Gender</th>
                                    <th>DOB</th>
                                    <th>Classroom</th>
                                    <th>Parent</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {student.photo ? (
                                                <img 
                                                    src={getImageUrl(student.photo)} 
                                                    alt={student.name}
                                                    className="rounded-circle"
                                                    style={{ 
                                                        width: '50px', 
                                                        height: '50px', 
                                                        objectFit: 'cover',
                                                        border: '2px solid #28a745'
                                                    }}
                                                    onError={(e) => {
                                                        e.target.onerror = null
                                                        e.target.style.display = 'none'
                                                        // Show fallback
                                                        const parent = e.target.parentElement
                                                        const fallback = document.createElement('div')
                                                        fallback.className = 'rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center'
                                                        fallback.style.cssText = 'width: 50px; height: 50px;'
                                                        fallback.innerHTML = `<i class="bi bi-person-fill text-secondary" style="font-size: 20px;"></i>`
                                                        parent.appendChild(fallback)
                                                    }}
                                                />
                                            ) : (
                                                <div className="rounded-circle bg-secondary bg-opacity-10 d-flex align-items-center justify-content-center"
                                                     style={{ width: '50px', height: '50px' }}>
                                                    <i className="bi bi-person-fill text-secondary" style={{ fontSize: '20px' }}></i>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <strong>{student.name}</strong>
                                        </td>
                                        <td>{student.admissionNumber}</td>
                                        <td>
                                            <span className={`badge ${student.gender === 'Male' ? 'bg-primary' : 'bg-pink'}`}>
                                                {student.gender || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                                        <td>
                                            {student.classroom ? (
                                                <span className="badge bg-info">
                                                    {student.classroom.name || 'N/A'}
                                                </span>
                                            ) : (
                                                <span className="text-muted">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            {student.parent ? (
                                                <div>
                                                    <div className="fw-semibold small">{student.parent.name}</div>
                                                    <small className="text-muted">{student.parent.phone || 'No phone'}</small>
                                                </div>
                                            ) : (
                                                <span className="text-muted">N/A</span>
                                            )}
                                        </td>
                                        <td>
                                            <button 
                                                className='btn btn-sm btn-warning me-2' 
                                                onClick={() => handleEdit(student)}
                                                title="Edit Student"
                                            >
                                                <i className='bi bi-pencil-square'></i>
                                            </button>
                                            <button 
                                                className='btn btn-sm btn-danger'
                                                onClick={() => handleDelete(student._id)}
                                                title="Delete Student"
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

            <style jsx="true">{`
                .bg-pink {
                    background-color: #d63384;
                    color: white;
                }
                .table td {
                    vertical-align: middle;
                }
                .badge {
                    font-size: 0.75rem;
                    padding: 0.35rem 0.65rem;
                }
            `}</style>
        </div>
    )
}

export default Student
