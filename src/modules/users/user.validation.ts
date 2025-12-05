export const validateUpdateUser = (body: any) => {
  const updated: any = {};

  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length < 2)
      throw new Error('Name must be at least 2 characters');
    updated.name = body.name.trim();
  }

  if (body.email !== undefined) {
    if (!/^\S+@\S+\.\S+$/.test(body.email))
      throw new Error('Valid email is required');
    updated.email = body.email.toLowerCase().trim();
  }

  if (body.phone !== undefined) {
    if (typeof body.phone !== 'string' || body.phone.trim().length < 10)
      throw new Error('Valid phone number is required');
    updated.phone = body.phone.trim();
  }

  if (body.role !== undefined) {
    const validRoles = ['admin', 'customer'];
    if (!validRoles.includes(body.role.toLowerCase()))
      throw new Error('Role must be admin or customer');
    updated.role = body.role.toLowerCase();
  }

  if (Object.keys(updated).length === 0) {
    throw new Error('No valid fields provided for update');
  }

  return updated;
};