import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LoginComponent = () => {
  const { setToken, setUser } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Use your local backend URL
  const API_URL = 'https://schools-gngz.onrender.com' // or 'https://schoolapi-92n6.onrender.com'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    
    try {
      const data = { email, password }
      const res = await axios.post(`${API_URL}/user/Auth/`, data)
      
      console.log('Login response:', res.data)
      
      const { token, user } = res.data
      
      if (!token || !user) {
        throw new Error('Invalid response from server')
      }
      
      // Set context
      setToken(token)
      setUser(user)

      // Save to localStorage
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      
      setLoading(false)
      toast.success(`Welcome ${user.name || 'User'}!`)

      // Role-based navigation
      if (user.role === 'admin') {
        navigate('/admin-dashboard')
      } else if (user.role === 'teacher') {
        navigate('/teacher-dashboard')
      } else if (user.role === 'parent') {
        navigate('/parent-dashboard')
      } else {
        navigate('/')
      }

    } catch (error) {
      setLoading(false)
      console.error('Login error:', error)
      
      // Better error handling
      if (error.response) {
        // Server responded with error
        const message = error.response.data?.message || 'Login failed. Please try again.'
        setError(message)
        toast.error(message)
      } else if (error.request) {
        // No response from server
        setError('Cannot connect to server. Please check if backend is running.')
        toast.error('Server connection failed')
      } else {
        // Something else went wrong
        setError(error.message || 'An unexpected error occurred')
        toast.error('Login failed')
      }
    }
  }

  return (
    <div className='container mt-5' style={{ maxWidth: '500px' }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <form onSubmit={handleSubmit} className='card shadow p-4 bg-light rounded'>
        <div className="text-center mb-3">
          <i className="bi bi-mortarboard-fill text-success" style={{ fontSize: '3rem' }}></i>
          <h1 className='text-success fw-bold'>Masomo School</h1>
          <h5 className='text-muted'>School Management System</h5>
        </div>
        
        <hr />
        
        <h4 className='text-center text-success mb-3'>
          <i className="bi bi-box-arrow-in-right me-2"></i>
          Login
        </h4>
        
        {/* Alerts */}
        {error && (
          <div className='alert alert-danger d-flex align-items-center'>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </div>
        )}
        
        {loading && (
          <div className='alert alert-info d-flex align-items-center'>
            <div className="spinner-border spinner-border-sm me-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            Logging in...
          </div>
        )}

        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="bi bi-envelope me-2"></i>Email Address
          </label>
          <input 
            type="email" 
            className='form-control' 
            placeholder='Enter your email' 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label fw-semibold">
            <i className="bi bi-lock me-2"></i>Password
          </label>
          <input 
            type="password" 
            className='form-control' 
            placeholder='Enter your password' 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className='d-grid mb-3'>
          <button 
            type='submit' 
            className='btn btn-success btn-lg'
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </span>
                Logging in...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Login
              </>
            )}
          </button>
        </div>
        
        <div className='text-center'>
          <p className="mb-0">
            Don't have an account?{' '}
            <Link to='/register' className='text-success fw-bold text-decoration-none'>
              Register Here
            </Link>
          </p>
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Admin: admin@school.com / admin123
          </small>
        </div>
      </form>
    </div>
  )
}

export default LoginComponent