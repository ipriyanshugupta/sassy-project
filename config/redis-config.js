// config/redis-config.js
const { createClient } = require("redis");
const redisClient = createClient({
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 13439,
  },
});
redisClient.connect();

module.exports = redisClient;
