import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Cookies from 'universal-cookie'
import { UserPlus, LogOut, Trash2, SendHorizontal } from 'lucide-react'
import './AdminDashboard.css'

const cookies = new Cookies()

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedEmail, setSelectedEmail] = useState(null)
  const [filterUnread, setFilterUnread] = useState(false)
  const [sortOrder, setSortOrder] = useState('newest')
  const [isOwner, setIsOwner] = useState(false)
  const [showManageAdmins, setShowManageAdmins] = useState(false)
  const [adminInfo, setAdminInfo] = useState(null)

  // Reply state
  const [replyText, setReplyText] = useState('')
  const [replyStatus, setReplyStatus] = useState('')

  const token = cookies.get('adminToken')

  const decodeToken = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]))
    } catch {
      return null
    }
  }

  useEffect(() => {
    const fetchMessages = async () => {
      if (!token) {
        navigate('/admin/login')
        return
      }

      const decoded = decodeToken(token)
      setIsOwner(decoded?.isOwner || false)

      try {
        const response = await axios.get(
          'http://localhost:5000/api/v1/admin/messages',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        setMessages(response.data)

        if (response.data.length > 0) {
          setSelectedEmail(response.data[0].email)
        }
      } catch (err) {
        setError('Session expired. Please log in again.')
        setTimeout(() => navigate('/admin/login'), 1500)
      } finally {
        setLoading(false)
      }
    }

    fetchMessages()
  }, [navigate, token])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          'http://localhost:5000/api/v1/admin/me',
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )

        setAdminInfo(res.data)
      } catch (err) {
        console.log(err)
      }
    }

    if (token) fetchMe()
  }, [token])

  const groupedContacts = Object.values(
    messages.reduce((acc, msg) => {
      if (!acc[msg.email]) {
        acc[msg.email] = {
          email: msg.email,
          name: msg.name,
          messages: [],
          unreadCount: 0
        }
      }

      acc[msg.email].messages.push(msg)

      if (!msg.isRead) {
        acc[msg.email].unreadCount++
      }

      return acc
    }, {})
  )

  groupedContacts.forEach((contact) => {
    contact.messages.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )
  })

  const displayedContacts = groupedContacts
    .filter((contact) =>
      filterUnread ? contact.unreadCount > 0 : true
    )
    .sort((a, b) => {
      const aDate = new Date(
        a.messages[a.messages.length - 1].createdAt
      )

      const bDate = new Date(
        b.messages[b.messages.length - 1].createdAt
      )

      return sortOrder === 'newest'
        ? bDate - aDate
        : aDate - bDate
    })

  const selectedContact = groupedContacts.find(
    (contact) => contact.email === selectedEmail
  )

  const handleSelectContact = async (contact) => {
    setSelectedEmail(contact.email)

    // Clear previous reply state when switching conversations
    setReplyText('')
    setReplyStatus('')

    const unreadInThread = contact.messages.filter(
      (msg) => !msg.isRead
    )

    for (const msg of unreadInThread) {
      try {
        await axios.patch(
          `http://localhost:5000/api/v1/admin/messages/${msg._id}/read`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        )
      } catch (err) {
        console.log('Failed to mark as read:', err)
      }
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.email === contact.email
          ? { ...msg, isRead: true }
          : msg
      )
    )
  }

  const handleSendReply = async () => {
    if (!replyText.trim() || !selectedContact) return

    const latestMessage =
      selectedContact.messages[
        selectedContact.messages.length - 1
      ]

    setReplyStatus('sending')

    try {
      await axios.post(
        `http://localhost:5000/api/v1/admin/messages/${latestMessage._id}/reply`,
        {
          replyMessage: replyText
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setReplyStatus('sent')
      setReplyText('')
    } catch (err) {
      console.error('Failed to send reply:', err)
      setReplyStatus('error')
    }
  }

  const handleLogout = () => {
    cookies.remove('adminToken', { path: '/' })
    navigate('/admin/login')
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        Loading messages...
      </div>
    )
  }

  return (
    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <div className="sidebar-logo">
          ATELIER
        </div>

        <div className="sidebar-controls">

          <button
            className={filterUnread ? 'active' : ''}
            onClick={() => setFilterUnread(!filterUnread)}
          >
            Unread only
          </button>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

        </div>

        <div className="sidebar-list">

          {displayedContacts.length === 0 ? (
            <p className="sidebar-empty">
              No messages yet.
            </p>
          ) : (
            displayedContacts.map((contact) => (

              <div
                key={contact.email}
                className={`sidebar-item ${
                  selectedEmail === contact.email ? 'active' : ''
                }`}
                onClick={() => handleSelectContact(contact)}
              >

                <div className="sidebar-item-top">

                  <p className="sidebar-name">
                    {contact.name}
                  </p>

                  {contact.unreadCount > 0 && (
                    <span className="unread-badge">
                      {contact.unreadCount} unread
                    </span>
                  )}

                </div>

                <p className="sidebar-preview">
                  {
                    contact.messages[
                      contact.messages.length - 1
                    ].message
                  }
                </p>

              </div>

            ))
          )}

        </div>

        <div className="sidebar-footer">

          {isOwner && (
            <button
              className="sidebar-footer-btn"
              onClick={() => setShowManageAdmins(true)}
            >
              <UserPlus
                size={16}
                strokeWidth={1.5}
              />

              Manage admins
            </button>
          )}

          {adminInfo?.lastLogin && (
            <p className="sidebar-lastseen">
              Last login:{' '}
              {new Date(
                adminInfo.lastLogin
              ).toLocaleString()}
            </p>
          )}

          <button
            className="sidebar-footer-btn"
            onClick={handleLogout}
          >
            <LogOut
              size={16}
              strokeWidth={1.5}
            />

            Logout
          </button>

        </div>

      </aside>


      <main className="dashboard-main">

        {error && (
          <p className="dashboard-error">
            {error}
          </p>
        )}

        {selectedContact ? (
          <div className="conversation-panel">

            <div className="conversation-header">

              <p className="conversation-name">
                {selectedContact.name}
              </p>

              <p className="conversation-email">
                {selectedContact.email}
              </p>

            </div>


            <div className="thread-list">

              {selectedContact.messages.map((msg) => (

                <div
                  key={msg._id}
                  className="message-bubble"
                >

                  <p className="message-bubble-text">
                    {msg.message}
                  </p>

                  <p className="message-bubble-date">
                    {new Date(
                      msg.createdAt
                    ).toLocaleDateString()}
                  </p>

                </div>

              ))}

            </div>

<div className="reply-bar">
  <div className="reply-bar-inner">
    <textarea
      className="reply-input"
      placeholder={`Reply to ${selectedContact.name}...`}
      value={replyText}
      rows={1}
      onChange={(e) => setReplyText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault()
          if (replyText.trim() && replyStatus !== 'sending') {
            handleSendReply(
              selectedContact.messages[selectedContact.messages.length - 1]._id
            )
          }
        }
      }}
    />
    <button
      className="reply-send"
      onClick={() =>
        handleSendReply(
          selectedContact.messages[selectedContact.messages.length - 1]._id
        )
      }
      disabled={replyStatus === 'sending' || !replyText.trim()}
      aria-label="Send reply"
    >
      <SendHorizontal size={18} strokeWidth={1.5} />
    </button>
  </div>

  {replyStatus === 'sent' && <p className="reply-feedback success">Reply sent</p>}
  {replyStatus === 'error' && <p className="reply-feedback error">Failed to send. Please try again.</p>}
</div>
          </div>
        ) : (

          <p className="dashboard-empty">
            Select a conversation to view it.
          </p>

        )}

      </main>


      {showManageAdmins && (
        <ManageAdminsModal
          token={token}
          onClose={() => setShowManageAdmins(false)}
        />
      )}

    </div>
  )
}


