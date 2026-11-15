const ContactMessage = require("../models/ContactMessages");

// Submit a contact message (public)
exports.submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new ContactMessage({ name, email, subject, message });
    await newMessage.save();

    res.status(201).json({ message: "Your message has been sent successfully!" });
  } catch (err) {
    console.error("Contact submit error:", err);
    res.status(500).json({ message: "Server error while submitting message" });
  }
};

// Get all contact messages (admin)
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single message by ID (admin)
exports.getMessageById = async (req, res) => {
  try {
    const msg = await ContactMessage.findById(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.status(200).json(msg);
  } catch (err) {
    console.error("Error fetching message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update message status (admin) - Read / Replied / Unread
exports.updateMessageStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const update = {};
    if (status) update.status = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const msg = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!msg) return res.status(404).json({ message: "Message not found" });

    res.status(200).json(msg);
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a message (admin)
exports.deleteMessage = async (req, res) => {
  try {
    const msg = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ message: "Message not found" });
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get unread count (admin)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await ContactMessage.countDocuments({ status: "Unread" });
    res.status(200).json({ unreadCount: count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};