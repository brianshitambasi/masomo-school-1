import React, { useContext, useEffect, useState, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const ParentAttendance = () => {
  const { token, user } = useContext(AuthContext);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [attendance, setAttendance] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);

  // ✅ FIXED: authHeader is now inside useCallback
  const fetchChildren = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };
    
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/student`, authHeader);
      const allStudents = res.data || [];
      const parentChildren = allStudents.filter(s => s.parent?._id === user?.id || s.parent === user?.id);
      setChildren(parentChildren);
      if (parentChildren.length > 0) {
        setSelectedChild(parentChildren[0]._id);
      }
    } catch (error) {
      console.error('Error fetching children:', error);
      toast.error('Failed to load children');
    } finally {
      setLoading(false);
    }
  }, [token, user?.id]);

  // ✅ FIXED: authHeader is now inside useCallback
  const fetchAttendance = useCallback(async () => {
    if (!selectedChild) return;

    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setAttendanceLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/attendance/student/${selectedChild}`,
        authHeader
      );
      setAttendance(res.data.attendance || []);
      setSummary(res.data.summary || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setAttendanceLoading(false);
    }
  }, [selectedChild, token]);

  // ✅ FIXED: Added fetchChildren as dependency
  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  // ✅ FIXED: Added fetchAttendance as dependency
  useEffect(() => {
    if (selectedChild) {
      fetchAttendance();
    }
  }, [fetchAttendance, selectedChild]);

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-success',
      absent: 'bg-danger',
      late: 'bg-warning text-dark',
      excused: 'bg-info text-dark'
    };
    return badges[status] || 'bg-secondary';
  };

  return (
    <div className="container mt-4">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/parent-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Attendance</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-calendar-check-fill text-success me-2"></i>
          Attendance Records
        </h5>

        {loading ? (
          <div className="text-center py-4">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : children.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No children registered yet.
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label className="form-label fw-semibold">Select Child</label>
              <select
                className="form-control"
                value={selectedChild}
                onChange={(e) => setSelectedChild(e.target.value)}
                disabled={attendanceLoading}
              >
                {children.map((child) => (
                  <option key={child._id} value={child._id}>
                    {child.name} - {child.admissionNumber}
                  </option>
                ))}
              </select>
            </div>

            {summary && (
              <div className="row g-3 mb-4">
                <div className="col-md-3 col-6">
                  <div className="card bg-success text-white">
                    <div className="card-body text-center p-2">
                      <h5 className="mb-0">{summary.present}</h5>
                      <small>Present</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="card bg-danger text-white">
                    <div className="card-body text-center p-2">
                      <h5 className="mb-0">{summary.absent}</h5>
                      <small>Absent</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="card bg-warning text-dark">
                    <div className="card-body text-center p-2">
                      <h5 className="mb-0">{summary.late}</h5>
                      <small>Late</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3 col-6">
                  <div className="card bg-info text-dark">
                    <div className="card-body text-center p-2">
                      <h5 className="mb-0">{summary.excused}</h5>
                      <small>Excused</small>
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <div className="card bg-primary text-white">
                    <div className="card-body text-center p-2">
                      <h5 className="mb-0">{summary.percentage}%</h5>
                      <small>Attendance Rate ({summary.total} total days)</small>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {attendanceLoading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : attendance.length === 0 ? (
              <div className="alert alert-info text-center">
                <i className="bi bi-info-circle me-2"></i>
                No attendance records found for this student.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-striped table-hover">
                  <thead className="table-success">
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Class</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record, index) => (
                      <tr key={record._id}>
                        <td>{index + 1}</td>
                        <td>{new Date(record.date).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${getStatusBadge(record.status)}`}>
                            {record.status?.toUpperCase() || 'N/A'}
                          </span>
                        </td>
                        <td>{record.classroom?.name || 'N/A'}</td>
                        <td>{record.note || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ParentAttendance;
