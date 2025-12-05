import pool from '../../utils/db';
import { validateCreateBooking, validateUpdateBookingStatus } from './booking.validation';

export const createBooking = async (body: any, customerId: number) => {
  const { vehicle_id, rent_start_date, rent_end_date, days } = validateCreateBooking(body);

  // Check if vehicle exists and available
  const vehicleRes = await pool.query(
    `SELECT id, daily_rent_price, availability_status FROM vehicles WHERE id = $1`,
    [vehicle_id]
  );
  if (vehicleRes.rows.length === 0) throw new Error('Vehicle not found');
  const vehicle = vehicleRes.rows[0];

  if (vehicle.availability_status !== 'available')
    throw new Error('Vehicle is not available for booking');

  // Check overlapping active bookings
  const overlap = await pool.query(
    `SELECT id FROM bookings
     WHERE vehicle_id = $1
     AND status = 'active'
     AND (
       (rent_start_date <= $2 AND rent_end_date >= $2) OR
       (rent_start_date <= $3 AND rent_end_date >= $3) OR
       (rent_start_date >= $2 AND rent_end_date <= $3)
     )`,
    [vehicle_id, rent_start_date, rent_end_date]
  );
  if (overlap.rows.length > 0) throw new Error('Vehicle is already booked for selected dates');

  const total_price = Number(vehicle.daily_rent_price) * days;

  const result = await pool.query(
    `INSERT INTO bookings
     (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
     VALUES ($1, $2, $3, $4, $5, 'active')
     RETURNING id, customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status`,
    [customerId, vehicle_id, rent_start_date, rent_end_date, total_price]
  );

  // Update vehicle status to booked
  await pool.query(
    `UPDATE vehicles SET availability_status = 'booked' WHERE id = $1`,
    [vehicle_id]
  );

  return {
    ...result.rows[0],
    vehicle: {
      vehicle_name: vehicle.vehicle_name || 'N/A',
      daily_rent_price: vehicle.daily_rent_price,
    },
  };
};

export const getBookings = async (user: any) => {
  let query, values: any[] | undefined;
  if (user.role === 'admin') {
    query = `
      SELECT b.*, 
             u.name AS customer_name, u.email AS customer_email,
             v.vehicle_name, v.registration_number
      FROM bookings b
      JOIN users u ON b.customer_id = u.id
      JOIN vehicles v ON b.vehicle_id = v.id
      ORDER BY b.id DESC
    `;
    values = [];
  } else {
    query = `
      SELECT b.id, b.vehicle_id, b.rent_start_date, b.rent_end_date,
             b.total_price, b.status,
             v.vehicle_name, v.registration_number, v.type
      FROM bookings b
      JOIN vehicles v ON b.vehicle_id = v.id
      WHERE b.customer_id = $1
      ORDER BY b.id DESC
    `;
    values = [user.id];
  }

  const result = await pool.query(query, values);
  return result.rows;
};

export const updateBookingStatus = async (bookingId: number, body: any, user: any) => {
  const newStatus = validateUpdateBookingStatus(body, user.role);

  const bookingRes = await pool.query(
    `SELECT b.*, v.availability_status AS vehicle_status
     FROM bookings b
     JOIN vehicles v ON b.vehicle_id = v.id
     WHERE b.id = $1`,
    [bookingId]
  );
  if (bookingRes.rows.length === 0) throw new Error('Booking not found');
  const booking = bookingRes.rows[0];

  // Customer can only cancel before start date
  if (newStatus === 'cancelled' && user.id !== booking.customer_id) {
    throw new Error('You can only cancel your own booking');
  }
  const today = new Date().toISOString().split('T')[0];
  if (newStatus === 'cancelled' && today >= booking.rent_start_date) {
    throw new Error('Cannot cancel booking on or after start date');
  }

  await pool.query(
    `UPDATE bookings SET status = $1 WHERE id = $2`,
    [newStatus, bookingId]
  );

  // Update vehicle availability
  if (newStatus === 'cancelled' || newStatus === 'returned') {
    await pool.query(
      `UPDATE vehicles SET availability_status = 'available' WHERE id = $1`,
      [booking.vehicle_id]
    );
  }

  const message =
    newStatus === 'returned'
      ? 'Booking marked as returned. Vehicle is now available'
      : 'Booking cancelled successfully';

  return { message, booking: { ...booking, status: newStatus } };
};