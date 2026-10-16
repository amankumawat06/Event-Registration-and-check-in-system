import { rateLimit } from "express-rate-limit";

export const authlimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // time window is 15 min
  limit: 5, // 5 requests per client during that window windows
  // messgae to show when user hit the limit
  message: {
    success: false,
    message: "Too many requests, Please Try again later!",
  },
  standardHeaders: "draft-8", // send rate-limiting information to res headers
  legacyHeaders: false, // disable older X-RateLimit-* headers
});


//Grnaral api limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later!",
  },
});
