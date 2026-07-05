const REQUIRED_VARS = ['TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN', 'TWILIO_PHONE_NUMBER'];

const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
}

module.exports = {
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
  missedCallMessage:
    process.env.MISSED_CALL_MESSAGE ||
    "Sorry we missed your call! Someone from our team will reach out shortly. Reply here anytime.",
};
