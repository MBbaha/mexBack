const Joi = require('joi');

const mexTaqsimotRegisterValidation = Joi.object({
  guestsCount: Joi.number().integer().min(1).required(),
  checkIn: Joi.date().iso().required(),
  checkOut: Joi.date().iso().min(Joi.ref('checkIn')).required(),
  isactive: Joi.boolean().optional()
});



const mexTaqsimotUpdateValidation = Joi.object({
  guestsCount: Joi.number().min(1).optional()
    .messages({
      'number.base': 'guestCount raqam bo‘lishi kerak.',
      'number.min': 'Kamida 1 mehmon bo‘lishi kerak.'
    }),

  checkIn: Joi.date().iso().optional()
    .messages({
      'date.format': 'checkIn sana noto‘g‘ri formatda (YYYY-MM-DD) kiritilgan.'
    }),

  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).optional()
    .messages({
      'date.greater': 'checkOut sanasi checkIn dan keyin bo‘lishi kerak.',
      'date.format': 'checkOut sana noto‘g‘ri formatda (YYYY-MM-DD) kiritilgan.'
    })
});

module.exports = {
  mexTaqsimotRegisterValidation,
  mexTaqsimotUpdateValidation,
};


