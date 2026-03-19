const pool = require('../config/database');

const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();

    // Drop existing tables
    await connection.query('DROP TABLE IF EXISTS stations');
    await connection.query('DROP TABLE IF EXISTS users');

    // Create Users table
    await connection.query(`
      CREATE TABLE users (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        vehicle_type VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Create Stations table
    await connection.query(`
      CREATE TABLE stations (
        id BIGINT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        pincode VARCHAR(10) NOT NULL,
        latitude FLOAT NOT NULL,
        longitude FLOAT NOT NULL,
        charger_type VARCHAR(50) NOT NULL,
        availability BOOLEAN DEFAULT true,
        total_chargers INT NOT NULL,
        available_chargers INT NOT NULL,
        price_per_unit FLOAT NOT NULL,
        rating FLOAT DEFAULT 0,
        reviews TEXT,
        operating_hours VARCHAR(100) DEFAULT '24/7',
        amenities JSON,
        user_id BIGINT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_stations_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_city (city),
        INDEX idx_user_id (user_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    connection.release();
    console.log('✅ Database tables initialized successfully');
  } catch (err) {
    console.error('❌ Error initializing database:', err);
    process.exit(1);
  }
};

module.exports = initializeDatabase;
