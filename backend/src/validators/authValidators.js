const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Must contain at least one uppercase letter and at least one special character
const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

const validateSignup = (data) => {
  const errors = [];
  const { name, email, password, address } = data;

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

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateLogin = (data) => {
  const errors = [];
  const { email, password } = data;

  if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
    errors.push('Please enter a valid email address.');
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push('Password is required.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validateChangePassword = (data) => {
  const errors = [];
  const { currentPassword, newPassword, confirmPassword } = data;

  if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.length === 0) {
    errors.push('Current password is required.');
  }

  if (!newPassword || typeof newPassword !== 'string' || !passwordRegex.test(newPassword)) {
    errors.push('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
  }

  if (newPassword !== confirmPassword) {
    errors.push('New password and confirmation do not match.');
  }

  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.push('New password must be different from current password.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  emailRegex,
  passwordRegex,
  validateSignup,
  validateLogin,
  validateChangePassword,
};
