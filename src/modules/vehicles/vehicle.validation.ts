export const validateCreateVehicle = (body: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = body;

  if (!vehicle_name || typeof vehicle_name !== 'string' || vehicle_name.trim().length < 2)
    throw new Error('Vehicle name is required and must be valid');

  const validTypes = ['car', 'bike', 'van', 'SUV'];
  if (!type || !validTypes.includes(type.toLowerCase()))
    throw new Error('Type must be one of: car, bike, van, SUV');

  if (!registration_number || typeof registration_number !== 'string' || registration_number.trim() === '')
    throw new Error('Registration number is required');

  const price = Number(daily_rent_price);
  if (isNaN(price) || price <= 0)
    throw new Error('Daily rent price must be a positive number');

  const validStatus = ['available', 'booked'];
  const status = availability_status?.toLowerCase() || 'available';
  if (!validStatus.includes(status))
    throw new Error('Availability status must be available or booked');

  return {
    vehicle_name: vehicle_name.trim(),
    type: type.toLowerCase(),
    registration_number: registration_number.trim().toUpperCase(),
    daily_rent_price: price,
    availability_status: status,
  };
};

export const validateUpdateVehicle = (body: any) => {
  const updated: any = {};

  if (body.vehicle_name !== undefined) {
    if (typeof body.vehicle_name !== 'string' || body.vehicle_name.trim().

length < 2)
      throw new Error('Vehicle name must be valid');
    updated.vehicle_name = body.vehicle_name.trim();
  }

  if (body.type !== undefined) {
    const validTypes = ['car', 'bike', 'van', 'SUV'];
    if (!validTypes.includes(body.type.toLowerCase()))
      throw new Error('Invalid vehicle type');
    updated.type = body.type.toLowerCase();
  }

  if (body.registration_number !== undefined) {
    if (typeof body.registration_number !== 'string' || body.registration_number.trim() === '')
      throw new Error('Registration number is required');
    updated.registration_number = body.registration_number.trim().toUpperCase();
  }

  if (body.daily_rent_price !== undefined) {
    const price = Number(body.daily_rent_price);
    if (isNaN(price) || price <= 0)
      throw new Error('Daily rent price must be positive');
    updated.daily_rent_price = price;
  }

  if (body.availability_status !== undefined) {
    const valid = ['available', 'booked'];
    const status = body.availability_status.toLowerCase();
    if (!valid.includes(status))
      throw new Error('Status must be available or booked');
    updated.availability_status = status;
  }

  return updated;
};