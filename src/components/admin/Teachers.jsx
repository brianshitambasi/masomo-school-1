import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ id: null, name: '', subject: '' });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addTeacher = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.subject) {
      toast.error('Please fill in all fields');
      return;
    }

    if (isEditing) {
      setTeachers(
        teachers.map((teacher) =>
          teacher.id === formData.id
            ? { ...teacher, name: formData.name, subject: formData.subject }
            : teacher
        )
      );
      toast.success('Teacher updated successfully');
      setIsEditing(false);
    } else {
      const newTeacher = {
        id: teachers.length + 1,
        name: formData.name,
        subject: formData.subject,
      };
      setTeachers([...teachers, newTeacher]);
      toast.success('Teacher added successfully');
    }

    setFormData({ id: null, name: '', subject: '' });
  };

  const editTeacher = (teacher) => {
    setFormData({ id: teacher.id, name: teacher.name, subject: teacher.subject });
    setIsEditing(true);
  };

  const deleteTeacher = (id) => {
    setTeachers(teachers.filter((teacher) => teacher.id !== id));
    toast.success('Teacher deleted successfully');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Teacher Management</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">{isEditing ? 'Edit Teacher' : 'Add Teacher'}</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Teacher Name"
            className="border p-2 rounded w-1/2"
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleInputChange}
            placeholder="Subject"
            className="border p-2 rounded w-1/2"
          />
          <button
            onClick={addTeacher}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update' : 'Add'}
          </button>
          {isEditing && (
            <button
              onClick={() => {
                setFormData({ id: null, name: '', subject: '' });
                setIsEditing(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Teachers List</h2>
        {teachers.length === 0 ? (
          <p>No teachers available.</p>
        ) : (
          <ul className="space-y-2">
            {teachers.map((teacher) => (
              <li
                key={teacher.id}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>
                  {teacher.name} - {teacher.subject}
                </span>
                <div className="space-x-2">
                  <button
                    onClick={() => editTeacher(teacher)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteTeacher(teacher.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Teachers;