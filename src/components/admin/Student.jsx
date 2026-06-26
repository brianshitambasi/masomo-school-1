import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Student = () => {
    const [students, setStudents] = useState([])
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const API_URL = 'https://schools-gngz.onrender.com'
    
    // FIXED: authHeader is now inside useEffect
    useEffect(() => {
        const authHeader = {
            headers: { Authorization: `Bearer ${token}` }
        }

        const FetchStudents = async () => {
            try {
                toast.info("Loading Students...")
                const res = await axios.get(`${API_URL}/student`, authHeader)
                console.log(res.data)
                setStudents(res.data)
                toast.dismiss()
            } catch (error) {
                toast.dismiss()
                toast.error(error.response?.data?.message || 'Failed to load Students')
            }
        }
        FetchStudents()
    }, [token]) // ✅ Added token as dependency

    const handleDelete = async (id) => {
        const authHeader = {
            headers: { Authorization: `Bearer ${token}` }
        }
        if (window.confirm('Delete this student?')) {
            try {
                toast.warning('Deleting student...')
                const res = await axios.delete(`${API_URL}/student/${id}`, authHeader)
                toast.info(res.data.message)
                const fetchRes = await axios.get(`${API_URL}/student`, authHeader)
                setStudents(fetchRes.data)
            } catch (error) {
                toast.dismiss()
                toast.error(error.response?.data?.message)
            }
        }
    }

    const handleEdit = (studentData) => {
        navigate("/admin-dashboard/students/edit", { state: { studentData } })
    }

    return (
        <div className='container mt-2'>
            <ToastContainer position='top-right' autoClose={3000} />

            <nav aria-label='breadcrumb' className='mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item fw-bold'><Link to='/admin-dashboard'>Dashboard</Link></li>
                    <li className='breadcrumb-item-active' aria-current='page'> / Students</li>
                </ol>
            </nav>

            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-people-fill me-2'></i>Students List
                    </h5>
                    <button className='btn btn-success' onClick={() => navigate('/admin-dashboard/students/add')}>
                        <i className='bi bi-plus-circle'></i> Add Student
                    </button>
                </div>

                <div className="table-responsive">
                    {students.length === 0 ? (
                        <div className="alert alert-warning text-center">
                            <i className='bi bi-exclamation-circle me-2'></i>No Students Found!!
                        </div>
                    ) : (
                        <table className='table table-striped table-hover table-bordered'>
                            <thead className='table-success'>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Adm No</th>
                                    <th>Gender</th>
                                    <th>DOB</th>
                                    <th>Classroom</th>
                                    <th>Parent</th>
                                    <th>Photo</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student._id}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.admissionNumber}</td>
                                        <td>{student.gender}</td>
                                        <td>{student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : 'N/A'}</td>
                                        <td>{student.classroom ? `${student.classroom.gradeLevel || ''} ${student.classroom.name || ''}` : 'N/A'}</td>
                                        <td>{student.parent ? `${student.parent.name} (${student.parent.phone || 'N/A'})` : 'N/A'}</td>
                                        <td>
                                            {student.photo ? (
                                                <img 
                                                    src={`${API_URL}/${student.photo}`} 
                                                    alt="Student" 
                                                    width={50} 
                                                    height={50} 
                                                    style={{ objectFit: 'cover', borderRadius: '50%' }} 
                                                />
                                            ) : (
                                                'No Photo'
                                            )}
                                        </td>
                                        <td>
                                            <button className='btn btn-sm btn-warning me-2' onClick={() => handleEdit(student)}>
                                                <i className='bi bi-pencil-square'></i>
                                            </button>
                                            <button className='btn btn-sm btn-danger' onClick={() => handleDelete(student._id)}>
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

export default Student
