const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    friends: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
requestsSent: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
requestsReceived: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
],
   username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    galaxyId: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePic: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    online: {
      type: Boolean,
      default: false,
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    friendRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
  
);

module.exports = mongoose.model("User", UserSchema);