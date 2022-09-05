require('dotenv').config();

module.exports = {
  discord_app_client_id:
    process.env.DISCORD_APP_CLIENT_ID || '996785185179832340',
  discord_app_client_secret: process.env.DISCORD_APP_CLIENT_SECRET || '',
};
