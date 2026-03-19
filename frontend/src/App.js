import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminStations from './pages/AdminStations';
import AdminAddStation from './pages/AdminAddStation';
import CustomerStations from './pages/CustomerStations';
import './App.css';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Admin Routes */}
        <Route path="/admin/stations" element={<PrivateRoute><AdminStations /></PrivateRoute>} />
        <Route path="/admin/add-station" element={<PrivateRoute><AdminAddStation /></PrivateRoute>} />
        
        {/* Customer Routes */}
        <Route path="/customer/stations" element={<PrivateRoute><CustomerStations /></PrivateRoute>} />
        
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}