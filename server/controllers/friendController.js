const User = require("../models/User");
const Message = require("../models/Message");

// ===============================
// SEND GEL REQUEST
// ===============================
exports.sendRequest = async (req, res) => {
  try {
    const { galaxyId } = req.body;
    const senderId = req.user.id;

    const receiver = await User.findOne({ galaxyId });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    if (receiver._id.equals(senderId)) {
      return res.status(400).json({ message: "Cannot add yourself" });
    }

    if (receiver.friends.includes(senderId)) {
      return res.status(400).json({ message: "Already Gels" });
    }

    // avoid duplicate requests
    if (receiver.requestsReceived.includes(senderId)) {
      return res.status(400).json({ message: "Request already sent" });
    }

    receiver.requestsReceived.push(senderId);
    await receiver.save();

    const sender = await User.findById(senderId);
    sender.requestsSent.push(receiver._id);
    await sender.save();

    res.json({ message: "Gel request sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// ACCEPT GEL REQUEST
// ===============================
exports.acceptRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.user.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    if (!receiver || !sender) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove pending request
    receiver.requestsReceived = receiver.requestsReceived.filter(
      id => id.toString() !== senderId
    );
    sender.requestsSent = sender.requestsSent.filter(
      id => id.toString() !== receiverId
    );

    // add to friends
    receiver.friends.push(senderId);
    sender.friends.push(receiverId);

    await receiver.save();
    await sender.save();

    // unlock messages
    await Message.updateMany(
      {
        sender: sender._id,
        receiver: receiver._id,
        status: "pending"
      },
      { $set: { status: "delivered" } }
    );

    res.json({ message: "You are now Gels" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// REJECT GEL REQUEST
// ===============================
exports.rejectRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const receiverId = req.user.id;

    const receiver = await User.findById(receiverId);
    const sender = await User.findById(senderId);

    receiver.requestsReceived.pull(senderId);
    sender.requestsSent.pull(receiverId);

    await receiver.save();
    await sender.save();

    res.json({ message: "Gel request rejected" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET MY GELS (FRIENDS)
// ===============================
exports.getGels = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("friends", "username galaxyId online");

    res.json(user.friends);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ===============================
// GET SIGNALS (INCOMING REQUESTS)
// ===============================
exports.getSignals = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("requestsReceived", "username galaxyId");

    res.json(user.requestsReceived);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};