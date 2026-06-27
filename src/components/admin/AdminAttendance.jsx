import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const AdminAttendance = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [classStats, setClassStats] = useState([]);
  const [viewMode, setViewMode] = useState('daily'); // daily, monthly, stats

  // ✅ FIXED: authHeader is now inside each function
  const fetchClassrooms = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const res = await axios.get(`${API_URL}/classroom`, authHeader);
      setClassrooms(res.data || []);
      if (res.data.length > 0) {
        setSelectedClassroom(res.data[0]._id);
      }
    } catch (error) {
      console.error('Error fetching classrooms:', error);
      toast.error('Failed to load classrooms');
    }
  }, [token]);

  const fetchAttendance = useCallback(async () => {
    if (!selectedClassroom) return;

    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/attendance/classroom/${selectedClassroom}?date=${attendanceDate}`,
        authHeader
      );
      
      setAttendanceData(res.data.students || []);
      setSummary(res.data.summary || null);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast.error('Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  }, [selectedClassroom, attendanceDate, token]);

  const calculateStatsFromClassrooms = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const stats = [];
      for (const classroom of classrooms) {
        try {
          const res = await axios.get(
            `${API_URL}/attendance/classroom/${classroom._id}/summary`,
            authHeader
          );
          if (res.data && res.data.summary) {
            const avg = res.data.summary.reduce((acc, s) => acc + s.percentage, 0) / res.data.summary.length;
            stats.push({
              classroom: classroom.name,
              total: res.data.summary.length,
              average: Math.round(avg) || 0
            });
          }
        } catch (e) {
          // Skip if no data
        }
      }
      setClassStats(stats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  }, [classrooms, token]);

  const fetchClassStats = useCallback(async () => {
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const res = await axios.get(`${API_URL}/attendance/classrooms/stats`, authHeader);
      setClassStats(res.data || []);
    } catch (error) {
      console.error('Error fetching class stats:', error);
      await calculateStatsFromClassrooms();
    }
  }, [token, calculateStatsFromClassrooms]);

  // ✅ FIXED: Added all dependencies
  useEffect(() => {
    fetchClassrooms();
  }, [fetchClassrooms]);

  useEffect(() => {
    if (selectedClassroom) {
      fetchAttendance();
    }
  }, [fetchAttendance, selectedClassroom]);

  useEffect(() => {
    if (classrooms.length > 0) {
      fetchClassStats();
    }
  }, [fetchClassStats, classrooms.length]);

  const getStatusBadge = (status) => {
    const badges = {
      present: 'bg-success',
      absent: 'bg-danger',
      late: 'bg-warning text-dark',
      excused: 'bg-info text-dark',
      'not marked': 'bg-secondary'
    };
    return badges[status] || 'bg-secondary';
  };

  const getStatusCount = (status) => {
    if (!summary) return 0;
    return summary[status] || 0;
  };

  const exportAttendance = () => {
    if (attendanceData.length === 0) return;
    
    let csv = 'Student Name,Admission Number,Status\n';
    attendanceData.forEach(item => {
      csv += `${item.student.name},${item.student.admissionNumber},${item.status || 'Not Marked'}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_${new Date(attendanceDate).toLocaleDateString()}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/admin-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Attendance</li>
        </ol>
      </nav>

      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === 'daily' ? 'active text-success fw-bold' : ''}`}
            onClick={() => setViewMode('daily')}
          >
            <i className="bi bi-calendar-day me-1"></i>
            Daily View
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${viewMode === 'stats' ? 'active text-success fw-bold' : ''}`}
            onClick={() => setViewMode('stats')}
          >
            <i className="bi bi-graph-up me-1"></i>
            Statistics
          </button>
        </li>
      </ul>

      {viewMode === 'daily' && (
        <div className="card p-4 shadow-sm">
          <h5 className="fw-bold mb-3">
            <i className="bi bi-calendar-check-fill text-success me-2"></i>
            Attendance - Daily View
          </h5>

          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <label className="form-label fw-semibold">Classroom</label>
              <select
                className="form-control"
                value={selectedClassroom}
                onChange={(e) => setSelectedClassroom(e.target.value)}
                disabled={loading}
              >
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
                disabled={loading}
              />
            </div>
            <div className="col-md-4 d-flex align-items-end gap-2">
              <button
                className="btn btn-success w-50"
                onClick={fetchAttendance}
                disabled={loading}
              >
                <i className="bi bi-refresh me-1"></i>
                Refresh
              </button>
              <button
                className="btn btn-outline-primary w-50"
                onClick={exportAttendance}
                disabled={attendanceData.length === 0}
              >
                <i className="bi bi-download me-1"></i>
                Export
              </button>
            </div>
          </div>

          {summary && (
            <div className="row g-2 mb-4">
              <div className="col-md-2 col-4">
                <div className="card bg-success text-white">
                  <div className="card-body text-center p-2">
                    <h6 className="mb-0">{getStatusCount('present')}</h6>
                    <small>Present</small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-4">
                <div className="card bg-danger text-white">
                  <div className="card-body text-center p-2">
                    <h6 className="mb-0">{getStatusCount('absent')}</h6>
                    <small>Absent</small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-4">
                <div className="card bg-warning text-dark">
                  <div className="card-body text-center p-2">
                    <h6 className="mb-0">{getStatusCount('late')}</h6>
                    <small>Late</small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-4">
                <div className="card bg-info text-dark">
                  <div className="card-body text-center p-2">
                    <h6 className="mb-0">{getStatusCount('excused')}</h6>
                    <small>Excused</small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-4">
                <div className="card bg-secondary text-white">
                  <div className="card-body text-center p-2">
                    <h6 className="mb-0">{getStatusCount('not marked')}</h6>
                    <small>Not Marked</small>
                  </div>
                </div>
              </div>
              <div className="col-md-2 col-4">
                <div className="card bg-primary text-white">
                  <div className="card-body text-center p-2">
                    <h6 className="mb-0">{summary.total || 0}</h6>
                    <small>Total</small>
                  </div>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-4">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Loading attendance data...</p>
            </div>
          ) : attendanceData.length === 0 ? (
            <div className="alert alert-info text-center">
              <i className="bi bi-info-circle me-2"></i>
              No students found. Select a classroom and date.
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Student</th>
                    <th>Admission No</th>
                    <th>Status</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((item, index) => (
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
                        <span className={`badge ${getStatusBadge(item.status)}`}>
                          {item.status?.toUpperCase() || 'NOT MARKED'}
                        </span>
                      </td>
                      <td>{item.note || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {viewMode === 'stats' && (
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card p-4 shadow-sm">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-bar-chart-fill text-primary me-2"></i>
                Overview
              </h6>
              <div className="mb-2">
                <div className="d-flex justify-content-between">
                  <span>Total Classes</span>
                  <span className="fw-bold">{classrooms.length}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Average Attendance</span>
                  <span className="fw-bold">
                    {classStats.length > 0 
                      ? Math.round(classStats.reduce((acc, s) => acc + s.average, 0) / classStats.length)
                      : 0}%
                  </span>
                </div>
              </div>
              <hr />
              <div>
                <small className="text-muted">Last updated: {new Date().toLocaleString()}</small>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card p-4 shadow-sm">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-graph-up text-success me-2"></i>
                Class Attendance Statistics
              </h6>
              {classStats.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  No attendance data available yet
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead className="table-success">
                      <tr>
                        <th>#</th>
                        <th>Class</th>
                        <th>Students</th>
                        <th>Attendance Rate</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {classStats.map((stat, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{stat.classroom}</td>
                          <td>{stat.total}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="progress flex-grow-1 me-2" style={{ height: '8px' }}>
                                <div 
                                  className={`progress-bar ${stat.average >= 80 ? 'bg-success' : stat.average >= 60 ? 'bg-warning' : 'bg-danger'}`}
                                  style={{ width: `${stat.average}%` }}
                                ></div>
                              </div>
                              <span className="fw-bold small">{stat.average}%</span>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${stat.average >= 80 ? 'bg-success' : stat.average >= 60 ? 'bg-warning' : 'bg-danger'}`}>
                              {stat.average >= 80 ? 'Good' : stat.average >= 60 ? 'Average' : 'Needs Improvement'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAttendance;