const ManageAdminsModal = ({
  token,
  onClose
}) => {

  const [pinVerified, setPinVerified] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState('')

  const handleVerifyPin = async (e) => {

    e.preventDefault()
    setPinError('')

    try {

      const decoded = JSON.parse(
        atob(token.split('.')[1])
      )

      await axios.post(
        'http://localhost:5000/api/v1/admin/verify-pin',
        {
          id: decoded.id,
          pin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setPinVerified(true)

    } catch (err) {

      setPinError('Incorrect PIN')

    }
  }

  return (

    <div
      className="modal-overlay"
      onClick={onClose}
    >

      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
      >

        {!pinVerified ? (
          <>

            <h2 className="modal-title">
              Enter your PIN
            </h2>

            <p className="modal-subtitle">
              Confirm your identity to manage admins.
            </p>

            <form onSubmit={handleVerifyPin}>

              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) =>
                  setPin(e.target.value)
                }
                className="pin-verify-input"
                autoFocus
              />

              {pinError && (
                <p className="pin-error">
                  {pinError}
                </p>
              )}

              <button
                type="submit"
                className="modal-submit"
              >
                Confirm
              </button>

            </form>

          </>
        ) : (

          <ManageAdminsPanel
            token={token}
            onClose={onClose}
          />

        )}

      </div>

    </div>

  )
}


