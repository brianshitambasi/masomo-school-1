import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'

const Teachers = () => {
    const [teachers, setTeachers] = useState([])
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    
    // Use your local or deployed backend URL
    const API_URL = 'https://schools-gngz.onrender.com' // or 'https://schoolapi-92n6.onrender.com'
    
    const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const FetchTeachers = async () => {
        try {
            toast.info("Loading Teachers...")
            const res = await axios.get(`${API_URL}/teacher`, authHeader)
            console.log(res.data)
            setTeachers(res.data)
            toast.dismiss()
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data?.message || 'Failed to load Teachers')
        }
    }

    useEffect(() => {
        FetchTeachers()
    }, [])

    const handleDelete = async (id) => {
        if (window.confirm('Delete this teacher?')) {
            try {
                toast.warning('Deleting teacher...')
                const res = await axios.delete(`${API_URL}/teacher/${id}`, authHeader)
                toast.info(res.data.message)
                FetchTeachers()
            } catch (error) {
                toast.dismiss()
                toast.error(error.response?.data?.message)
            }
        }
    }

    const handleEdit = (teacherData) => {
        navigate("/admin-dashboard/teachers/edit", { state: { teacherData } })
    }

    return (
        <div className='container mt-2'>
            <ToastContainer position='top-right' autoClose={3000} />

            <nav aria-label='breadcrumb' className='mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item fw-bold'><Link to='/admin-dashboard'>Dashboard</Link></li>
                    <li className='breadcrumb-item-active' aria-current='page'> / Teachers</li>
                </ol>
            </nav>

            <div className="card p-4 shadow-sm">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-person-badge me-2'></i>Teachers List
                    </h5>
                    <button className='btn btn-success' onClick={() => navigate('/admin-dashboard/teachers/add')}>
                        <i className='bi bi-plus-circle'></i> Add Teacher
                    </button>
                </div>

                <div className="table-responsive">
                    {teachers.length === 0 ? (
                        <div className="alert alert-warning text-center">
                            <i className='bi bi-exclamation-circle me-2'></i>No Teachers Found!!
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
                                        <td>{teacher.name}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.phone}</td>
                                        <td>{teacher.subject}</td>
                                        <td>
                                            <button className='btn btn-sm btn-warning me-2' onClick={() => handleEdit(teacher)}>
                                                <i className='bi bi-pencil-square'></i>
                                            </button>
                                            <button className='btn btn-sm btn-danger' onClick={() => handleDelete(teacher._id)}>
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