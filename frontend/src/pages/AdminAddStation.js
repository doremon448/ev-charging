import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../config/api';
import '../styles/Form.css';

export default function AdminAddStation() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    latitude: '',
    longitude: '',
    charger_type: 'DC Fast',
    total_chargers: '',
    available_chargers: '',
    price_per_unit: '',
    operating_hours: '24/7',
    amenities: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const amenities = formData.amenities ? formData.amenities.split(',').map(a => a.trim()) : [];
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        total_chargers: parseInt(formData.total_chargers),
        available_chargers: parseInt(formData.available_chargers),
        price_per_unit: parseFloat(formData.price_per_unit),
        amenities,
      };

      await API.post('/stations', payload);
      navigate('/admin/stations');
      alert('Station added successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add station');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-box">
        <h1>Add New Charging Station</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Station Name" value={formData.name} onChange={handleChange} required />
          <input type="text" name="address" placeholder="Address" value={formData.address} onChange={handleChange} required />
          <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} required />
          <input type="text" name="state" placeholder="State" value={formData.state} onChange={handleChange} required />
          <input type="text" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />
          <input type="number" step="0.0001" name="latitude" placeholder="Latitude" value={formData.latitude} onChange={handleChange} required />
          <input type="number" step="0.0001" name="longitude" placeholder="Longitude" value={formData.longitude} onChange={handleChange} required />
          
          <select name="charger_type" value={formData.charger_type} onChange={handleChange}>
            <option>DC Fast</option>
            <option>AC Standard</option>
            <option>AC Fast</option>
          </select>

          <input type="number" name="total_chargers" placeholder="Total Chargers" value={formData.total_chargers} onChange={handleChange} required />
          <input type="number" name="available_chargers" placeholder="Available Chargers" value={formData.available_chargers} onChange={handleChange} required />
          <input type="number" step="0.01" name="price_per_unit" placeholder="Price per Unit (₹)" value={formData.price_per_unit} onChange={handleChange} required />
          <input type="text" name="operating_hours" placeholder="Operating Hours" value={formData.operating_hours} onChange={handleChange} />
          <input type="text" name="amenities" placeholder="Amenities (comma separated)" value={formData.amenities} onChange={handleChange} />

          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add Station'}
          </button>
        </form>
      </div>
    </div>
  );
}