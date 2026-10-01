const validateRequest = (validator) => {
  return (req, res, next) => {
    const { isValid, errors } = validator(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: errors[0] || 'Validation error',
        errors,
      });
    }
    next();
  };
};

module.exports = validateRequest;
