export const validateSignup = (body: any) => {
  const { name, email, password, phone, role } = body;

  if (!name || typeof name !== 'string' || name.trim().length < 2)
    throw new Error('Name is required and must be at least 2 characters');
  if (!email || !/^\S+@\S+\.\S+$/.test(email))
    throw new Error('Valid email is required');
  if (!password || password.length < 6)
    throw new Error('Password must be at least 6 characters');
  if (!phone || phone.length < 10)
    throw new Error('Valid phone number is required');

  const validRoles = ['customer', 'admin'];
  const finalRole = role && validRoles.includes(role) ? role : 'customer';

  return {
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password,
    phone: phone.trim(),
    role: finalRole,
  };
};

export const validateSignin = (body: any) => {
  const { email, password } = body;
  if (!email || !password) throw new Error('Email and password are required');
  if (!/^\S+@\S+\.\S+$/.test(email)) throw new Error('Valid email is required');
  return { email: email.toLowerCase().trim(), password };
};