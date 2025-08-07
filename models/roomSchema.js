  const mongoose = require('mongoose');

  const guestSchema = new mongoose.Schema({
    name: String,
    from: Date,
    to: Date,
    guestsCount:String,
     companyName: String,
    phoneNumber: String
  });

  const roomSchema = new mongoose.Schema({
    number: { type: String, unique: true },
    capacity: { type: String,},
    guests: [guestSchema],
  });

  module.exports = mongoose.model('Room', roomSchema);


