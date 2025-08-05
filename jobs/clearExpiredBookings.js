// jobs/clearExpiredBookings.js

const cron = require('node-cron');
const moment = require('moment-timezone');
const { Mextaqsimoti } = require('../models/mexSchema');

// Har kuni Saudiya vaqti bilan 12:00 da ishga tushadi
cron.schedule('0 12 * * *', async () => {
  try {
    const now = moment().tz('Asia/Riyadh').startOf('day').toDate();

    const updated = await Mextaqsimoti.updateMany(
      {
        checkOut: { $lte: now },
        isactive: true
      },
      { $set: { isactive: false } }
    );

    console.log(`✅ ${updated.modifiedCount} ta bron bekor qilindi (Saudiya vaqti bilan 12:00 da)`);
  } catch (error) {
    console.error('❌ Bronlarni tekshirishda xatolik:', error.message);
  }
});
