import React, { useContext, useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthContext } from '../../../context/AuthContext'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

const ClassAdd = () => {
    const { token } = useContext(AuthContext)
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [gradeLevel, setGradeLevel] = useState("")
    const [classYear, setClassYear] = useState("")
    const [teachers, setTeachers] = useState([])
    const [selectedTeacherId, setSelectedTeacherId] = useState("")
    
    const API_URL = 'https://schools-gngz.onrender.com' // or 'https://schoolapi-92n6.onrender.com'
    
    const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const FetchTeachers = async () => {
        try {
            toast.info('Loading teachers...')
            const res = await axios.get(`${API_URL}/teacher`, authHeader)
            console.log("Teachers:", res.data)
            setTeachers(res.data)
            toast.dismiss()
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data?.message || "Failed to load teachers")
        }
    }

    useEffect(() => {
        FetchTeachers()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            toast.info("Submitting...")
            const data = { name, gradeLevel, classYear, teacher: selectedTeacherId }
            const res = await axios.post(`${API_URL}/classroom`, data, authHeader)
            toast.dismiss()
            toast.success(res.data?.message || "Class added successfully")
            navigate('/admin-dashboard/classes')
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data?.message || "Error submitting")
        }
    }

    return (
        <div className='container mt-2'>
            <ToastContainer position='top-right' autoClose={3000} />

            <nav aria-label='breadcrumb' className='mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item fw-bold'><Link to='/admin-dashboard'>Dashboard</Link></li>
                    <li className='breadcrumb-item fw-bold'><Link to='/admin-dashboard/classes'>Classes</Link></li>
                    <li className='breadcrumb-item-active' aria-current='page'>/ Add Class</li>
                </ol>
            </nav>

            <div className="card p-4 shadow-sm mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-building me-2'></i>Add New Class
                    </h5>
                    <Link className='btn btn-success' to={'/admin-dashboard/classes'}>
                        <i className='bi bi-arrow-left-circle-fill me-2'></i>Back
                    </Link>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="text" className='form-control' placeholder='Class Name' value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="text" className='form-control' placeholder='Grade Level' value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <input type="number" className='form-control' placeholder='Class Year' value={classYear} onChange={(e) => setClassYear(e.target.value)} required />
                        </div>
                        <div className="col-md-6 mb-3">
                            <select className='form-control' value={selectedTeacherId} onChange={(e) => setSelectedTeacherId(e.target.value)} required>
                                <option value="">Select Teacher</option>
                                {teachers.map((teacher) => (
                                    <option key={teacher._id} value={teacher._id}>{`${teacher.name} - ${teacher.subject}`}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button type="submit" className='btn btn-success'>
                        <i className='bi bi-save'></i> Save Class
                    </button>
                </form>
            </div>
        </div>
    )
}

export default ClassAdd