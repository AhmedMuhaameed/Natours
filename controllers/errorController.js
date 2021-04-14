const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
  const value = Object.keys(err.keyValue);
  const message = `Duplicate field value :'${value}'. Please use another value`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('invalid token, please login again', 401);

const handleJWTExpired = () =>
  new AppError('Your token has expired please login again', 401);
const sendErrorDev = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //RENDERD website
  console.error('ERROR 💥', err);
  return res.status(err.statusCode).render('error', {
    title: 'Somthing went wrong!',
    msg: err.message,
  });
};
const sendErrorProd = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    //operational error(sent from client)
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }
    //programming error
    return res.status(500).json({
      status: 'error',
      message: 'somthing went very wrong!',
    });
  }
  //RENDERED Website
  //operational error(sent from client)
  if (err.isOperational) {
    console.log(err);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  //programming error
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong!',
    msg: 'Please try again later.'
  });
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.name = err.name;
    error.message=err.message;
    //handle Casting DB errors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    //handle duplicate Fields
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    //handle DB validation errors
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    //handle JWT authorization errors
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    //handle JWT expired
    if (error.name === 'TokenExpierdError') error = handleJWTExpired();

    sendErrorProd(error, req,res);
  }
};
