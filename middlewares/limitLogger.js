import rateLimitLogger from "../utils/loggers.js";

const rateLimitExceeded = (req, res, next) => {
    const limit = req["rateLimit"].remaining;
    if (limit === 0) {
        rateLimitLogger.warn(`Rate limit exceeded by user: ${req.ip}.`);
    } else next();
};

export default rateLimitExceeded;