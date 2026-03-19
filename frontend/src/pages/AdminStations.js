import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';
import '../styles/AdminStations.css';

export default function AdminStations() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/customer/stations');
    }
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/stations');
      // Filter only admin's stations
      const adminStations = response.data.filter(s => s.user_id === user?.id);
      setStations(adminStations);
    } catch (err) {
      setError('Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this station?')) {
      try {
        await API.delete(`/stations/${id}`);
        setStations(stations.filter(s => s.id !== id));
        alert('Station deleted');
      } catch (err) {
        alert('Failed to delete station');
      }
    }
  };

  return (
    <div className="admin-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1>🔧 Admin Dashboard</h1>
        </div>
        <div className="nav-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => navigate('/admin/add-station')} className="btn-primary">
            + Add Station
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-content">
        <h2>My Charging Stations</h2>
        {error && <p className="error">{error}</p>}

        {loading ? (
          <p className="loading">Loading stations...</p>
        ) : stations.length === 0 ? (
          <p className="no-data">No stations added yet. <button onClick={() => navigate('/admin/add-station')}>Add one now</button></p>
        ) : (
          <div className="stations-table">
            <table>
              <thead>
                <tr>
                  <th>Station Name</th>
                  <th>City</th>
                  <th>Charger Type</th>
                  <th>Available</th>
                  <th>Price/Unit</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stations.map(station => (
                  <tr key={station.id}>
                    <td>{station.name}</td>
                    <td>{station.city}</td>
                    <td>{station.charger_type}</td>
                    <td>{station.available_chargers}/{station.total_chargers}</td>
                    <td>₹{station.price_per_unit}</td>
                    <td>
                      <button 
                        onClick={() => navigate(`/admin/edit-station/${station.id}`)} 
                        className="btn-edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(station.id)} 
                        className="btn-delete"
                      >
                        Delete
                      </button>
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
}