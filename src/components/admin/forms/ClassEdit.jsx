import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { hasFormSubmit } from '@testing-library/user-event/dist/utils'


const ClassEdit = () => {
  const { token } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [gradeLevel, setGradeLevel] = useState('')
  const [classYear, setClassYear] = useState('')
  const [teacher, setTeacher] = useState([])
  const [selectedTeacherId, setSelectedTeacherId] = useState('')

  // we receive data from the classes component
  const { state } = useLocation()
  const selectedClass = state?.classData 
  const navigate = useNavigate()
  console.log(selectedClass)

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

  // useEffect to update the hooks in these component
  useEffect(() => {
    if (!selectedClass) {
      toast.error('No class data provided')
      setTimeout(() => {
        navigate('/admin-dashboard/classes')
      }, 2000)
      return
    }
    setName(selectedClass?.name)
    setGradeLevel(selectedClass?.gradeLevel)
    setClassYear(selectedClass?.classYear)
    setSelectedTeacherId(selectedClass?.teacher?._id || '')
  }, [selectedClass, navigate])

   // handle submit function
   const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        toast.info("updating form...")
        const data = {
            name,
            gradeLevel,
            classYear,
            teacher: selectedTeacherId
        }
        const res = await axios.put(`https://schoolapi-92n6.onrender.com/api/classroom/${selectedClass._id}`, data, authHeader)
        toast.dismiss()
        toast.success(res.data?.message || "Class updated  successfully")
        navigate('/admin-dashboard/classes')
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
                    <li className='breadcrumb-item active' aria-label='page'> Edit Classes</li>
                </ol>
            </nav>

            <div className='card p-4 shadow-sm mb-4'>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className='text-success'>
                        <i className='bi bi-building me-2'></i>Update Classes
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
                                {teacher.map((t,index) => (
                                    <option key={t._id} value={t._id}>
                                        {t.name} ({t.phone})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-12">
                            <button type="submit" className="btn btn-primary">Update</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ClassEdit