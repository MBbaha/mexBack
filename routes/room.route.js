const { Router } = require("express");
const roomCapacity = Router();

const {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getMonthlyStats,
  getBookedRooms
 
} = require("../controllers/room.controller");

const {
  roomRegisterValidation,
  roomUpdateValidationSchema,
} = require("../validation/roomValidation");

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
roomCapacity.post(
  "/register",
  validateSchemas(roomRegisterValidation),
  createRoom
);

roomCapacity.get("/getRoom", getAllRooms);

roomCapacity.put(
  "/updateRoomById/:id",
  validateSchemas(roomUpdateValidationSchema),
  updateRoom // ✅ TO‘G‘RILANDI
);

roomCapacity.delete("/delete/:id", deleteRoom);
// ✅ TO‘G‘RILANDI

roomCapacity.post('/availableStat', getRoomAvailability);

roomCapacity.get('/getBookedRooms', getBookedRooms);

roomCapacity.get('/monthly-stats', getMonthlyStats);
module.exports = roomCapacity;

