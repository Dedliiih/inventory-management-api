import redis from "redis";

const redisConnection = redis.createClient({
    host: "localhost",
    port: 6379
});

await redisConnection.connect();

redisConnection.on("error", err => console.log("Redis Client Error", err));

export default redisConnection;