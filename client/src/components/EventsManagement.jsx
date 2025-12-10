import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Calendar, MapPin, Users, Clock, ArrowUp, ArrowDown, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

const EventsManagement = () => {
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    venue: '',
    category: 'workshop',
    organizer: '',
    image_url: '',
    attendees: 0,
    status: 'upcoming',
    is_featured: false,
    display_order: 0
  })

  const eventCategories = [
    'workshop', 'seminar', 'hackathon', 'guest_lecture', 
    'technical_fest', 'networking', 'conference'
  ]

  // Fetch events from API
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/events')
      if (response.data.success) {
        setEvents(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? parseInt(value) || 0 : value)
    }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      venue: '',
      category: 'workshop',
      organizer: '',
      image_url: '',
      attendees: 0,
      status: 'upcoming',
      is_featured: false,
      display_order: 0
    })
    setEditingEvent(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      if (editingEvent) {
        // Update existing event
        await axios.put(
          `http://localhost:5000/api/events/${editingEvent.id}`, 
          formData, 
          config
        )
      } else {
        // Create new event
        await axios.post('http://localhost:5000/api/events', formData, config)
      }

      fetchEvents() // Refresh the list
      resetForm()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event. Please try again.')
    }
  }

  const handleEdit = (event) => {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      date: event.date ? new Date(event.date).toISOString().slice(0, 16) : '',
      venue: event.venue || '',
      category: event.category || 'workshop',
      organizer: event.organizer || '',
      image_url: event.image_url || '',
      attendees: event.attendees || 0,
      status: event.status || 'upcoming',
      is_featured: event.is_featured || false,
      display_order: event.display_order || 0
    })
    setEditingEvent(event)
    setShowAddForm(true)
  }

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('adminToken')
        await axios.delete(
          `http://localhost:5000/api/events/${eventId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        fetchEvents() // Refresh the list
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('Error deleting event. Please try again.')
      }
    }
  }

  const handleOrderChange = async (eventId, direction) => {
    const event = events.find(e => e.id === eventId)
    if (!event) return

    const newOrder = direction === 'up' 
      ? Math.max(1, event.display_order - 1)
      : event.display_order + 1

    try {
      const token = localStorage.getItem('adminToken')
      await axios.put(
        'http://localhost:5000/api/events/order/update',
        { eventId, newOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchEvents() // Refresh to show new order
    } catch (error) {
      console.error('Error updating event order:', error)
    }
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

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pesitm-blue"></div>
        <span className="ml-3 text-gray-600">Loading events...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Events Management</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center bg-pesitm-blue text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} className="mr-2" />
          Add Event
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-pesitm-blue"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:border-pesitm-blue"
        >
          <option value="all">All Categories</option>
          {eventCategories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No events found</p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                    {event.is_featured && (
                      <Star size={20} className="text-yellow-500 fill-current" />
                    )}
                    <span className="px-2 py-1 text-xs rounded-full bg-pesitm-blue text-white">
                      Order: {event.display_order}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-1" />
                      {event.venue}
                    </div>
                    <div className="flex items-center">
                      <Users size={16} className="mr-1" />
                      {event.attendees} attendees
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      event.status === 'upcoming' ? 'bg-green-100 text-green-800' :
                      event.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {event.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {/* Order Controls */}
                  <div className="flex flex-col">
                    <button
                      onClick={() => handleOrderChange(event.id, 'up')}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Move up"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      onClick={() => handleOrderChange(event.id, 'down')}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Move down"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                  
                  {/* Action Buttons */}
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
            <h3 className="text-xl font-bold mb-4">
              {editingEvent ? 'Edit Event' : 'Add New Event'}
            </h3>
            
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
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  >
                    {eventCategories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Organizer
                  </label>
                  <input
                    type="text"
                    name="organizer"
                    value={formData.organizer}
                    onChange={handleInputChange}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expected Attendees
                  </label>
                  <input
                    type="number"
                    name="attendees"
                    value={formData.attendees}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 text-pesitm-blue focus:ring-pesitm-blue border-gray-300 rounded"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Featured Event
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingEvent ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventsManagement