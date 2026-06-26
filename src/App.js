// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Components
import HomeComponent from './components/HomeComponent';
import NotAuthorized from './components/NotAuthorized';
import NotFound from './components/NotFound';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';

// Context & Protected Routes
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';

// ============================================
// ADMIN IMPORTS
// ============================================
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import Classes from './components/admin/Classes';
import Teachers from './components/admin/Teachers';
import Student from './components/admin/Student';
import Parents from './components/admin/Parents';
import AdminNotifications from './components/admin/AdminNotifications';
import AdminProfile from './components/admin/AdminProfile'; // ✅ ADDED
import AdminSettings from './components/admin/AdminSettings'; // ✅ ADDED

// Admin Forms
import ClassAdd from './components/admin/forms/ClassAdd';
import ClassEdit from './components/admin/forms/ClassEdit';
import TeachersAdd from './components/admin/forms/TeacherAdd';
import TeachersEdit from './components/admin/forms/TeacherEdit';
import ParentAdd from './components/admin/forms/ParentAdd';
import ParentEdit from './components/admin/forms/ParentEdit';
import StudentsAdd from './components/admin/forms/StudentsAdd';
import StudentEdit from './components/admin/forms/StudentsEdit';

// ============================================
// TEACHER IMPORTS - ALL COMPONENTS
// ============================================
import TeacherDashboard from './components/teacher/TeacherDashboard';
import TeacherLayout from './components/teacher/TeacherLayout';
import TeacherClasses from './components/teacher/TeacherClasses';
import TeacherStudents from './components/teacher/TeacherStudents';
import TeacherAssignments from './components/teacher/TeacherAssignments';
import TeacherAssignmentAdd from './components/teacher/TeacherAssignmentAdd';
import TeacherAssignmentEdit from './components/teacher/TeacherAssignmentEdit';
import TeacherAttendance from './components/teacher/TeacherAttendance';
import TeacherGrades from './components/teacher/TeacherGrades';
import TeacherProfile from './components/teacher/TeacherProfile';
import TeacherSettings from './components/teacher/TeacherSettings';

// ============================================
// PARENT IMPORTS - ALL COMPONENTS
// ============================================
import ParentDashboard from './components/parent/ParentDashboard';
import ParentLayout from './components/parent/ParentLayout';
import ParentChildren from './components/parent/ParentChildren';
import ParentStudentDetail from './components/parent/ParentStudentDetail';
import ParentAssignments from './components/parent/ParentAssignments';
import ParentAttendance from './components/parent/ParentAttendance';
import ParentGrades from './components/parent/ParentGrades';
import ParentMessages from './components/parent/ParentMessages';
import ParentProfile from './components/parent/ParentProfile';
import ParentSettings from './components/parent/ParentSettings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path='/' element={<HomeComponent />} />
          <Route path='/login' element={<LoginComponent />} />
          <Route path='/register' element={<RegisterComponent />} />
          <Route path='/not-authorized' element={<NotAuthorized />} />
          <Route path='*' element={<NotFound />} />

          {/* ADMIN ROUTES */}
          <Route 
            path='/admin-dashboard'
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path='' element={<AdminDashboard />} />
            <Route path='classes' element={<Classes />} />
            <Route path='classes/add' element={<ClassAdd />} />
            <Route path='classes/edit' element={<ClassEdit />} />
            <Route path='teachers' element={<Teachers />} />
            <Route path='teachers/add' element={<TeachersAdd />} />
            <Route path='teachers/edit' element={<TeachersEdit />} />
            <Route path='students' element={<Student />} />
            <Route path='students/add' element={<StudentsAdd />} />
            <Route path='students/edit' element={<StudentEdit />} />
            <Route path='parents' element={<Parents />} />
            <Route path='parents/add' element={<ParentAdd />} />
            <Route path='parents/edit' element={<ParentEdit />} />
            <Route path='notifications' element={<AdminNotifications />} />
            <Route path='profile' element={<AdminProfile />} /> {/* ✅ ADDED */}
            <Route path='settings' element={<AdminSettings />} /> {/* ✅ ADDED */}
          </Route>

          {/* TEACHER ROUTES */}
          <Route 
            path='/teacher-dashboard'
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherLayout />
              </ProtectedRoute>
            }
          >
            <Route path='' element={<TeacherDashboard />} />
            <Route path='classes' element={<TeacherClasses />} />
            <Route path='students' element={<TeacherStudents />} />
            <Route path='assignments' element={<TeacherAssignments />} />
            <Route path='assignments/add' element={<TeacherAssignmentAdd />} />
            <Route path='assignments/edit' element={<TeacherAssignmentEdit />} />
            <Route path='attendance' element={<TeacherAttendance />} />
            <Route path='grades' element={<TeacherGrades />} />
            <Route path='profile' element={<TeacherProfile />} />
            <Route path='settings' element={<TeacherSettings />} />
          </Route>

          {/* PARENT ROUTES */}
          <Route 
            path='/parent-dashboard'
            element={
              <ProtectedRoute allowedRoles={['parent']}>
                <ParentLayout />
              </ProtectedRoute>
            }
          >
            <Route path='' element={<ParentDashboard />} />
            <Route path='children' element={<ParentChildren />} />
            <Route path='children/:id' element={<ParentStudentDetail />} />
            <Route path='assignments' element={<ParentAssignments />} />
            <Route path='attendance' element={<ParentAttendance />} />
            <Route path='grades' element={<ParentGrades />} />
            <Route path='messages' element={<ParentMessages />} />
            <Route path='profile' element={<ParentProfile />} />
            <Route path='settings' element={<ParentSettings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;