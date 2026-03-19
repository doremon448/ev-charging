const pool = require('../config/database');

// Get all stations
exports.getAllStations = async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [stations] = await connection.query(
      `SELECT id, name, address, city, state, pincode, latitude, longitude, 
              charger_type, availability, total_chargers, available_chargers, 
              price_per_unit, rating, reviews, operating_hours, amenities, 
              created_at, updated_at FROM stations ORDER BY created_at DESC`
    );
    connection.release();
    res.json(stations);
  } catch (err) {
    console.error('Get stations error:', err);
    res.status(500).json({ message: 'Failed to fetch stations', error: err.message });
  }
};

// Get station by ID
exports.getStationById = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [stations] = await connection.query(
      `SELECT id, name, address, city, state, pincode, latitude, longitude, 
              charger_type, availability, total_chargers, available_chargers, 
              price_per_unit, rating, reviews, operating_hours, amenities, 
              created_at, updated_at FROM stations WHERE id = ?`,
      [id]
    );
    connection.release();

    if (stations.length === 0) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.json(stations[0]);
  } catch (err) {
    console.error('Get station error:', err);
    res.status(500).json({ message: 'Failed to fetch station', error: err.message });
  }
};

// Search stations by city
exports.searchByCity = async (req, res) => {
  const { city } = req.params;

  try {
    const connection = await pool.getConnection();
    const [stations] = await connection.query(
      `SELECT id, name, address, city, state, pincode, latitude, longitude, 
              charger_type, availability, total_chargers, available_chargers, 
              price_per_unit, rating, reviews, operating_hours, amenities, 
              created_at, updated_at FROM stations WHERE LOWER(city) LIKE LOWER(?) 
              ORDER BY created_at DESC`,
      [`%${city}%`]
    );
    connection.release();
    res.json(stations);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Search failed', error: err.message });
  }
};

// Create new station
exports.createStation = async (req, res) => {
  const {
    name,
    address,
    city,
    state,
    pincode,
    latitude,
    longitude,
    charger_type,
    total_chargers,
    available_chargers,
    price_per_unit,
    operating_hours,
    amenities,
  } = req.body;

  if (!name || !address || !city || !state || !pincode || !latitude || !longitude || !charger_type || !total_chargers || !price_per_unit) {
    return res.status(400).json({ message: 'All required fields must be provided' });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.query(
      `INSERT INTO stations 
       (name, address, city, state, pincode, latitude, longitude, charger_type, 
        total_chargers, available_chargers, price_per_unit, operating_hours, amenities, user_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        address,
        city,
        state,
        pincode,
        latitude,
        longitude,
        charger_type,
        total_chargers,
        available_chargers || total_chargers,
        price_per_unit,
        operating_hours || '24/7',
        JSON.stringify(amenities || []),
        req.user.id,
      ]
    );

    connection.release();
    res.status(201).json({ 
      id: result.insertId,
      name,
      address,
      city,
      state,
      pincode,
      latitude,
      longitude,
      charger_type,
      availability: true,
      total_chargers,
      available_chargers: available_chargers || total_chargers,
      price_per_unit,
      rating: 0,
      reviews: null,
      operating_hours: operating_hours || '24/7',
      amenities: amenities || []
    });
  } catch (err) {
    console.error('Create station error:', err);
    res.status(400).json({ message: 'Failed to create station', error: err.message });
  }
};

// Update station
exports.updateStation = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const connection = await pool.getConnection();

    // Check if station exists
    const [stationCheck] = await connection.query('SELECT * FROM stations WHERE id = ?', [id]);
    if (stationCheck.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Station not found' });
    }

    // Build dynamic update query
    const fields = [];
    const values = [];

    Object.keys(updates).forEach((key) => {
      const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
      fields.push(`${dbKey} = ?`);
      values.push(updates[key]);
    });

    values.push(id);

    const query = `UPDATE stations SET ${fields.join(', ')} WHERE id = ?`;
    await connection.query(query, values);

    // Fetch updated station
    const [updatedStations] = await connection.query('SELECT * FROM stations WHERE id = ?', [id]);
    connection.release();

    res.json(updatedStations[0]);
  } catch (err) {
    console.error('Update station error:', err);
    res.status(400).json({ message: 'Failed to update station', error: err.message });
  }
};

// Delete station
exports.deleteStation = async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();

    const [stationCheck] = await connection.query('SELECT * FROM stations WHERE id = ?', [id]);
    if (stationCheck.length === 0) {
      connection.release();
      return res.status(404).json({ message: 'Station not found' });
    }

    await connection.query('DELETE FROM stations WHERE id = ?', [id]);
    connection.release();

    res.json({ message: 'Station deleted successfully' });
  } catch (err) {
    console.error('Delete station error:', err);
    res.status(500).json({ message: 'Failed to delete station', error: err.message });
  }
};