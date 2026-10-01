const { emailRegex, passwordRegex } = require('./authValidators');

const ALLOWED_ROLES = ['ADMIN', 'USER', 'STORE_OWNER'];

const validateCreateUser = (data) => {
  const errors = [];
  const { name, email, password, address, role } = data;

  if (!name || typeof name !== 'string' || name.trim().length < 20 || name.trim().length > 60) {
    errors.push('Name must be between 20 and 60 characters.');
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (!password || typeof password !== 'string' || !passwordRegex.test(password)) {
    errors.push('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
  }

  if (address && (typeof address !== 'string' || address.length > 400)) {
    errors.push('Address must not exceed 400 characters.');
  }

  if (!role || !ALLOWED_ROLES.includes(role)) {
    errors.push(`Role must be one of: ${ALLOWED_ROLES.join(', ')}.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCreateUser,
  ALLOWED_ROLES,
};
