import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Bell, AlertCircle, Info, CheckCircle, X, Eye, EyeOff, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

const NotificationManagement = () => {
  const [notifications, setNotifications] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNotification, setEditingNotification] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info',
    priority: 'normal',
    is_active: true,
    show_banner: false,
    expires_at: ''
  })

  // Fetch notifications from API
  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/notifications')
      if (response.data.success) {
        setNotifications(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const notificationTypes = [
    { value: 'info', label: 'Information', icon: Info, color: 'text-blue-600' },
    { value: 'warning', label: 'Warning', icon: AlertCircle, color: 'text-yellow-600' },
    { value: 'success', label: 'Success', icon: CheckCircle, color: 'text-green-600' },
    { value: 'error', label: 'Error', icon: X, color: 'text-red-600' },
    { value: 'event', label: 'Event', icon: Bell, color: 'text-purple-600' }
  ]

  const priorityLevels = ['low', 'normal', 'high', 'urgent']

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      priority: 'normal',
      is_active: true,
      show_banner: false,
      expires_at: ''
    })
    setEditingNotification(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (editingNotification) {
        // Update existing notification
        await axios.put(
          `http://localhost:5000/api/notifications/${editingNotification.id}`, 
          formData, 
          config
        )
      } else {
        // Create new notification
        await axios.post('http://localhost:5000/api/notifications', formData, config)
      }

      fetchNotifications() // Refresh the list
      resetForm()
    } catch (error) {
      console.error('Error saving notification:', error)
      alert('Error saving notification. Please try again.')
    }
  }

  const handleEdit = (notification) => {
    setFormData({
      title: notification.title || '',
      message: notification.message || '',
      type: notification.type || 'info',
      priority: notification.priority || 'normal',
      is_active: notification.is_active !== false,
      show_banner: notification.show_banner || false,
      expires_at: notification.expires_at ? new Date(notification.expires_at).toISOString().slice(0, 16) : ''
    })
    setEditingNotification(notification)
    setShowAddForm(true)
  }

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await axios.delete(
          `http://localhost:5000/api/notifications/${notificationId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        fetchNotifications() // Refresh the list
      } catch (error) {
        console.error('Error deleting notification:', error)
        alert('Error deleting notification. Please try again.')
      }
    }
  }

  const toggleActive = async (notificationId, currentStatus) => {
    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(
        `http://localhost:5000/api/notifications/${notificationId}`,
        { is_active: !currentStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchNotifications() // Refresh the list
    } catch (error) {
      console.error('Error updating notification status:', error)
    }
  }

  const getTypeIcon = (type) => {
    const typeConfig = notificationTypes.find(t => t.value === type)
    if (!typeConfig) return <Info size={20} />
    const Icon = typeConfig.icon
    return <Icon size={20} className={typeConfig.color} />
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getPriorityBadge = (priority) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      normal: 'bg-blue-100 text-blue-800',
      high: 'bg-yellow-100 text-yellow-800',
      urgent: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.normal
  }

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || notification.type === filterType
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority
    return matchesSearch && matchesType && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pesitm-blue"></div>
        <span className="ml-3 text-gray-600">Loading notifications...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Notification Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center bg-pesitm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Notification
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-pesitm-blue"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pesitm-blue"
        >
          <option value="all">All Types</option>
          {notificationTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pesitm-blue"
        >
          <option value="all">All Priorities</option>
          {priorityLevels.map(priority => (
            <option key={priority} value={priority}>
              {priority.charAt(0).toUpperCase() + priority.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Notifications List */}
      <div className="grid gap-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No notifications found</p>
          </div>
        ) : (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 ${
                notification.is_active ? 'border-green-500' : 'border-gray-300'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getTypeIcon(notification.type)}
                    <h3 className="text-xl font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    {notification.show_banner && (
                      <Star size={20} className="text-yellow-500 fill-current" />
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(notification.priority)}`}>
                      {notification.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{notification.message}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>Created: {formatDate(notification.created_at)}</span>
                    {notification.expires_at && (
                      <span>Expires: {formatDate(notification.expires_at)}</span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.show_banner ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {notification.show_banner ? 'Banner' : 'Internal'}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      notification.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {notification.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Toggle Active Status */}
                  <button
                    onClick={() => toggleActive(notification.id, notification.is_active)}
                    className={`p-2 rounded-lg transition-colors ${
                      notification.is_active 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-400 hover:bg-gray-50'
                    }`}
                    title={notification.is_active ? 'Deactivate' : 'Activate'}
                  >
                    {notification.is_active ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                  
                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(notification)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit notification"
                  >
                    <Edit size={18} />
                  </button>
                  
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingNotification ? 'Edit Notification' : 'Add New Notification'}
              </h3>
              <button
                type="button"
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={4}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  >
                    {notificationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  >
                    {priorityLevels.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expires At (Optional)
                </label>
                <input
                  type="datetime-local"
                  name="expires_at"
                  value={formData.expires_at}
                  onChange={handleInputChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-pesitm-blue focus:ring-pesitm-blue border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active Notification
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="show_banner"
                    checked={formData.show_banner}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-pesitm-blue focus:ring-pesitm-blue border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Show in Banner (Home Page)
                  </label>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingNotification ? 'Update Notification' : 'Create Notification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationManagement