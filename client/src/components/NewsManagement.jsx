import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, FileText, Eye, Star, Clock, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

const NewsManagement = () => {
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    image_url: '',
    published_at: new Date().toISOString().slice(0, 16),
    is_featured: false,
    is_published: true
  })

  const newsCategories = [
    'general', 'announcement', 'research', 'achievement', 
    'event', 'academic', 'placement', 'alumni'
  ]

  // Fetch news from API
  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/news/admin/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setNews(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      alert('Error fetching news. Please check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const formDataToSend = new FormData()
      formDataToSend.append('image', file)

      const response = await axios.post('http://localhost:5000/api/upload/image', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          image_url: response.data.data.image_url
        }))
        alert('Image uploaded successfully!')
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Error uploading image. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      image_url: '',
      published_at: new Date().toISOString().slice(0, 16),
      is_featured: false,
      is_published: true
    })
    setEditingNews(null)
    // Don't close form here - let the component that calls this decide
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.title.trim()) {
      alert('Title is required')
      return
    }
    if (!formData.excerpt.trim()) {
      alert('Excerpt is required')
      return
    }
    if (!formData.content.trim()) {
      alert('Content is required')
      return
    }
    
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        alert('No authentication token found. Please login again.')
        return
      }
      
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      }

      // Prepare form data with proper ISO date format
      const dataToSend = {
        ...formData,
        published_at: formData.published_at ? new Date(formData.published_at).toISOString() : new Date().toISOString()
      }

      if (editingNews) {
        // Update existing news
        const response = await axios.put(
          `http://localhost:5000/api/news/${editingNews.id}`, 
          dataToSend, 
          config
        )
        if (response.data.success) {
          alert('News updated successfully!')
        }
      } else {
        // Create new news
        const response = await axios.post('http://localhost:5000/api/news', dataToSend, config)
        if (response.data.success) {
          alert('News published successfully!')
        }
      }

      fetchNews() // Refresh the list
      resetForm()
      setShowAddForm(false)
    } catch (error) {
      console.error('Error saving news:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Unknown error occurred'
      alert(`Error saving news: ${errorMessage}`)
    }
  }

  const handleEdit = (article) => {
    setFormData({
      title: article.title || '',
      content: article.content || '',
      excerpt: article.excerpt || '',
      category: article.category || 'general',
      image_url: article.image_url || '',
      published_at: article.published_at ? new Date(article.published_at).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
      is_featured: article.is_featured || false,
      is_published: article.is_published !== false
    })
    setEditingNews(article)
    setShowAddForm(true)
  }

  const handleDelete = async (newsId) => {
    if (window.confirm('Are you sure you want to delete this news?')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.delete(
          `http://localhost:5000/api/news/${newsId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.success) {
          setNews(news.filter(item => item.id !== newsId))
          alert('News deleted successfully')
        } else {
          alert('Failed to delete news')
        }
      } catch (error) {
        console.error('Error deleting news:', error)
        alert('Error deleting news. Please try again.')
      }
    }
  }

  const togglePublished = async (newsId) => {
    const article = news.find(n => n.id === newsId)
    if (!article) return
    try {
      const token = localStorage.getItem('adminToken')
      const updateData = {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        image_url: article.image_url,
        published_at: !article.is_published ? new Date().toISOString() : article.published_at,
        is_featured: article.is_featured,
        is_published: !article.is_published
      }
      await axios.put(
        `http://localhost:5000/api/news/${newsId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchNews()
    } catch (error) {
      console.error('Error toggling published status:', error)
      alert('Error toggling published status. Please try again.')
    }
  }

  const toggleFeatured = async (newsId) => {
    const article = news.find(n => n.id === newsId)
    if (!article) return
    try {
      const token = localStorage.getItem('adminToken')
      const updateData = {
        title: article.title,
        content: article.content,
        excerpt: article.excerpt,
        category: article.category,
        image_url: article.image_url,
        published_at: article.published_at,
        is_featured: !article.is_featured,
        is_published: article.is_published
      }
      await axios.put(
        `http://localhost:5000/api/news/${newsId}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      fetchNews()
    } catch (error) {
      console.error('Error toggling featured status:', error)
      alert('Error toggling featured status. Please try again.')
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.excerpt && item.excerpt.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pesitm-blue"></div>
        <span className="ml-3 text-gray-600">Loading news...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setShowAddForm(true)
            setEditingNews(null)
            resetForm()
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Publish News</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
          >
            <option value="all">All Categories</option>
            {newsCategories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map((newsItem, index) => (
          <motion.div
            key={newsItem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start space-x-4">
              {newsItem.image_url && (
                <div className="w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img 
                    src={newsItem.image_url} 
                    alt={newsItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-1 bg-pesitm-blue bg-opacity-10 text-pesitm-blue text-xs rounded-full">
                      {newsItem.category.charAt(0).toUpperCase() + newsItem.category.slice(1)}
                    </span>
                    {newsItem.is_featured && (
                      <span className="flex items-center space-x-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        <Star size={12} />
                        <span>Featured</span>
                      </span>
                    )}
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      newsItem.is_published 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {newsItem.is_published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{formatDate(newsItem.published_at)}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{newsItem.title}</h3>
                <p className="text-sm text-gray-600 mb-2">{newsItem.excerpt}</p>
                <p className="text-xs text-gray-500">By {newsItem.author_name}</p>
              </div>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => toggleFeatured(newsItem.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    newsItem.is_featured 
                      ? 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title="Toggle Featured"
                >
                  <Star size={18} />
                </button>
                <button
                  onClick={() => togglePublished(newsItem.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    newsItem.is_published 
                      ? 'text-green-600 bg-green-50 hover:bg-green-100' 
                      : 'text-gray-400 hover:bg-gray-50'
                  }`}
                  title="Toggle Published"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(newsItem)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit News"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(newsItem.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete News"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No news articles found</p>
        </div>
      )}

      {/* Add/Edit News Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-6">
              {editingNews ? 'Edit News Article' : 'Publish New News'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter news title"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt/Summary *</label>
                <input
                  type="text"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleInputChange}
                  placeholder="Brief summary of the news article"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows="8"
                  placeholder="Full news article content..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  >
                    {newsCategories.map(category => (
                      <option key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Publish Date & Time</label>
                  <input
                    type="datetime-local"
                    name="published_at"
                    value={formData.published_at}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="hidden"
                        id="news-image-upload"
                      />
                      <label
                        htmlFor="news-image-upload"
                        className="flex items-center gap-2 px-4 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors disabled:opacity-50"
                      >
                        <Upload size={18} />
                        {uploading ? 'Uploading...' : 'Choose Image'}
                      </label>
                    </div>
                    {formData.image_url && (
                      <div className="flex items-start gap-2">
                        <img
                          src={formData.image_url}
                          alt="News preview"
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="text-sm text-green-600 font-medium">✓ Image uploaded</p>
                          <p className="text-xs text-gray-600 break-all">{formData.image_url}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm text-gray-700">
                    Featured article
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    checked={formData.is_published}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <label htmlFor="is_published" className="text-sm text-gray-700">
                    Publish immediately
                  </label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700"
                >
                  {editingNews ? 'Update Article' : 'Publish News'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default NewsManagement