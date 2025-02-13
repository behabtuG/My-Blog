export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

// Global Error Handler
// app.use((err, req, res, next) => {
//   res.status(err.statusCode || 500).json({
//     success: false,
//     status: err.statusCode || 500,
//     message: err.message || "Internal Server Error",
//   });
// });
