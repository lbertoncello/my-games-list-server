import rateLimit from 'express-rate-limit';

export default rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 20 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (request, res, next) =>
    res.status(429).json({
      status: false,
      message: 'Too many requests, please try again later.',
    }),
});
