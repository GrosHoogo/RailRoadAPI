const Joi = require('joi');

// User registration validation
const registerValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    pseudo: Joi.string().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('user', 'employee', 'admin'),
  });
  return schema.validate(data);
};

// User login validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
};
