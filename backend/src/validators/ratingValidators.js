const validateRating = (data) => {
  const errors = [];
  const { rating } = data;

  if (rating === undefined || rating === null) {
    errors.push('Rating is required.');
  } else if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
    errors.push('Rating must be an integer between 1 and 5.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

module.exports = {
  validateRating,
};
