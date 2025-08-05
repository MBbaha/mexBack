const { Router } = require("express");
const gusetCount = Router();

const {
  registerGuest,
  getAllRooms,
  deleteGuest,
  updateGuest,
} = require("../controllers/mex.controller");

const {
  mexTaqsimotRegisterValidation,
  mexTaqsimotUpdateValidation,
} = require("../validation/mexValidation");

// ✅ VALIDATION MIDDLEWARE
const validateSchemas = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  next();
};

// ✅ ROUTES
gusetCount.post(
  "/register",
  validateSchemas(mexTaqsimotRegisterValidation),
  registerGuest
);

gusetCount.get("/getUsers", getAllRooms);

gusetCount.put(
  "/updateUsersById/:id",
  validateSchemas(mexTaqsimotUpdateValidation),
  updateGuest // ✅ TO‘G‘RILANDI
);

gusetCount.delete('/deleteByDate', deleteGuest);

// ✅ TO‘G‘RILANDI

module.exports = gusetCount;
