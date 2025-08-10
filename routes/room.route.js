const { Router } = require("express");
const roomCapacity = Router();

const {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getMonthlyStats,
  availableStat
} = require("../controllers/room.controller");

const {
  roomRegisterValidation,
  roomUpdateValidationSchema,
} = require("../validation/roomValidation");

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

// 📌 ROUTES
roomCapacity.post("/register", validateSchemas(roomRegisterValidation), createRoom);
roomCapacity.get("/getRoom", getAllRooms);
roomCapacity.put("/updateRoomById/:id", validateSchemas(roomUpdateValidationSchema), updateRoom);
roomCapacity.delete("/delete/:id", deleteRoom);

// 📊 Statistikalar
roomCapacity.post('/availableStat', availableStat); // POST
roomCapacity.get('/roomAvailability', getRoomAvailability); // GET, boshqa path
roomCapacity.get('/monthly-stats', getMonthlyStats);

module.exports = roomCapacity;
