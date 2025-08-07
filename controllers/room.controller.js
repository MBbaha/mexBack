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
    const fromDate = new Date(checkIn);
    const toDate = new Date(checkOut);

    const allRooms = await Room.find();

    let availableRoomCount = 0;
    let availableCapacity = 0;
    let totalCapacity = 209;

    const detailedList = [];

    for (const room of allRooms) {
      totalCapacity += room.capacity;

      let occupiedCount = 0;
      for (const guest of room.guests) {
        const guestFrom = new Date(guest.from);
        const guestTo = new Date(guest.to);

        // Sana oralig‘ida to‘qnash keladiganlar band hisoblanadi
        if (
          (fromDate <= guestTo && toDate >= guestFrom)
        ) {
          occupiedCount++;
        }
      }

      const free = room.capacity - occupiedCount;
      if (free > 0) {
        availableRoomCount++;
        availableCapacity += free;
        detailedList.push({
          number: room.number,
          free: `${free}/${room.capacity}`,
        });
      }
    }

    const occupancyRate = Math.round(
      ((totalCapacity - availableCapacity) / totalCapacity) * 100
    );

    res.json({
      availableRooms: availableRoomCount,
      availableCapacity,
      totalCapacity,
      occupancyRate,
      details: detailedList,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};
// controller/statController.js


const getMonthlyStats = async (req, res) => {
  try {
    const { year, month } = req.query;

    const startOfMonth = new Date(year, month - 1, 1);
    const endOfMonth = new Date(year, month, 0); // Oxirgi kun

    const allRooms = await Room.find();
    const totalRooms = allRooms.length;
    const totalCapacity = allRooms.reduce((acc, r) => acc + r.capacity, 0);

    let usedCount = 0;

    for (const room of allRooms) {
      for (const guest of room.guests) {
        const guestFrom = new Date(guest.from);
        const guestTo = new Date(guest.to);

        // Faqat shu oyga to‘g‘ri keladiganlar
        if (
          guestFrom <= endOfMonth &&
          guestTo >= startOfMonth
        ) {
          usedCount++;
        }
      }
    }

    const occupancyRate = totalCapacity
      ? ((usedCount / totalCapacity) * 100).toFixed(1)
      : 0;

    res.json({
      year,
      month,
      totalRooms,
      totalCapacity,
      usedCount,
      occupancyRate: Number(occupancyRate),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Xatolik yuz berdi' });
  }
};








module.exports = {
  createRoom,
  getAllRooms,
  deleteRoom,
  updateRoom,
  getRoomAvailability,
  getMonthlyStats
  

};
