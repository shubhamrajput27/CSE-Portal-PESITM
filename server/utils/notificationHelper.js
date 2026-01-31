/**
 * Send real-time notification to users via Socket.IO
 * @param {Object} io - Socket.IO instance
 * @param {String} userType - 'student', 'faculty', or 'admin'
 * @param {Number|Array} userId - Single user ID or array of user IDs
 * @param {Object} notification - Notification object
 * @param {String} notification.type - 'success', 'error', 'info', 'warning'
 * @param {String} notification.title - Notification title
 * @param {String} notification.message - Notification message
 */
export const sendNotification = (io, userType, userId, notification) => {
  if (Array.isArray(userId)) {
    // Send to multiple users
    userId.forEach(id => {
      io.to(`${userType}-${id}`).emit('notification', notification);
    });
  } else {
    // Send to single user
    io.to(`${userType}-${userId}`).emit('notification', notification);
  }
};

/**
 * Broadcast notification to all users of a specific type
 * @param {Object} io - Socket.IO instance
 * @param {String} userType - 'student', 'faculty', or 'admin'
 * @param {Object} notification - Notification object
 */
export const broadcastToUserType = (io, userType, notification) => {
  io.to(userType).emit('notification', notification);
};

/**
 * Broadcast notification to all connected users
 * @param {Object} io - Socket.IO instance
 * @param {Object} notification - Notification object
 */
export const broadcastToAll = (io, notification) => {
  io.emit('notification', notification);
};

// Example usage in controller:
/*
import { sendNotification } from '../utils/notificationHelper.js';

export const markAttendance = async (req, res) => {
  try {
    // ... mark attendance logic ...
    
    // Send notification to students
    const io = req.app.get('io');
    const studentIds = [1, 2, 3]; // Array of student IDs who were marked
    
    sendNotification(io, 'student', studentIds, {
      type: 'info',
      title: 'Attendance Marked',
      message: 'Your attendance has been recorded for today\'s class.'
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
*/
