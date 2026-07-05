const express = require('express');
const twilioRoutes = require('./routes/twilio');

const app = express();

// Twilio webhooks post form-urlencoded bodies.
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/twilio', twilioRoutes);

module.exports = app;
