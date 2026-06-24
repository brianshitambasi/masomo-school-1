import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const RegisterComponent = () => {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [secretKey, setSecretKey] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    // Use your local backend URL
    const API_URL = 'https://schools-gngz.onrender.com' // or 'https://schoolapi-92n6.onrender.com'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setLoading(true)

        // Validate secret key
        if (secretKey !== '123bms345') {
            setError('Invalid secret key. Please contact administrator.')
            setLoading(false)
            toast.error('Invalid secret key')
            return
        }

        try {
            const data = { 
                name, 
                email, 
                password, 
                secretkey: secretKey // Note: the backend expects 'secretkey'
            }
            
            console.log('Registering with:', { name, email, secretKey })
            
            const res = await axios.post(`${API_URL}/user/Auth/register`, data)
            console.log('Registration response:', res.data)

            if (res.data.message === 'account created') {
                setLoading(false)
                setSuccess('Registration Successful! Redirecting to login...')
                toast.success('Account created successfully!')
                
                // Redirect after 2 seconds
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            } else {
                setLoading(false)
                setError(res.data.message || 'Registration failed')
                toast.error(res.data.message || 'Registration failed')
            }

        } catch (error) {
            setLoading(false)
            console.error('Registration error:', error)
            
            if (error.response) {
                // Server responded with error
                const message = error.response.data?.message || 'Registration failed. Please try again.'
                setError(message)
                toast.error(message)
            } else if (error.request) {
                setError('Cannot connect to server. Please check if backend is running.')
                toast.error('Server connection failed')
            } else {
                setError(error.message || 'An unexpected error occurred')
                toast.error('Registration failed')
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
                    <i className="bi bi-person-plus me-2"></i>
                    Register Admin
                </h4>
                
                {/* Alerts */}
                {error && (
                    <div className='alert alert-danger d-flex align-items-center'>
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                    </div>
                )}
                
                {success && (
                    <div className='alert alert-success d-flex align-items-center'>
                        <i className="bi bi-check-circle-fill me-2"></i>
                        {success}
                    </div>
                )}
                
                {loading && (
                    <div className='alert alert-info d-flex align-items-center'>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                        Creating admin account...
                    </div>
                )}

                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        <i className="bi bi-person me-2"></i>Full Name
                    </label>
                    <input 
                        type="text" 
                        className='form-control' 
                        placeholder='Enter your full name' 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required
                        disabled={loading}
                    />
                </div>
                
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        <i className="bi bi-envelope me-2"></i>Email Address
                    </label>
                    <input 
                        type="email" 
                        className='form-control' 
                        placeholder='Enter your email' 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required
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
                        placeholder='Create a password (min 6 characters)' 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required
                        minLength={6}
                        disabled={loading}
                    />
                </div>
                
                <div className="mb-3">
                    <label className="form-label fw-semibold">
                        <i className="bi bi-key me-2"></i>Secret Key
                    </label>
                    <input 
                        type="password" 
                        className='form-control' 
                        placeholder='Enter the admin secret key' 
                        value={secretKey} 
                        onChange={(e) => setSecretKey(e.target.value)} 
                        required
                        disabled={loading}
                    />
                    <small className="text-muted">
                        <i className="bi bi-info-circle me-1"></i>
                        Contact administrator for the secret key
                    </small>
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
                                Registering...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-person-plus me-2"></i>
                                Register Admin
                            </>
                        )}
                    </button>
                </div>
                
                <div className='text-center'>
                    <p className="mb-0">
                        Already have an account?{' '}
                        <Link to='/login' className='text-success fw-bold text-decoration-none'>
                            Login Here
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default RegisterComponent