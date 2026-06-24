import React from 'react'
import { useParams } from 'react-router-dom'
const ParentStudentDetail = () => {
  const { id } = useParams()
  return (
    <div className="container mt-4">
      <h3>Student Details</h3>
      <div className="card p-4">
        <p>Viewing details for student ID: {id}</p>
      </div>
    </div>
  )
}
export default ParentStudentDetail
