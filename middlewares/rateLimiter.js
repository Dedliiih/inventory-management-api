import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 6,
    message: "Too many request from this IP, try again later",
    statusCode: 429,
    legacyHeaders: false,
});


export default rateLimiter; 
