const Message = require("../models/Message");
const User = require("../models/User");

/**
 * SEND MESSAGE
 * - Allows sending message even before friend acceptance
 * - Message is saved as:
 *   - delivered → if already Gels
 *   - pending   → if not yet Gels
 */
exports.sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { galaxyId, text } = req.body;

    if (!galaxyId || !text?.trim()) {
      return res.status(400).json({ message: "Galaxy ID and message required" });
    }

    // Find receiver by Galaxy ID
    const receiver = await User.findOne({ galaxyId });
    if (!receiver) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent sending to self
    if (receiver._id.toString() === senderId) {
      return res.status(400).json({ message: "Cannot message yourself" });
    }

    const sender = await User.findById(senderId);

    // Check friendship
    const areFriends = sender.friends.some(
      (id) => id.toString() === receiver._id.toString()
    );

    // Create message
    const message = await Message.create({
      sender: senderId,
      receiver: receiver._id,
      text,
      status: areFriends ? "delivered" : "pending",
    });

    res.status(201).json({
      message: "Message sent",
      status: message.status,
    });
  } catch (err) {
    console.error("SEND MESSAGE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET MESSAGES
 * - If users are friends → show full chat (both directions)
 * - If not friends       → show ONLY messages sent by current user
 */
exports.getMessages = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const { galaxyId } = req.params;

    const otherUser = await User.findOne({ galaxyId });
    if (!otherUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUser._id },
        { sender: otherUser._id, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .lean();

    // 🔥 ADD THIS (KEY FIX)
    const formatted = messages.map((m) => ({
      ...m,
      isMe: String(m.sender) === String(currentUserId),
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};