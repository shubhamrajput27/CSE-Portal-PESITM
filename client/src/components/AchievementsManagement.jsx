import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, Award, Trophy, Star, Calendar, User, X } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

const AchievementsManagement = () => {
  const [achievements, setAchievements] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAchievement, setEditingAchievement] = useState(null)
  const [loading, setLoading] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'student',
    achiever_name: '',
    achievement_date: '',
    award_type: '',
    organization: '',
    details: ''
  })

  const achievementCategories = ['student', 'faculty', 'department', 'research', 'competition', 'award']

  useEffect(() => {
    fetchAchievements()
  }, [])

  const fetchAchievements = async () => {
    try {
      setLoading(true)
      const response = await axios.get('http://localhost:5000/api/achievements')
      if (response.data.success) {
        setAchievements(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      if (editingAchievement) {
        await axios.put(
          `http://localhost:5000/api/achievements/${editingAchievement.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert('Achievement updated successfully!')
      } else {
        await axios.post(
          'http://localhost:5000/api/achievements',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        alert('Achievement added successfully!')
      }
      resetForm()
      fetchAchievements()
    } catch (error) {
      console.error('Error saving achievement:', error)
      alert('Failed to save achievement')
    }
  }

  const handleEdit = (achievement) => {
    setEditingAchievement(achievement)
    setFormData({
      title: achievement.title,
      description: achievement.description,
      category: achievement.category,
      achiever_name: achievement.achiever_name,
      achievement_date: achievement.achievement_date ? achievement.achievement_date.split('T')[0] : '',
      award_type: achievement.award_type || '',
      organization: achievement.organization || '',
      details: achievement.details || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this achievement?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await axios.delete(
        `http://localhost:5000/api/achievements/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      alert('Achievement deleted successfully!')
      fetchAchievements()
    } catch (error) {
      console.error('Error deleting achievement:', error)
      alert('Failed to delete achievement')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'student',
      achiever_name: '',
      achievement_date: '',
      award_type: '',
      organization: '',
      details: ''
    })
    setEditingAchievement(null)
    setShowAddForm(false)
  }

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         achievement.achiever_name?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || achievement.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'student': return <User size={18} />
      case 'faculty': return <Award size={18} />
      case 'department': return <Trophy size={18} />
      case 'research': return <Star size={18} />
      case 'competition': return <Trophy size={18} />
      case 'award': return <Award size={18} />
      default: return <Star size={18} />
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      student: 'bg-blue-100 text-blue-800',
      faculty: 'bg-purple-100 text-purple-800',
      department: 'bg-green-100 text-green-800',
      research: 'bg-yellow-100 text-yellow-800',
      competition: 'bg-red-100 text-red-800',
      award: 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <Trophy className="text-pesitm-gold" size={32} />
            Achievements Management
          </h2>
          <p className="text-gray-600 mt-1">Manage department, faculty, and student achievements</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 bg-pesitm-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Add Achievement
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search achievements..."
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
            {achievementCategories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pesitm-blue"></div>
            <p className="mt-4 text-gray-600">Loading achievements...</p>
          </div>
        ) : filteredAchievements.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Trophy size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No achievements found</p>
          </div>
        ) : (
          filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getCategoryColor(achievement.category)}`}>
                    {getCategoryIcon(achievement.category)}
                    {achievement.category}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(achievement)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(achievement.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {achievement.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {achievement.description}
                </p>

                {achievement.achiever_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                    <User size={16} className="text-pesitm-blue" />
                    <span className="font-medium">{achievement.achiever_name}</span>
                  </div>
                )}

                {achievement.achievement_date && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar size={16} className="text-gray-400" />
                    {new Date(achievement.achievement_date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                )}

                {achievement.organization && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Award size={16} className="text-gray-400" />
                    <span>{achievement.organization}</span>
                  </div>
                )}

                {achievement.award_type && (
                  <div className="mt-3">
                    <span className="inline-block bg-pesitm-gold bg-opacity-20 text-pesitm-gold px-3 py-1 rounded-full text-xs font-medium">
                      {achievement.award_type}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">
                {editingAchievement ? 'Edit Achievement' : 'Add New Achievement'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter achievement title"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                  placeholder="Brief description of the achievement"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  >
                    {achievementCategories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achiever Name *</label>
                  <input
                    type="text"
                    name="achiever_name"
                    value={formData.achiever_name}
                    onChange={handleInputChange}
                    required
                    placeholder="Name of achiever"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Achievement Date *</label>
                  <input
                    type="date"
                    name="achievement_date"
                    value={formData.achievement_date}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Award Type</label>
                  <input
                    type="text"
                    name="award_type"
                    value={formData.award_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Gold Medal, First Prize"
                    className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Organization</label>
                <input
                  type="text"
                  name="organization"
                  value={formData.organization}
                  onChange={handleInputChange}
                  placeholder="Awarding organization or institution"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any additional information about the achievement"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:border-pesitm-blue"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAchievement ? 'Update Achievement' : 'Add Achievement'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default AchievementsManagement
