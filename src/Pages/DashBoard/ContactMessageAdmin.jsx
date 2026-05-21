import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://exam-hero-server-main.vercel.app";

const ContactMessageAdmin = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // ✅ Check screen size for responsiveness
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ✅ Format date helper
  const formatDate = useCallback((dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isMobile) {
      return date.toLocaleDateString();
    }
    return date.toLocaleString();
  }, [isMobile]);

  // ✅ Fetch contacts from backend
  const fetchContacts = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${API_BASE_URL}/contacts`);
      setContacts(data);
      setError("");
    } catch (err) {
      console.error("Failed to fetch contacts:", err);
      setError("Failed to load contact messages. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // ✅ Delete contact
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      await axios.delete(`${API_BASE_URL}/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setSuccess("Contact message deleted successfully ✅");
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact(null);
      }
    } catch (err) {
      console.error("Failed to delete contact:", err);
      setError("Failed to delete contact message ❌");
    } finally {
      setTimeout(() => setSuccess(""), 3000);
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Mark as read/unread
  const toggleReadStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "read" ? "unread" : "read";
      await axios.patch(`${API_BASE_URL}/contacts/${id}/status`, {
        status: newStatus,
      });

      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );

      // Update selected contact if it's the one being modified
      if (selectedContact && selectedContact._id === id) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }

      setSuccess(`Marked as ${newStatus}`);
    } catch (err) {
      console.error("Failed to update status:", err);
      setError("Failed to update status ❌");
    } finally {
      setTimeout(() => setSuccess(""), 2000);
      setTimeout(() => setError(""), 3000);
    }
  };

  // ✅ Filter & sort contacts
  const filteredContacts = useMemo(() => {
    return contacts
      .filter((contact) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
          contact.name?.toLowerCase().includes(search) ||
          contact.email?.toLowerCase().includes(search) ||
          contact.message?.toLowerCase().includes(search);

        const matchesFilter =
          filterStatus === "all" || contact.status === filterStatus;

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
        if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
        if (sortBy === "name") return a.name?.localeCompare(b.name);
        return 0;
      });
  }, [contacts, searchTerm, filterStatus, sortBy]);

  // ✅ View contact details
  const viewContactDetails = (contact) => {
    setSelectedContact(contact);
    if (contact.status === "unread") {
      toggleReadStatus(contact._id, "unread");
    }
  };

  // ✅ Close modal & reset selected contact
  const closeModal = () => setSelectedContact(null);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg">Loading contact messages...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 md:mb-0">
          Contact Messages
        </h2>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            onClick={fetchContacts} 
            className="btn btn-outline btn-primary btn-sm sm:btn-md"
            aria-label="Refresh messages"
          >
            <span className="sm:inline hidden">Refresh</span>
            <span className="sm:hidden">🔄</span>
          </button>
          <span className="badge badge-lg badge-neutral">
            {filteredContacts.length}/{contacts.length}
          </span>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="alert alert-error mb-4 py-2 text-sm sm:text-base">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success mb-4 py-2 text-sm sm:text-base">
          {success}
        </div>
      )}

      {/* Filters */}
      <div className="bg-base-200 p-4 sm:p-6 rounded-lg mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="lg:col-span-2">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered w-full"
          />
        </div>

        <select
          className="select select-bordered w-full"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Messages</option>
          <option value="unread">Unread</option>
          <option value="read">Read</option>
        </select>

        <select
          className="select select-bordered w-full"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort by"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="name">By Name</option>
        </select>
      </div>

      {/* Contact List */}
      <div className="grid gap-3 sm:gap-4">
        {filteredContacts.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-lg sm:text-xl text-gray-600">No contact messages found</p>
            {(searchTerm || filterStatus !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                }}
                className="btn btn-ghost mt-3 btn-sm sm:btn-md"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          filteredContacts.map((contact) => (
            <div
              key={contact._id}
              className={`card bg-base-100 shadow hover:shadow-lg cursor-pointer ${
                contact.status === "unread" ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => viewContactDetails(contact)}
            >
              <div className="card-body p-3 sm:p-4">
                <div className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="card-title text-lg sm:text-xl truncate">{contact.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{contact.email}</p>
                    <p className="mt-2 text-sm sm:text-base line-clamp-2 break-words">
                      {contact.message?.length > 100
                        ? contact.message.slice(0, 100) + "..."
                        : contact.message}
                    </p>
                  </div>

                  <div className="flex flex-row sm:flex-col justify-between items-start sm:items-end gap-2 sm:gap-2">
                    <span className="text-xs text-gray-400 sm:self-end">
                      {formatDate(contact.createdAt)}
                    </span>
                    <div className="flex gap-1 sm:gap-2">
                      <button
                        className={`btn btn-xs sm:btn-sm ${
                          contact.status === "read"
                            ? "btn-outline"
                            : "btn-primary"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleReadStatus(contact._id, contact.status);
                        }}
                        aria-label={contact.status === "read" ? "Mark as unread" : "Mark as read"}
                      >
                        {isMobile ? (contact.status === "read" ? "✓" : "●") : 
                          (contact.status === "read" ? "Read" : "Unread")}
                      </button>
                      <button
                        className="btn btn-xs sm:btn-sm btn-error btn-outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(contact._id);
                        }}
                        aria-label="Delete message"
                      >
                        {isMobile ? "🗑" : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl w-11/12 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-xl sm:text-2xl font-bold">Message Details</h3>
              <button 
                className="btn btn-sm btn-circle btn-ghost" 
                onClick={closeModal}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base">Name</p>
                  <div className="p-2 sm:p-3 bg-base-200 rounded-lg mt-1">{selectedContact.name}</div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base">Email</p>
                  <div className="p-2 sm:p-3 bg-base-200 rounded-lg mt-1">
                    <a href={`mailto:${selectedContact.email}`} className="link link-primary break-all">
                      {selectedContact.email}
                    </a>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm sm:text-base">Date</p>
                <div className="p-2 sm:p-3 bg-base-200 rounded-lg mt-1">
                  {formatDate(selectedContact.createdAt)}
                </div>
              </div>

              <div>
                <p className="font-semibold text-sm sm:text-base">Message</p>
                <div className="p-3 sm:p-4 bg-base-200 rounded-lg mt-1 whitespace-pre-wrap overflow-auto max-h-40 sm:max-h-60">
                  {selectedContact.message}
                </div>
              </div>
            </div>

            <div className="modal-action flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6">
              <button
                className="btn btn-outline w-full sm:w-auto order-2 sm:order-1"
                onClick={() =>
                  toggleReadStatus(selectedContact._id, selectedContact.status)
                }
              >
                Mark as {selectedContact.status === "read" ? "Unread" : "Read"}
              </button>
              <button
                className="btn btn-error w-full sm:w-auto order-1 sm:order-2"
                onClick={() => handleDelete(selectedContact._id)}
              >
                Delete Message
              </button>
              <button className="btn w-full sm:w-auto order-3" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactMessageAdmin;