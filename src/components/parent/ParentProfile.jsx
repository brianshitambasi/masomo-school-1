import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
const ParentProfile = () => {
  const { user } = useContext(AuthContext)
  return (
    <div className="container mt-4">
      <h3>My Profile</h3>
      <div className="card p-4">
        <p><strong>Name:</strong> {user?.name || 'Not set'}</p>
        <p><strong>Email:</strong> {user?.email || 'Not set'}</p>
        <p><strong>Role:</strong> {user?.role || 'Not set'}</p>
      </div>
    </div>
  )
}
export default ParentProfile
