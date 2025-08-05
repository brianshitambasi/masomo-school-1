// import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import HomeComponent from './components/HomeComponent';
import NotAuthorized from './components/NotAuthorized';
import NotFound from './components/NotFound';
import RegisterComponent from './components/RegisterComponent';
import LoginComponent from './components/LoginComponent';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminLayout from './components/admin/AdminLayout';
import Classes from './components/admin/Classes';
import Teachers from './components/admin/Teachers';
import Student from './components/admin/Student';
import Parents from './components/admin/Parents';
import ClassAdd from './components/admin/forms/ClassAdd';
import ClassEdit from './components/admin/forms/ClassEdit';


function App() {
  return (
   <Router>
    {/* we wrap all routes inside the authprovider */}
    <AuthProvider>

      <Routes>
        <Route path='/' element={<HomeComponent/>}/>
        
        {/* Admin Protected Routes */}
        <Route  path='/admin-dashboard'
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout/>
          </ProtectedRoute>
        }>
          <Route  path='' element={<AdminDashboard/>}/>
          <Route  path='classes' element={<Classes/>}/>
      
          <Route  path='classes/add' element={<ClassAdd/>}/>
          <Route  path='classes/edit' element={<ClassEdit/>}/>
          
          {/* other admin routes */}

          <Route  path='teachers' element={<Teachers/>}/>
          <Route  path='students' element={<Student/>}/>
          <Route  path='parents' element={<Parents/>}/>

        </Route>

        <Route path='/login' element={<LoginComponent/>}/>
        <Route path='/register' element={<RegisterComponent/>}/>

        {/* default routes */}
        <Route path='/not-authorized' element={<NotAuthorized/>}/>
        <Route path='*' element={<NotFound/>}/>
      </Routes>
    </AuthProvider>
   </Router>
  );
}

export default App;
