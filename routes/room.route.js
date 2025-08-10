const { Router } = require("express");
const roomCapacity = Router();

const {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
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

// Yangi xona
roomCapacity.post(
  "/register",
  validateSchemas(roomRegisterValidation),
  createRoom
);

// Barcha xonalar
roomCapacity.get("/getRoom", getAllRooms);

// Xonani yangilash
roomCapacity.put(
  "/updateRoomById/:id",
  validateSchemas(roomUpdateValidationSchema),
  updateRoom
);

// Xonani o‘chirish
roomCapacity.delete("/delete/:id", deleteRoom);

// 📊 Bo‘sh va band xonalar statistikasi (POST bo‘lishi shart)
roomCapacity.post("/availableStat", availableStat);

// Oylik statistika
roomCapacity.get("/monthly-stats", getMonthlyStats);

module.exports = roomCapacity;
