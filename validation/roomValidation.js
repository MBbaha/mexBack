const Joi = require('joi');

const roomRegisterValidation = Joi.object({
  number: Joi.string().trim().min(3).max(30),
  capacity: Joi.string().trim(),
  isactive: Joi.boolean().optional()
});


const roomUpdateValidationSchema = Joi.object({
  number: Joi.string().trim().min(3).max(30),
  capacity: Joi.string().trim(),
  isactive: Joi.boolean(),
});

module.exports = {
  roomRegisterValidation,
  roomUpdateValidationSchema,
};
