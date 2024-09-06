class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "internal error";
  err.statusCode = err.statusCode || 500;

  if (err.code == 1100) {
    const message = `duplicate ${Object.keys(err.keyValue)} extended`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name == "jsobWebTokenError") {
    const message = "json web token invalid";
    err = new ErrorHandler(message, 400);
  }
  if (err.name == "TokenExpiredError") {
    const message = "token expired";
    err = new ErrorHandler(message, 400);
  }
  if (err.name == "castError") {
    const message = `invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join("")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
