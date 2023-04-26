import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom'
import './App.css';
import LoginPage from './authPages/LoginPage/LoginPage';
import RegistrationPage from './authPages/RegistrationPage/RegistrationPage';
import Dashboard from './components/Dashboard/Dashboard';
import UserEditPage from './components/userEditPage/userEditPage';

function App() {
  return (
    <div>
<>
    <Router>
      <Routes>
        <Route  path="/login" element={<LoginPage />} />
        <Route  path="/register" element={<RegistrationPage />} />
        <Route  path="/dashboard" element={<Dashboard />} />
        <Route  path="/user" element={<UserEditPage />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
    </>
    </div>
  );
}

export default App;
