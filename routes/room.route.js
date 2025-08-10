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

// Routes
roomCapacity.post("/rooms", validateSchemas(roomRegisterValidation), createRoom);
roomCapacity.get("/rooms", getAllRooms);
roomCapacity.put("/rooms/:id", validateSchemas(roomUpdateValidationSchema), updateRoom);
roomCapacity.delete("/rooms/:id", deleteRoom);

roomCapacity.post("/rooms/availableStat", availableStat);
roomCapacity.post("/rooms/availabilityRoom",  getRoomAvailability);
roomCapacity.get("/rooms/monthly-stats", getMonthlyStats);

module.exports = roomCapacity;

