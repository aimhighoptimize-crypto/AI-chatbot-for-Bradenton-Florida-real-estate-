const express = require('express');
const client = require('../services/twilioClient');
const config = require('../config');

const router = express.Router();

const MISSED_CALL_STATUSES = ['no-answer', 'busy', 'failed'];

// Twilio call status callback: fires when a call to our number completes,
// goes unanswered, is busy, or fails. We text back the caller on a miss.
router.post('/status', async (req, res) => {
  const { CallStatus, From, To } = req.body;

  if (MISSED_CALL_STATUSES.includes(CallStatus) && From) {
    try {
      await client.messages.create({
        body: config.missedCallMessage,
        from: To || config.twilioPhoneNumber,
        to: From,
      });
    } catch (err) {
      console.error('Failed to send missed-call text back:', err.message);
    }
  }

  res.set('Content-Type', 'text/xml');
  res.status(200).send('<Response></Response>');
});

module.exports = router;
