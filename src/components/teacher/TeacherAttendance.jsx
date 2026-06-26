import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const TeacherAttendance = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [summary, setSummary] = useState(null);

  // ✅ FIXED: authHeader is now inside useEffect
  useEffect(() => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const fetchClassrooms = async () => {
      try {
        const res = await axios.get(`${API_URL}/classroom`, authHeader);
        setClassrooms(res.data || []);
      } catch (error) {
        console.error('Error fetching classrooms:', error);
        toast.error('Failed to load classrooms');
      }
    };
    fetchClassrooms();
  }, [token]);

  // ✅ FIXED: fetchAttendance wrapped in useCallback
  const fetchAttendance = useCallback(async () => {
    if (!selectedClassroom || !attendanceDate) return;
    
    setLoading(true);
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      const res = await axios.get(
        `${API_URL}/attendance/classroom/${selectedClassroom}?date=${attendanceDate}`,
        authHeader
      );
      
      const studentsData = res.data.students || [];
      setStudents(studentsData);
      
      const attendanceMap = {};
      studentsData.forEach(item => {
        attendanceMap[item.student._id] = item.status || 'present';
      });
      setAttendanceData(attendanceMap);
      setSummary(res.data.summary);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [selectedClassroom, attendanceDate, token]);

  // ✅ FIXED: Added fetchAttendance as dependency
  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedClassroom) {
      toast.error('Please select a classroom');
      return;
    }

    setSaving(true);
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    try {
      const attendancePayload = students.map(item => ({
        studentId: item.student._id,
        status: attendanceData[item.student._id] || 'present'
      }));

      const payload = {
        classroomId: selectedClassroom,
        date: attendanceDate,
        attendance: attendancePayload
      };

      const res = await axios.post(
        `${API_URL}/attendance`,
        payload,
        authHeader
      );

      toast.success(res.data.message || 'Attendance saved successfully');
      fetchAttendance();
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error(error.response?.data?.message || 'Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const classes = {
      present: 'bg-success',
      absent: 'bg-danger',
      late: 'bg-warning text-dark',
      excused: 'bg-info text-dark',
      'not marked': 'bg-secondary'
    };
    return classes[status] || 'bg-secondary';
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Attendance</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-calendar-check-fill text-success me-2"></i>
          Take Attendance
        </h5>

        <form onSubmit={handleSubmit}>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Classroom</label>
              <select
                className="form-control"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Classroom</option>
                {classrooms.map((cls) => (
                  <option key={cls._id} value={cls._id}>
                    {cls.name} - {cls.gradeLevel || 'N/A'}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label fw-semibold">Date</label>
              <input
                type="date"
                className="form-control"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end">
              <button
                type="submit"
                className="btn btn-success w-100"
                disabled={saving || !selectedClassroom || students.length === 0}
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-save me-2"></i>
                    Save Attendance
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Summary Cards */}
        {summary && (
          <div className="row g-3 mb-4">
            <div className="col-md-2 col-6">
              <div className="card bg-success text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{summary.present}</h5>
                  <small>Present</small>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card bg-danger text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{summary.absent}</h5>
                  <small>Absent</small>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card bg-warning text-dark">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{summary.late}</h5>
                  <small>Late</small>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card bg-info text-dark">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{summary.excused}</h5>
                  <small>Excused</small>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card bg-secondary text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{summary.notMarked}</h5>
                  <small>Not Marked</small>
                </div>
              </div>
            </div>
            <div className="col-md-2 col-6">
              <div className="card bg-primary text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{summary.total}</h5>
                  <small>Total</small>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Students List */}
        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : students.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No students found for this classroom. Select a different classroom.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-success">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Admission No</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((item, index) => (
                  <tr key={item.student._id}>
                    <td>{index + 1}</td>
                    <td>
                      {item.student.photo ? (
                        <img
                          src={`${API_URL}/${item.student.photo}`}
                          alt={item.student.name}
                          className="rounded-circle me-2"
                          style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                        />
                      ) : (
                        <i className="bi bi-person-circle me-2"></i>
                      )}
                      {item.student.name}
                    </td>
                    <td>{item.student.admissionNumber}</td>
                    <td>
                      <select
                        className={`form-select form-select-sm ${getStatusBadgeClass(attendanceData[item.student._id] || 'not marked')} text-white`}
                        value={attendanceData[item.student._id] || 'present'}
                        onChange={(e) => handleStatusChange(item.student._id, e.target.value)}
                        disabled={saving}
                      >
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                        <option value="late">Late</option>
                        <option value="excused">Excused</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAttendance;
