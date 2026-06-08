require("dotenv").config();

const config = {
  server: {
    host: process.env.SERVER_HOST,
    authPort: Number(process.env.SERVER_AUTH_PORT),
    user: process.env.SERVER_USER,
    incoming: process.env.SERVER_INCOMING,
  },
};

module.exports = config;
