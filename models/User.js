const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["user", "admin", "finance"], default: "user" },
  phone: { type: String },
  countryCode: { type: String },
  address: { type: String },
  birthdate: { type: Date },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Not Selected"],
  },
  bankAccount: {
    type: Number,
    default: 0,
  },
  ipAdress: { type: String },
  location: { type: String },
});

UserSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", UserSchema);
