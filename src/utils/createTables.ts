import pool from './db';

const createTables = async () => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    

    // Users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        phone VARCHAR(20) NOT NULL,
        role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Vehicles table
    await client.query(`
      CREATE TABLE vehicles (
        id SERIAL PRIMARY KEY,
        vehicle_name VARCHAR(100) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
        registration_number VARCHAR(50) UNIQUE NOT NULL,
        daily_rent_price DECIMAL(10,2) NOT NULL CHECK (daily_rent_price > 0),
        availability_status VARCHAR(20) DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Bookings table
    await client.query(`
      CREATE TABLE bookings (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        vehicle_id INTEGER NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
        rent_start_date DATE NOT NULL,
        rent_end_date DATE NOT NULL,
        total_price DECIMAL(10,2) NOT NULL CHECK (total_price > 0),
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT valid_date_range CHECK (rent_end_date >= rent_start_date)
      );
    `);

    await client.query('COMMIT');
    console.log('All tables created successfully with SERIAL IDs (Neon DB compatible)');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Error creating tables:', err.message);
  } finally {
    client.release();
  }
};

createTables().then(() => pool.end());