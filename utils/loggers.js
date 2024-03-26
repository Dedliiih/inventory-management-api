import winston, { format } from "winston";
import "dotenv/config.js";
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const { timestamp, json, prettyPrint, errors } = format;

const loggerToken = process.env.LOGGER;
const logtail = new Logtail(loggerToken);

const rateLimitLogger = winston.createLogger({
    level: "warn",
    format: winston.format.combine(
        errors({
            stack: true
        }),
        timestamp(),
        json(),
        prettyPrint()
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: "utils/logs/ratelimit.log", level: "warn" }),
        new LogtailTransport(logtail)
    ]
});

export default rateLimitLogger;