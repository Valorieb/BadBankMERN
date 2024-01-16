const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  balance: {
    type: Number,
    min: 0,
    default: 0,
  },
  transactions: [
    {
      type: { type: String }, // 'deposit' or 'withdraw'
      amount: Number,
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
