const { emailRegex } = require('./authValidators');

const validateCreateStore = (data) => {
  const errors = [];
  const { name, email, address, ownerId } = data;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    errors.push('Store name is required.');
  } else if (name.trim().length > 100) {
    errors.push('Store name must not exceed 100 characters.');
  }

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (!address || typeof address !== 'string' || address.trim().length === 0) {
    errors.push('Address is required.');
  } else if (address.length > 400) {
    errors.push('Address must not exceed 400 characters.');
  }

  const parsedOwnerId = parseInt(ownerId, 10);
  if (isNaN(parsedOwnerId) || parsedOwnerId <= 0) {
    errors.push('A valid Store Owner must be selected.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateCreateStore,
};
