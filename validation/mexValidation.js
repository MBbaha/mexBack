const Joi = require('joi');



const mexTaqsimotRegisterValidation = Joi.object({
  guestsCount: Joi.number().integer().min(1).required()
    .messages({
      'number.base': 'guestsCount raqam bo‘lishi kerak.',
      'number.min': 'Kamida 1 mehmon bo‘lishi kerak.',
      'any.required': 'guestsCount majburiy.',
    }),

  checkIn: Joi.date().iso().required()
    .messages({
      'date.base': 'checkIn sana bo‘lishi kerak.',
      'date.format': 'checkIn noto‘g‘ri formatda (YYYY-MM-DD).',
      'any.required': 'checkIn majburiy.',
    }),

  checkOut: Joi.date().iso().min(Joi.ref('checkIn')).required()
    .messages({
      'date.base': 'checkOut sana bo‘lishi kerak.',
      'date.min': 'checkOut sanasi checkIn dan keyin bo‘lishi kerak.',
      'any.required': 'checkOut majburiy.',
    }),

   companyName: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.base': 'company matn bo‘lishi kerak.',
      'string.empty': 'company bo‘sh bo‘lmasligi kerak.',
      'string.min': 'company nomi kamida 2 ta belgidan iborat bo‘lishi kerak.',
      'any.required': 'company majburiy.',
    }),

  phoneNumber: Joi.string().pattern(/^\+?\d{9,15}$/).required()
    .messages({
      'string.pattern.base': 'phoneNumber noto‘g‘ri formatda. Faqat raqamlar va ixtiyoriy "+" belgisi.',
      'string.empty': 'phoneNumber bo‘sh bo‘lmasligi kerak.',
      'any.required': 'phoneNumber majburiy.',
    }),

  isactive: Joi.boolean().optional()
});




const mexTaqsimotUpdateValidation = Joi.object({
  guestsCount: Joi.number().min(1).optional()
    .messages({
      'number.base': 'guestsCount raqam bo‘lishi kerak.',
      'number.min': 'Kamida 1 mehmon bo‘lishi kerak.'
    }),

  checkIn: Joi.date().iso().optional()
    .messages({
      'date.base': 'checkIn sana bo‘lishi kerak.',
      'date.format': 'checkIn noto‘g‘ri formatda (YYYY-MM-DD) kiritilgan.'
    }),

  checkOut: Joi.date().iso().greater(Joi.ref('checkIn')).optional()
    .messages({
      'date.base': 'checkOut sana bo‘lishi kerak.',
      'date.greater': 'checkOut sanasi checkIn dan keyin bo‘lishi kerak.',
      'date.format': 'checkOut noto‘g‘ri formatda (YYYY-MM-DD) kiritilgan.'
    }),

   companyName: Joi.string().trim().min(2).max(100).optional()
    .messages({
      'string.base': 'company matn bo‘lishi kerak.',
      'string.min': 'company nomi kamida 2 ta belgidan iborat bo‘lishi kerak.'
    }),

  phoneNumber: Joi.string().pattern(/^\+?\d{9,15}$/).optional()
    .messages({
      'string.pattern.base': 'phoneNumber noto‘g‘ri formatda. Faqat raqamlar va ixtiyoriy "+" belgisi.'
    })
});


module.exports = {
  mexTaqsimotRegisterValidation,
  mexTaqsimotUpdateValidation,
};





