const express = require("express");
const router = express.Router();
const {
  submitContact,
  getAllMessages,
  getMessageById,
  updateMessageStatus,
  deleteMessage,
  getUnreadCount,
} = require("../controllers/contactController");
const verifyAdminToken = require("../middlewares/verifyAdminToken");

// Public route - Submit contact form
router.post("/submit", submitContact);

// Admin routes
router.get("/messages", verifyAdminToken, getAllMessages);
router.get("/messages/unreadcount", verifyAdminToken, getUnreadCount);
router.get("/messages/:id", verifyAdminToken, getMessageById);
router.put("/messages/:id", verifyAdminToken, updateMessageStatus);
router.delete("/messages/:id", verifyAdminToken, deleteMessage);

module.exports = router;