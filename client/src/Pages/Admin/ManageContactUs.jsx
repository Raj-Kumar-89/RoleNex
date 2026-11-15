import React, { useEffect, useState } from "react";
import axios from "axios";
import { IoCheckmarkOutline, IoCheckmarkDoneOutline } from "react-icons/io5";
import { FaBell, FaArrowLeft } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";
import { ImBin } from "react-icons/im";
import AdminHeader from "../../components/AdminHeader";
import Footer from "../../components/Footer";

const STATUS_COLORS = { Unread: "#dc2626", Read: "#2563eb", Replied: "#16a34a" };

function ManageContactUs() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMsg, setSelectedMsg] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState("");
  const token = localStorage.getItem("adminToken");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/contactmessages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data);
    } catch { setError("Failed to load contact messages."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleView = async (msg) => {
    setSelectedMsg(msg);
    setAdminNote(msg.adminNote || "");
    if (msg.status === "Unread") {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/admin/contactmessages/${msg._id}`,
          { status: "Read" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages((prev) => prev.map((m) => (m._id === msg._id ? res.data : m)));
        setSelectedMsg(res.data);
      } catch {}
    }
  };

  const handleStatusChange = async (id, status) => {
    setActionLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/contactmessages/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => prev.map((m) => (m._id === id ? res.data : m)));
      if (selectedMsg?._id === id) setSelectedMsg(res.data);
      showToast(`Status updated to "${status}"`);
    } catch { showToast("Failed to update status."); }
    finally { setActionLoading(false); }
  };

  const handleSaveNote = async () => {
    if (!selectedMsg) return;
    setActionLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/contactmessages/${selectedMsg._id}`,
        { adminNote },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => prev.map((m) => (m._id === selectedMsg._id ? res.data : m)));
      setSelectedMsg(res.data);
      showToast("Note saved!");
    } catch { showToast("Failed to save note."); }
    finally { setActionLoading(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/contactmessages/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages((prev) => prev.filter((m) => m._id !== id));
      if (selectedMsg?._id === id) setSelectedMsg(null);
      showToast("Message deleted.");
    } catch { showToast("Failed to delete."); }
  };

  const filtered = filterStatus === "All" ? messages : messages.filter((m) => m.status === filterStatus);
  const unreadCount = messages.filter((m) => m.status === "Unread").length;

  return (
    <>
    <AdminHeader/>

    <section title="Contact Messages">
      {toast && <div className="contact-admin-toast">{toast}</div>}

      <div className="admin-page-content" style={{ padding: 0 }}>
        <div className={`contact-admin-inner-wrap ${selectedMsg ? "has-selected" : ""}`}>
          {/* Left: Message List */}
          <div className="contact-admin-list-panel">
            <div className="contact-admin-list-header">
              <h2> Messages
                {unreadCount > 0 && <span className="contact-admin-badge">{unreadCount} New</span>}
              </h2>
              <div className="contact-admin-filters">
                {["All", "Unread", "Read", "Replied"].map((s) => (
                  <button key={s} className={`contact-filter-btn ${filterStatus === s ? "active" : ""}`} onClick={() => setFilterStatus(s)}>{s}</button>
                ))}
              </div>
            </div>

            {loading && <p className="contact-admin-loading">Loading...</p>}
            {error && <p className="contact-admin-error">{error}</p>}
            {!loading && filtered.length === 0 && <p className="contact-admin-empty">No messages found.</p>}

            <div className="contact-admin-messages">
              {filtered.map((msg) => (
                <div
                  key={msg._id}
                  className={`contact-admin-msg-card ${selectedMsg?._id === msg._id ? "active" : ""} ${msg.status === "Unread" ? "unread" : ""}`}
                  onClick={() => handleView(msg)}
                >
                  <div className="contact-admin-msg-top">
                    <span className="contact-admin-msg-name">{msg.name}</span>
                    <span className="contact-admin-status-badge" style={{ backgroundColor: STATUS_COLORS[msg.status] }}>{msg.status}</span>
                  </div>
                  <p className="contact-admin-msg-subject">{msg.subject}</p>
                  <p className="contact-admin-msg-email">{msg.email}</p>
                  <p className="contact-admin-msg-date">{new Date(msg.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Detail */}
          <div className="contact-admin-detail-panel">
            {!selectedMsg ? (
              <div className="contact-admin-placeholder"><p>Select a message to view details</p></div>
            ) : (
              <div className="contact-admin-detail">
                <button type="button" className="contact-admin-back-btn" onClick={() => setSelectedMsg(null)}>
                  <FaArrowLeft /> Back to messages
                </button>

                <div className="contact-admin-detail-header">
                  <div className="contact-admin-detail-heading">
                    <h3>{selectedMsg.subject}</h3>
                    <p className="contact-admin-detail-meta">From: <strong>{selectedMsg.name}</strong> &lt;{selectedMsg.email}&gt;</p>
                    <p className="contact-admin-detail-date">{new Date(selectedMsg.createdAt).toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</p>
                  </div>
                  <span className="contact-admin-status-badge large" style={{ backgroundColor: STATUS_COLORS[selectedMsg.status] }}>{selectedMsg.status}</span>
                </div>

                <div className="contact-admin-message-body">
                  <h4>Message</h4>
                  <p>{selectedMsg.message}</p>
                </div>

                <div className="contact-admin-actions">
                  <h4>Actions</h4>
                  <div className="contact-admin-action-btns">
                    <button className="contact-action-btn mark-read" onClick={() => handleStatusChange(selectedMsg._id, "Read")} disabled={selectedMsg.status === "Read" || actionLoading}><IoCheckmarkOutline />Mark Read</button>
                    <button className="contact-action-btn mark-replied" onClick={() => handleStatusChange(selectedMsg._id, "Replied")} disabled={selectedMsg.status === "Replied" || actionLoading}><IoCheckmarkDoneOutline /> Mark Replied</button>
                    <button className="contact-action-btn mark-unread" onClick={() => handleStatusChange(selectedMsg._id, "Unread")} disabled={selectedMsg.status === "Unread" || actionLoading}><FaBell /> Unread</button>
                    <a href={`mailto:${selectedMsg.email}?subject=${encodeURIComponent(`Re: ${selectedMsg.subject}`)}`} className="contact-action-btn reply-email" onClick={() => setTimeout(() => handleStatusChange(selectedMsg._id, "Replied"), 500)}><MdAlternateEmail /> Reply via Email</a>
                    <button className="contact-action-btn delete-msg" onClick={() => handleDelete(selectedMsg._id)}><ImBin /> Delete</button>
                  </div>
                </div>

                <div className="contact-admin-note-section">
                  <h4>Admin Note</h4>
                  <textarea rows={3} className="contact-admin-note-input" placeholder="Internal note (only visible to admin)..." value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
                  <button className="contact-admin-save-btn" onClick={handleSaveNote} disabled={actionLoading}>{actionLoading ? "Saving..." : "Save Note"}</button>
                  {selectedMsg.adminNote && <p className="contact-admin-saved-note"><strong>Saved Note:</strong> {selectedMsg.adminNote}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>

    <Footer/>
    </>
  );
}

export default ManageContactUs;