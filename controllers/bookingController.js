const stripe = require('stripe');
const Tour = require('../models/tourModel.js');
const Booking = require('../models/bookingModel.js');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory.js');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //1)Get currently booked Tour
  const tour = await Tour.findById(req.params.tourID);
  //2)Create Checkout session
  const session = await stripe(process.env.STRIPE_SECRET_KEY).checkout.sessions.create({
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourID}&user=${
      req.user.id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: tour.summary,
        images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: 'usd',
        quantity: 1,
      },
    ],
  });
  //3)send it to the Client
  res.status(200).json({
    status: 'success',
    session,
  });
});

exports.createBookingCheckout = catchAsync(async(req, res, next) => {
  //this is temporary solution Not secured
  const { tour, user, price } = req.query;

  if(!tour && !user && ! price) return next();
  await Booking.create({tour,user,price});

  res.redirect(req.originalUrl.split('?')[0]);
});

exports.createBooking =factory.createOne(Booking);
exports.getBooking =factory.getOne(Booking);
exports.getAllBookings =factory.getAll(Booking);
exports.updateBooking =factory.UpdateOne(Booking);
exports.deleteBooking =factory.deleteOne(Booking);