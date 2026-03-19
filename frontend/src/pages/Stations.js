import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';
import '../styles/Stations.css';

export default function Stations() {
  const [stations, setStations] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchStations();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/stations');
      setStations(response.data);
    } catch (err) {
      setError('Failed to fetch stations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchCity.trim()) {
      fetchStations();
      return;
    }

    try {
      setLoading(true);
      const response = await API.get(`/stations/search/city/${searchCity}`);
      setStations(response.data);
    } catch (err) {
      setError('Search failed');
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
      } catch (err) {
        alert('Failed to delete station');
      }
    }
  };

  return (
    <div className="stations-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1>⚡ EV Charging Stations</h1>
        </div>
        <div className="nav-right">
          <span>Welcome, {user?.name}</span>
          <button onClick={() => navigate('/add-station')} className="btn-primary">
            + Add Station
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </nav>

      <div className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by city..."
            value={searchCity}
            onChange={(e) => setSearchCity(e.target.value)}
          />
          <button type="submit">Search</button>
          <button type="button" onClick={() => { setSearchCity(''); fetchStations(); }}>
            Clear
          </button>
        </form>
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Loading stations...</p>
      ) : stations.length === 0 ? (
        <p className="no-data">No stations found</p>
      ) : (
        <div className="stations-grid">
          {stations.map(station => (
            <div key={station.id} className="station-card">
              <h3>{station.name}</h3>
              <p><strong>City:</strong> {station.city}</p>
              <p><strong>Address:</strong> {station.address}</p>
              <p><strong>Charger Type:</strong> {station.charger_type}</p>
              <p><strong>Available:</strong> {station.available_chargers}/{station.total_chargers}</p>
              <p><strong>Price:</strong> ₹{station.price_per_unit}/unit</p>
              <p><strong>Rating:</strong> ⭐ {station.rating || 'N/A'}</p>
              <div className="card-actions">
                <button onClick={() => navigate(`/station/${station.id}`)} className="btn-view">
                  View
                </button>
                <button onClick={() => navigate(`/edit-station/${station.id}`)} className="btn-edit">
                  Edit
                </button>
                <button onClick={() => handleDelete(station.id)} className="btn-delete">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}