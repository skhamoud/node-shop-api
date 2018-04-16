const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: {
    type: String,
    // set: v => v.toLowerCase(), // return value of setter is the one saved in db
    required: true,
    minlength: 3
  },
  password: { type: String, required: true },
  phone: Number,
  role: String
});

// instance doc methods
userSchema.method({
  isPasswordValid: async function _validateUserPassword(password) {
    const hashedPassword = this.password;
    return await bcrypt.compare(password, hashedPassword);
  }
});

// class static methods of the Model made from this schema i.e User
userSchema.static({
  hashPassword: async function _hasPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    // bcrypt.hash(password, saltRounds) also internally gives back same end result
    return hash;
  }
});

module.exports = mongoose.model('User', userSchema);
