const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');


const UserSchema = new mongoose.Schema({
  username:  { type: String, unique: true }, // Will be auto-generated
  firstName: { type: String },
  lastName:  { type: String },
  email:       { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Should be stored as plain text if no bcrypt is use
  role:        { type: String, enum: ["user", "admin", "finance"], default: "user" },
  phone:       { type: String },
  countryCode:     { type: String },
  address:     { type: String },
  birthdate:   { type: Date },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other", "Not Selected"],
  },
  bankAccount: { type: String }, // For finance admin to update user bank details
  ipAdress:    { type: String }, // For finance admin to update user IP address
  location:    { type: String }, // For finance admin to update user location
});


UserSchema.plugin(passportLocalMongoose, { usernameField: 'email' });


module.exports = mongoose.model("User", UserSchema);
