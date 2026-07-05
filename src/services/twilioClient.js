const twilio = require('twilio');
const config = require('../config');

module.exports = twilio(config.twilioAccountSid, config.twilioAuthToken);
