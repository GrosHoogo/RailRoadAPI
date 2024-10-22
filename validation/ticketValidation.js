// validation/ticketValidation.js
const Joi = require('joi');

const ticketBookingSchema = Joi.object({
  trainId: Joi.string().required(),
});

const ticketValidationSchema = Joi.object({
  ticketId: Joi.string().required(),
});

module.exports = { ticketBookingSchema, ticketValidationSchema };
