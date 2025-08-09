const Room = require('../models/roomSchema');

// ➕ Yangi xona yaratish
const createRoom = async (req, res) => {
  try {
    const { number, capacity } = req.body;

    const roomExists = await Room.findOne({ number });
    if (roomExists) {
      return res.status(400).json({ message: 'Bunday xona allaqachon mavjud' });
    }

    const newRoom = new Room({ number, capacity });
    await newRoom.save();

    res.status(201).json({ message: 'Xona yaratildi', room: newRoom });
  } catch (err) {
    res.status(500).json({ message: 'Server xatosi', error: err.message });
  }
};


// 📄 Barcha xonalarni olish
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ roomNumber: 1 });
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Xonalarni olishda xatolik', error: err.message });
  }
};



// ✏️ Xonani yangilash
const updateRoom = async (req, res) => {
  try {
    const { roomNumber, capacity } = req.body;

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { roomNumber, capacity },
      { new: true, runValidators: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: 'Xona topilmadi' });
    }

    res.status(200).json({ message: 'Xona yangilandi', room: updatedRoom });
  } catch (err) {
    res.status(500).json({ message: 'Xonani yangilashda xatolik', error: err.message });
  }
};

// ❌ Xonani o‘chirish
const deleteRoom = async (req, res) => {
  try {
    const deletedRoom = await Room.findByIdAndDelete(req.params.id);

    if (!deletedRoom) {
      return res.status(404).json({ message: 'Xona topilmadi' });
    }

    res.status(200).json({ message: 'Xona o‘chirildi' });
  } catch (err) {
    res.status(500).json({ message: 'Xonani o‘chirishda xatolik', error: err.message });
  }
};


const getRoomAvailability = async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const allRooms = await Room.find();

    let availableRoomsCount = 0;
    let availableCapacity = 0;
    let availableDetails = [];

    // Tashkilotlar bo‘yicha guruhlash
    let occupiedByCompany = {};

    for (let room of allRooms) {
      // Shu oraliqda band bo'lgan mehmonlar
      const bookedGuests = room.guests.filter(
        (g) =>
          new Date(g.from) <= end && new Date(g.to) >= start
      );

      if (bookedGuests.length === 0) {
        // Bo'sh xona
        availableRoomsCount++;
        availableCapacity += room.capacity;
        availableDetails.push({
          number: room.number,
          free: room.capacity
        });
      } else {
        // Tashkilot nomini olish
        const companyName = bookedGuests[0]?.companyName || "Noma'lum";
        if (!occupiedByCompany[companyName]) {
          occupiedByCompany[companyName] = [];
        }
        occupiedByCompany[companyName].push({
          number: room.number,
          capacity: room.capacity
        });
      }
    }

    const totalCapacity = allRooms.reduce((sum, r) => sum + r.capacity, 0);
    const usedCapacity = totalCapacity - availableCapacity;
    const occupancyRate = ((usedCapacity / totalCapacity) * 100).toFixed(1);

    res.json({
      checkIn,
      checkOut,
      availableRooms: availableRoomsCount,
      availableCapacity,
      occupancyRate,
      occupiedByCompany, // Tashkilotlar bo‘yicha guruhlangan ma’lumot
      availableDetails
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server xatosi', error: err.message });
  }
};


// Qidiruv route






module.exports = {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getMonthlyStats


};





