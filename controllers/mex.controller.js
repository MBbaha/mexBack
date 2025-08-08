const Room = require('../models/roomSchema');

// POST: Mehmonlarni avtomatik taqsimlash
const registerGuest = async (req, res) => {
  const { guestsCount, checkIn, checkOut, companyName, phoneNumber } = req.body;

  if (!guestsCount || !checkIn || !checkOut|| !companyName || !phoneNumber) {
    return res.status(400).json({ message: 'guestsCount, checkIn va checkOut majburiy.' });
  }


  const guests = Array.from({ length: guestsCount }, (_, i) => ({
    name: `Guest ${Date.now()}-${i + 1}`,
    from: checkIn,
    to: checkOut,
    companyName: companyName,
    phoneNumber:phoneNumber,
  }));

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const allRooms = await Room.find();

    const roomsWithEtaj = allRooms.map(room => ({
      ...room._doc,
      etaj: Math.floor(parseInt(room.roomNumber) / 100),
    }));

    const grouped = {};
    for (let room of roomsWithEtaj) {
      if (!grouped[room.etaj]) grouped[room.etaj] = [];
      grouped[room.etaj].push(room);
    }

    const sortedEtajKeys = Object.keys(grouped).sort((a, b) => a - b);

    let guestIndex = 0;

    for (let etaj of sortedEtajKeys) {
      const sortedRooms = grouped[etaj].sort((a, b) => {
        if (b.capacity !== a.capacity) return b.capacity - a.capacity;
        return parseInt(a.roomNumber) - parseInt(b.roomNumber);
      });

      for (let room of sortedRooms) {
        const overlapping = room.guests.filter(g => {
          const gFrom = new Date(g.from);
          const gTo = new Date(g.to);
          return checkInDate < gTo && checkOutDate > gFrom;
        });

        const available = room.capacity - overlapping.length;

        if (available > 0) {
          const toAdd = guests.slice(guestIndex, guestIndex + available);
          room.guests.push(...toAdd);

          const roomDoc = await Room.findById(room._id);
          roomDoc.guests = room.guests;
          await roomDoc.save();

          guestIndex += toAdd.length;
        }

        if (guestIndex >= guestsCount) break;
      }

      if (guestIndex >= guestsCount) break;
    }

    if (guestIndex < guestsCount) {
      return res.status(206).json({
        message: `${guestsCount - guestIndex} ta mehmon joylashtirilmadi.`,
        notAccommodated: guestsCount - guestIndex,
      });
    }

    res.status(200).json({ message: `✅ Barcha mehmonlar "${companyName}" firmasidan joylashtirildi.` });
  } catch (err) {
    res.status(500).json({ message: '❌ Xatolik yuz berdi', error: err.message });
  }
};






// GET: Barcha xonalar
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Xatolik', error: err.message });
  }
};

// DELETE: Mehmonni o‘chirish
const deleteGuest = async (req, res) => {
  const { guestsCount, checkIn, checkOut } = req.body;

  if (!guestsCount || !checkIn || !checkOut) {
    return res.status(400).json({ message: 'guestsCount va checkIn majburiy.' });
  }

  let guestsToRemove = parseInt(guestsCount, 10);
  if (isNaN(guestsToRemove) || guestsToRemove <= 0) {
    return res.status(400).json({ message: 'guestsCount musbat son bo‘lishi kerak.' });
  }

  try {
    const targetDate = new Date(checkIn);
    let removedCount = 0;

    const rooms = await Room.find();

    for (let room of rooms) {
      const remainingGuests = [];

      for (let guest of room.guests) {
        const guestFrom = new Date(guest.from);
        const guestTo = new Date(guest.to);

        const isOnDate = targetDate >= guestFrom && targetDate <= guestTo;

        if (isOnDate && guestsToRemove > 0) {
          removedCount++;
          guestsToRemove--;
          // o‘chiriladi
        } else {
          remainingGuests.push(guest);
        }
      }

      if (room.guests.length !== remainingGuests.length) {
        room.guests = remainingGuests;
        await room.save();
      }

      if (guestsToRemove <= 0) break;
    }

    if (removedCount > 0) {
      return res.status(200).json({ message: `${removedCount} ta mehmon ${checkIn} sanasi uchun o‘chirildi.` });
    } else {
      return res.status(404).json({ message: '❌ Belgilangan sana uchun bron topilmadi.' });
    }

  } catch (err) {
    console.error('❌ Server xatolik:', err);
    return res.status(500).json({ message: 'Server xatoligi.', error: err.message });
  }
};





// PUT: Mehmonni yangilash
const updateGuest = async (req, res) => {
  const { guestName } = req.params;
  const { newFrom, newTo } = req.body;

  if (!newFrom && !newTo) {
    return res.status(400).json({ message: "Yangi sana kiritilmadi." });
  }

  try {
    let updated = false;
    const rooms = await Room.find();

    for (let room of rooms) {
      const guest = room.guests.find(g => g.name === guestName);
      if (guest) {
        if (newFrom) guest.from = newFrom;
        if (newTo) guest.to = newTo;
        await room.save();
        updated = true;
        break;
      }
    }

    if (updated) {
      res.json({ message: `${guestName} yangilandi.` });
    } else {
      res.status(404).json({ message: 'Mehmon topilmadi.' });
    }
  } catch (err) {
    res.status(500).json({ message: 'Xatolik yuz berdi', error: err.message });
  }
};

module.exports = {
  registerGuest,
  getAllRooms,
  deleteGuest,
  updateGuest
};







