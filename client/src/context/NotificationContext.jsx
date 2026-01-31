import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to Socket.IO server
    const socketInstance = io('http://localhost:5000', {
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Connected to notification server');
      setConnected(true);
      
      // Join appropriate rooms based on logged-in user
      const studentToken = localStorage.getItem('studentToken');
      const facultyToken = localStorage.getItem('facultyToken');
      const adminToken = localStorage.getItem('adminToken');

      if (studentToken) {
        try {
          const payload = JSON.parse(atob(studentToken.split('.')[1]));
          socketInstance.emit('join', { userId: payload.studentId, userType: 'student' });
        } catch (e) {
          console.error('Error parsing student token:', e);
        }
      } else if (facultyToken) {
        try {
          const payload = JSON.parse(atob(facultyToken.split('.')[1]));
          socketInstance.emit('join', { userId: payload.facultyUserId, userType: 'faculty' });
        } catch (e) {
          console.error('Error parsing faculty token:', e);
        }
      } else if (adminToken) {
        try {
          const payload = JSON.parse(atob(adminToken.split('.')[1]));
          socketInstance.emit('join', { userId: payload.adminId, userType: 'admin' });
        } catch (e) {
          console.error('Error parsing admin token:', e);
        }
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from notification server');
      setConnected(false);
    });

    // Listen for notifications
    socketInstance.on('notification', (notification) => {
      console.log('Received notification:', notification);
      addNotification(notification);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const addNotification = (notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);

    // Play notification sound
    try {
      const audio = new Audio('/notification.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Could not play notification sound'));
    } catch (e) {
      console.log('Notification sound not available');
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'error':
        return <AlertCircle className="text-red-500" size={24} />;
      case 'info':
        return <Info className="text-blue-500" size={24} />;
      default:
        return <Bell className="text-gray-500" size={24} />;
    }
  };

  const getBackground = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <NotificationContext.Provider value={{ socket, connected, addNotification }}>
      {children}
      
      {/* Notification Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: -20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              transition={{ duration: 0.3 }}
              className={`${getBackground(notification.type)} border rounded-lg shadow-lg p-4 flex items-start space-x-3`}
            >
              {getIcon(notification.type)}
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