const ManageAdminsPanel = ({
  token,
  onClose
}) => {

  const [newEmail, setNewEmail] = useState('')
  const [status, setStatus] = useState('')
  const [emailError, setEmailError] = useState('')
  const [whitelist, setWhitelist] = useState([])
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletePin, setDeletePin] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  }

  const fetchWhitelist = async () => {

    try {

      const response = await axios.get(
        'http://localhost:5000/api/v1/admin/whitelist',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setWhitelist(response.data)

    } catch (err) {

      console.log(
        'Failed to fetch whitelist:',
        err
      )

    }
  }

  useEffect(() => {
    fetchWhitelist()
  }, [])

  const handleAdd = async (e) => {

    e.preventDefault()

    setStatus('')
    setEmailError('')

    if (!validateEmail(newEmail)) {
      setEmailError(
        'Please enter a valid email address'
      )
      return
    }

    try {

      await axios.post(
        'http://localhost:5000/api/v1/admin/whitelist',
        {
          email: newEmail
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      setStatus('Added successfully')
      setNewEmail('')

      fetchWhitelist()

    } catch (err) {

      setStatus(
        err.response?.data?.message ||
        'Failed to add'
      )

    }
  }

  const handleDeleteClick = (email) => {

    setDeleteTarget(email)
    setConfirmingDelete(true)

  }

  const handleConfirmDelete = async () => {

    setDeleteError('')

    try {

      await axios.delete(
        'http://localhost:5000/api/v1/admin/remove',
        {
          headers: {
            Authorization: `Bearer ${token}`
          },

          data: {
            email: deleteTarget,
            pin: deletePin
          }
        }
      )

      setConfirmingDelete(false)
      setDeleteTarget(null)
      setDeletePin('')

      fetchWhitelist()

    } catch (err) {

      setDeleteError(
        err.response?.data?.message ||
        'Failed to delete'
      )

    }
  }

  return (

    <>

      <h2 className="modal-title">
        Manage admins
      </h2>

      <p className="modal-subtitle">
        Add or remove authorized emails.
      </p>


      <form
        className="whitelist-form"
        onSubmit={handleAdd}
      >

        <input
          type="email"
          placeholder="Email address"
          value={newEmail}
          onChange={(e) =>
            setNewEmail(e.target.value)
          }
          required
        />

        <button type="submit">
          Add
        </button>

      </form>


      {emailError && (
        <p className="pin-error">
          {emailError}
        </p>
      )}


      {status && (
        <p className="whitelist-status">
          {status}
        </p>
      )}


      <div className="whitelist-list">

        {whitelist.map((entry) => (

          <div
            key={entry._id}
            className="whitelist-item"
          >

            <span>
              {entry.email}
            </span>

            <button
              className="whitelist-delete-icon"
              onClick={() =>
                handleDeleteClick(entry.email)
              }
              aria-label="Delete admin"
            >

              <Trash2
                size={16}
                strokeWidth={1.5}
              />

            </button>

          </div>

        ))}

      </div>


      {confirmingDelete && (

        <div className="delete-confirm">

          <p>
            Are you sure you want to delete{' '}
            {deleteTarget}?
          </p>

          <input
            type="password"
            maxLength={4}
            placeholder="Enter PIN"
            value={deletePin}
            onChange={(e) =>
              setDeletePin(e.target.value)
            }
          />

          {deleteError && (
            <p className="pin-error">
              {deleteError}
            </p>
          )}

          <div className="delete-confirm-actions">

            <button
              onClick={() =>
                setConfirmingDelete(false)
              }
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmDelete}
            >
              Confirm delete
            </button>

          </div>

        </div>

      )}


      <button
        className="modal-close"
        onClick={onClose}
      >
        Close
      </button>

    </>

  )
}

export default AdminDashboard