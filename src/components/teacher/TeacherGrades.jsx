import React, { useContext, useState, useEffect, useCallback } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';

const TeacherGrades = () => {
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState('');
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState({});
  // ✅ FIXED: Removed unused setSubjects
  const subjects = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art', 'Music', 'Physical Education'];
  const [selectedSubject, setSelectedSubject] = useState('');
  const [examType, setExamType] = useState('CAT 1');
  const [term, setTerm] = useState(1);
  const [gradeSummary, setGradeSummary] = useState(null);

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

  // Fetch students when classroom is selected
  const fetchStudents = useCallback(async () => {
    if (!selectedClassroom) return;
    
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/classroom/${selectedClassroom}`, authHeader);
      const studentsData = res.data.students || [];
      setStudents(studentsData);
      
      const gradesMap = {};
      studentsData.forEach(student => {
        gradesMap[student._id] = {
          score: '',
          grade: '',
          remarks: ''
        };
      });
      setGrades(gradesMap);
      calculateSummary(gradesMap);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  }, [selectedClassroom, token]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const calculateSummary = (gradesData) => {
    const values = Object.values(gradesData).filter(g => g.score && g.score !== '');
    if (values.length === 0) {
      setGradeSummary(null);
      return;
    }

    const scores = values.map(g => parseFloat(g.score)).filter(s => !isNaN(s));
    if (scores.length === 0) {
      setGradeSummary(null);
      return;
    }

    const total = scores.reduce((a, b) => a + b, 0);
    const average = total / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    const passed = scores.filter(s => s >= 50).length;
    const failed = scores.filter(s => s < 50).length;

    setGradeSummary({
      total: scores.length,
      average: average.toFixed(1),
      highest: highest,
      lowest: lowest,
      passed: passed,
      failed: failed,
      passRate: ((passed / scores.length) * 100).toFixed(1)
    });
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades(prev => {
      const updated = {
        ...prev,
        [studentId]: {
          ...prev[studentId],
          [field]: value
        }
      };
      
      if (field === 'score') {
        const score = parseFloat(value);
        let grade = '';
        if (!isNaN(score)) {
          if (score >= 80) grade = 'A';
          else if (score >= 70) grade = 'B+';
          else if (score >= 60) grade = 'B';
          else if (score >= 50) grade = 'C+';
          else if (score >= 40) grade = 'C';
          else if (score >= 30) grade = 'D';
          else grade = 'E';
          updated[studentId].grade = grade;
        } else {
          updated[studentId].grade = '';
        }
      }
      
      setTimeout(() => calculateSummary(updated), 0);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedClassroom || !selectedSubject) {
      toast.error('Please select a classroom and subject');
      return;
    }

    setSaving(true);
    const authHeader = {
      headers: { Authorization: `Bearer ${token}` }
    };

    try {
      const gradesData = Object.keys(grades).map(studentId => ({
        studentId,
        score: parseFloat(grades[studentId].score) || 0,
        grade: grades[studentId].grade || '',
        remarks: grades[studentId].remarks || ''
      }));

      const payload = {
        classroomId: selectedClassroom,
        subject: selectedSubject,
        examType: examType,
        term: term,
        grades: gradesData
      };

      const res = await axios.post(
        `${API_URL}/grades`,
        payload,
        authHeader
      );

      toast.success(res.data.message || 'Grades saved successfully');
    } catch (error) {
      console.error('Error saving grades:', error);
      toast.error(error.response?.data?.message || 'Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  const getGradeColor = (grade) => {
    const colors = {
      'A': 'text-success fw-bold',
      'B+': 'text-success',
      'B': 'text-primary',
      'C+': 'text-primary',
      'C': 'text-warning',
      'D': 'text-warning',
      'E': 'text-danger'
    };
    return colors[grade] || '';
  };

  const exportGrades = () => {
    if (students.length === 0) return;
    
    let csv = 'Student Name,Admission Number,Score,Grade,Remarks\n';
    students.forEach(student => {
      const grade = grades[student._id] || {};
      csv += `${student.name},${student.admissionNumber},${grade.score || ''},${grade.grade || ''},${grade.remarks || ''}\n`;
    });
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grades_${selectedSubject}_${examType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mt-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item fw-bold">
            <Link to="/teacher-dashboard">Dashboard</Link>
          </li>
          <li className="breadcrumb-item-active">/ Grades</li>
        </ol>
      </nav>

      <div className="card p-4 shadow-sm">
        <h5 className="fw-bold mb-3">
          <i className="bi bi-graph-up text-success me-2"></i>
          Manage Grades
        </h5>

        <form className="row g-3 mb-4">
          <div className="col-md-3">
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
          <div className="col-md-3">
            <label className="form-label fw-semibold">Subject</label>
            <select
              className="form-control"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Exam Type</label>
            <select
              className="form-control"
              value={examType}
              onChange={(e) => setExamType(e.target.value)}
              disabled={loading}
            >
              <option value="CAT 1">CAT 1</option>
              <option value="CAT 2">CAT 2</option>
              <option value="CAT 3">CAT 3</option>
              <option value="End of Term">End of Term</option>
              <option value="End of Year">End of Year</option>
            </select>
          </div>
          <div className="col-md-2">
            <label className="form-label fw-semibold">Term</label>
            <select
              className="form-control"
              value={term}
              onChange={(e) => setTerm(parseInt(e.target.value))}
              disabled={loading}
            >
              <option value={1}>Term 1</option>
              <option value={2}>Term 2</option>
              <option value={3}>Term 3</option>
            </select>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={fetchStudents}
              disabled={loading || !selectedClassroom}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </span>
                  Loading...
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2"></i>
                  Load Students
                </>
              )}
            </button>
          </div>
        </form>

        {gradeSummary && (
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{gradeSummary.average}%</h5>
                  <small>Average Score</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-success text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{gradeSummary.highest}</h5>
                  <small>Highest</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-danger text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{gradeSummary.lowest}</h5>
                  <small>Lowest</small>
                </div>
              </div>
            </div>
            <div className="col-md-2">
              <div className="card bg-success text-white">
                <div className="card-body text-center p-2">
                  <h5 className="mb-0">{gradeSummary.passRate}%</h5>
                  <small>Pass Rate</small>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="row g-1">
                <div className="col-6">
                  <div className="card bg-success text-white text-center p-1">
                    <small>Passed</small>
                    <h6 className="mb-0">{gradeSummary.passed}</h6>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card bg-danger text-white text-center p-1">
                    <small>Failed</small>
                    <h6 className="mb-0">{gradeSummary.failed}</h6>
                  </div>
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
          </div>
        ) : students.length === 0 ? (
          <div className="alert alert-info text-center">
            <i className="bi bi-info-circle me-2"></i>
            No students found. Select a classroom and click "Load Students".
          </div>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered">
                <thead className="table-success">
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Admission No</th>
                    <th style={{ minWidth: '120px' }}>Score</th>
                    <th style={{ minWidth: '100px' }}>Grade</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr key={student._id}>
                      <td>{index + 1}</td>
                      <td>
                        {student.photo ? (
                          <img
                            src={`${API_URL}/${student.photo}`}
                            alt={student.name}
                            className="rounded-circle me-2"
                            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
                          />
                        ) : (
                          <i className="bi bi-person-circle me-2"></i>
                        )}
                        {student.name}
                      </td>
                      <td>{student.admissionNumber}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          min="0"
                          max="100"
                          placeholder="Score"
                          value={grades[student._id]?.score || ''}
                          onChange={(e) => handleGradeChange(student._id, 'score', e.target.value)}
                          disabled={saving}
                          style={{ width: '120px' }}
                        />
                      </td>
                      <td>
                        <span className={`badge bg-light fs-6 ${getGradeColor(grades[student._id]?.grade)}`}>
                          {grades[student._id]?.grade || '-'}
                        </span>
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="Remarks"
                          value={grades[student._id]?.remarks || ''}
                          onChange={(e) => handleGradeChange(student._id, 'remarks', e.target.value)}
                          disabled={saving}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="d-flex gap-2 mt-3">
              <button
                type="button"
                className="btn btn-success"
                onClick={handleSubmit}
                disabled={saving || !selectedSubject}
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
                    Save Grades
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={exportGrades}
                disabled={students.length === 0}
              >
                <i className="bi bi-download me-2"></i>
                Export CSV
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setGrades({});
                  setGradeSummary(null);
                  toast.info('Grades cleared');
                }}
              >
                <i className="bi bi-arrow-counterclockwise me-2"></i>
                Clear All
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TeacherGrades;
