import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, FileText, Eye, Star, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

const NewsManagement = () => {
  const [news, setNews] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    image_url: '',
    is_featured: false,
    is_published: true
  })

  const newsCategories = [
    'general', 'announcement', 'research', 'achievement', 
    'event', 'academic', 'placement', 'alumni'
  ]

  useEffect(() => {
    fetchNews()
  }, [])

  // Fetch news from API
  const fetchNews = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/news', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        const data = await response.json()
        setNews(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      setNews([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingNews) {
      // Update existing news
      setNews(news.map(item => 
        item.id === editingNews.id ? { 
          ...formData, 
          id: editingNews.id,
          published_at: editingNews.published_at,
          author_name: editingNews.author_name
        } : item
      ))
      setEditingNews(null)
    } else {
      // Add new news
      const newNews = {
        ...formData,
        id: Date.now(),
        published_at: new Date().toISOString(),
        author_name: 'Admin'
      }
      setNews([newNews, ...news])
    }
    setShowAddForm(false)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      image_url: '',
      is_featured: false,
      is_published: true
    })
  }

  const handleEdit = (newsItem) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      content: newsItem.content,
      excerpt: newsItem.excerpt,
      category: newsItem.category,
      image_url: newsItem.image_url,
      is_featured: newsItem.is_featured,
      is_published: newsItem.is_published
    })
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this news article?')) {
      setNews(news.filter(item => item.id !== id))
    }
  }

  const togglePublished = (id) => {
    setNews(news.map(item =>
      item.id === id ? { ...item, is_published: !item.is_published } : item
    ))
  }

  const toggleFeatured = (id) => {
    setNews(news.map(item =>
      item.id === id ? { ...item, is_featured: !item.is_featured } : item
    ))
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
                         item.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">News Management</h2>
          <p className="text-gray-600">Manage news articles and announcements</p>
        </div>
        <button
          onClick={() => {
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
                  required
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
                  required
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
                  required
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
                    required
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
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