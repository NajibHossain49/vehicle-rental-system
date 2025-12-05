const getDaysBetween = (start: string, end: string): number => {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e.getTime() - s.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1; // inclusive
};

export const validateCreateBooking = (body: any) => {
  const { vehicle_id, rent_start_date, rent_end_date } = body;

  const vid = Number(vehicle_id);
  if (!vehicle_id || isNaN(vid) || vid <= 0)
    throw new Error('Valid vehicle_id is required');

  if (!rent_start_date || !rent_end_date)
    throw new Error('Both rent_start_date and rent_end_date are required');

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);

  if (isNaN(start.getTime()) || isNaN(end.getTime()))
    throw new Error('Valid dates are required (YYYY-MM-DD)');

  if (end < start)
    throw new Error('rent_end_date must be after or same as rent_start_date');

  const days = getDaysBetween(rent_start_date, rent_end_date);
  if (days > 365) throw new Error('Booking duration cannot exceed 1 year');

  return {
    vehicle_id: vid,
    rent_start_date: rent_start_date,
    rent_end_date: rent_end_date,
    days,
  };
};

export const validateUpdateBookingStatus = (body: any, currentUserRole: string) => {
  const { status } = body;

  if (!status || !['cancelled', 'returned'].includes(status.toLowerCase())) {
    throw new Error('Status must be cancelled or returned');
  }

  const finalStatus = status.toLowerCase();

  // Only customer can cancel, only admin can return
  if (finalStatus === 'cancelled' && currentUserRole !== 'customer')
    throw new Error('Only customer can cancel their booking');
  if (finalStatus === 'returned' && currentUserRole !== 'admin')
    throw new Error('Only admin can mark booking as returned');

  return finalStatus;
};