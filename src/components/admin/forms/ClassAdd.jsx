import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Link } from 'react-router-dom'

const ClassAdd = () => {
    const { token } = useContext(AuthContext)
    const [name, setName] = useState('')
    const [gradeLevel, setGradeLevel] = useState('')
    const [classYear, setClassYear] = useState('')
    const [teacher, setTeacher] = useState([])
    const [selectedTeacherId, setSelectedTeacherId] = useState('')

    // we prepare our authheader
    const authHeader = {
        headers: { Authorization: `Bearer ${token}` }
    }

    const FetchTeachers = async () => {
        try {
            toast.info("Loading Teachers...")
            const res = await axios.get('https://schoolapi-92n6.onrender.com/api/teacher', authHeader)
            console.log("teachers get", res.data)
            setTeacher(res.data)
            toast.dismiss()
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data?.message || 'Failed to load teachers')
        }
    }

    // we use the useEffect so that the fetch class function get executed immediately the component has
    // been mounted
    useEffect(() => {
        FetchTeachers()
    }, [])

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            toast.info("Submitting form...")
            const data = {
                name,
                gradeLevel,
                classYear,
                teacherId: selectedTeacherId
            }
            const res = await axios.post('https://schoolapi-92n6.onrender.com/api/classroom', data, authHeader)
            toast.dismiss()
            toast.success(res.data?.message || "Class added successfully")
            setName('')
            setGradeLevel('')
            setClassYear('')
            setSelectedTeacherId('')
        } catch (error) {
            toast.dismiss()
            toast.error(error.response?.data?.message || "error submitting form")
        }
    }

    return (
        <div className='container mt-2'>
            <ToastContainer position='top-right' autoClose={3000} />

            {/* breadcrumbs provide ease in path location */}
            <nav aria-label='breadcrumb' className='mb-3'>
                <ol className='breadcrumb'>
                    <li className='breadcrumb-item fw-bold'><Link to='/admin-dashboard'>Dashboard</Link></li>
                    <li className='breadcrumb-item fw-bold'><Link to='/admin-dashboard'>classes</Link></li>
                    <li className='breadcrumb-item active' aria-label='page'> / add Classes</li>
                </ol>
            </nav>

            <div className='card p-4 shadow-sm mb-4'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-building me-2'></i>Add new Classes
                    </h5>

                    <Link className='btn btn-success' to={'/admin-dashboard/classes'}>
                        <i className='bi bi-arrow-left me-2'></i>Back to Classes
                    </Link>
                </div>

                {/* form to post the class */}
                <form onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <input type="text" className="form-control" id="className" placeholder="Class Name"
                                value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input type="text" className="form-control" id="gradeLevel" placeholder="Grade Level (e.g., 1, 2)"
                                value={gradeLevel} onChange={(e) => setGradeLevel(e.target.value)} required />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input type="number" className="form-control" id="classYear" placeholder="Year of the class"
                                value={classYear} onChange={(e) => setClassYear(e.target.value)} required />
                        </div>

                        {/* select teacher */}
                        <div className="col-md-6 mb-3">
                            <select className="form-control" 
                                value={selectedTeacherId} 
                                onChange={(e) => setSelectedTeacherId(e.target.value)}>
                                <option value="">Select Teacher</option>
                                {teacher.map((t) => (
                                    <option key={t._id} value={t._id}>
                                        {t.name} ({t.phone})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassAdd