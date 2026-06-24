import React from 'react'
const TeacherAssignmentEdit = () => {
  return (
    <div className="container mt-4">
      <h3>Edit Assignment</h3>
      <p>Update assignment details here.</p>
      <div className="card p-4">
        <form>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input type="text" className="form-control" placeholder="Assignment title" />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" placeholder="Assignment description"></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label">Due Date</label>
            <input type="date" className="form-control" />
          </div>
          <button className="btn btn-success">Update Assignment</button>
        </form>
      </div>
    </div>
  )
}
export default TeacherAssignmentEdit
