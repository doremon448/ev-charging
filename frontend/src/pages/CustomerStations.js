import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';
import '../styles/CustomerStations.css';

export default function CustomerStations() {
  const [stations, setStations] = useState([]);
  const [searchCity, setSearchCity] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.role !== 'customer') {
      navigate('/admin/stations');
    }
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

  const handleBook = (stationId) => {
    alert(`Booking request sent for station ID: ${stationId}`);
    // Later you can add booking functionality
  };

  return (
    <div className="customer-container">
      <nav className="navbar">
        <div className="nav-left">
          <h1>⚡ EV Charging Stations</h1>
        </div>
        <div className="nav-right">
          <span>Welcome, {user?.name}</span>
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
              <div className="station-header">
                <h3>{station.name}</h3>
                <span className={`availability ${station.available_chargers > 0 ? 'available' : 'unavailable'}`}>
                  {station.available_chargers > 0 ? '✓ Available' : '✗ Full'}
                </span>
              </div>
              <p><strong>City:</strong> {station.city}, {station.state}</p>
              <p><strong>Address:</strong> {station.address}</p>
              <p><strong>Charger Type:</strong> {station.charger_type}</p>
              <p><strong>Available:</strong> {station.available_chargers}/{station.total_chargers}</p>
              <p><strong>Price:</strong> ₹{station.price_per_unit}/unit</p>
              <p><strong>Rating:</strong> ⭐ {station.rating || 'Not rated'}</p>
              <p><strong>Hours:</strong> {station.operating_hours}</p>
              
              {station.amenities && station.amenities.length > 0 && (
                <p><strong>Amenities:</strong> {station.amenities.join(', ')}</p>
              )}

              <button 
                onClick={() => handleBook(station.id)} 
                className={`btn-book ${station.available_chargers === 0 ? 'disabled' : ''}`}
                disabled={station.available_chargers === 0}
              >
                {station.available_chargers > 0 ? 'Book Charger' : 'Not Available'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}