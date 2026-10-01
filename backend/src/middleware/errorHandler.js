const errorHandler = (err, req, res, next) => {
  // Log error internally for debugging
  console.error('[Error caught by centralized middleware]:', err.name || err.message, err.stack || '');

  // Prisma Unique Constraint Violation (P2002)
  if (err.code === 'P2002') {
    const target = err.meta?.target;
    let message = 'A record with this unique value already exists.';
    if (Array.isArray(target) && target.includes('email')) {
      message = 'An account or store with this email already exists.';
    } else if (Array.isArray(target) && target.includes('userId') && target.includes('storeId')) {
      message = 'You have already submitted a rating for this store.';
    }
    return res.status(409).json({
      success: false,
      message,
    });
  }

  // Prisma Record Not Found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      success: false,
      message: 'Requested record was not found in the database.',
    });
  }

  // Prisma Foreign Key Constraint Failure (P2003)
  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'Invalid relationship reference. Associated record does not exist.',
    });
  }

  // Custom status from operational errors
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : (statusCode === 500 ? 'An unexpected server error occurred.' : err.message);

  res.status(statusCode).json({
    success: false,
    message,
    ...(err.errors ? { errors: err.errors } : {}),
  });
};

module.exports = errorHandler;
