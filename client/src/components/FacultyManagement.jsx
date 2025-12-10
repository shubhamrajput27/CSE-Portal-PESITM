import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, User, Mail, Upload } from 'lucide-react'
import { motion } from 'framer-motion'
import axios from 'axios'

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    designation: '',
    qualification: '',
    experience: '',
    specialization: '',
    image_url: '',
    bio: '',
    research_interests: '',
    publications: ''
  })

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('http://localhost:5000/api/faculty', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.data.success) {
        setFaculty(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching faculty:', error)
      alert('Error fetching faculty. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      setUploading(true)
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      
      const response = await axios.post('http://localhost:5000/api/upload/image', uploadFormData, {
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
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('adminToken')
      
      if (editingFaculty) {
        // Update existing faculty
        const response = await axios.put(
          `http://localhost:5000/api/faculty/${editingFaculty.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.success) {
          setFaculty(faculty.map(f => 
            f.id === editingFaculty.id ? response.data.data : f
          ))
          alert('Faculty updated successfully!')
          setEditingFaculty(null)
        }
      } else {
        // Add new faculty
        const response = await axios.post(
          'http://localhost:5000/api/faculty',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.success) {
          setFaculty([...faculty, response.data.data])
          alert('Faculty added successfully!')
        }
      }
      
      setShowAddForm(false)
      setFormData({
        name: '',
        email: '',
        designation: '',
        qualification: '',
        experience: '',
        specialization: '',
        image_url: '',
        bio: '',
        research_interests: '',
        publications: ''
      })
    } catch (error) {
      console.error('Error saving faculty:', error)
      alert('Error saving faculty. Please try again.')
    }
  }

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember)
    setFormData(facultyMember)
    setShowAddForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this faculty member?')) {
      try {
        const token = localStorage.getItem('adminToken')
        const response = await axios.delete(
          `http://localhost:5000/api/faculty/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        )
        if (response.data.success) {
          setFaculty(faculty.filter(f => f.id !== id))
          alert('Faculty deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting faculty:', error)
        alert('Error deleting faculty. Please try again.')
      }
    }
  }

  const filteredFaculty = faculty.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Faculty Management</h2>
          <p className="text-gray-600">Manage department faculty members</p>
        </div>
        <button
          onClick={() => {
            setShowAddForm(true)
            setEditingFaculty(null)
            setFormData({
              name: '',
              email: '',
              designation: '',
              qualification: '',
              experience: '',
              specialization: '',
              image_url: '',
              bio: '',
              research_interests: '',
              publications: ''
            })
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={20} />
          <span>Add Faculty</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search faculty by name, designation, or specialization..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
          />
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFaculty.map((facultyMember, index) => (
          <motion.div
            key={facultyMember.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {facultyMember.image_url ? (
                    <img 
                      src={facultyMember.image_url} 
                      alt={facultyMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{facultyMember.name}</h3>
                  <p className="text-sm text-gray-600">{facultyMember.designation}</p>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                {facultyMember.email && (
                  <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-400" />
                    <span className="text-gray-600">{facultyMember.email}</span>
                  </div>
                )}
                {facultyMember.qualification && (
                  <div className="text-gray-600">
                    <strong>Qualification:</strong> {facultyMember.qualification}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                {facultyMember.experience && (
                  <p className="text-sm text-gray-600">
                    <strong>Experience:</strong> {facultyMember.experience}
                  </p>
                )}
                {facultyMember.specialization && (
                  <p className="text-sm text-gray-600 mt-1">
                    <strong>Specialization:</strong> {facultyMember.specialization}
                  </p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => handleEdit(facultyMember)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Faculty"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(facultyMember.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove Faculty"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <User size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No faculty members found</p>
        </div>
      )}

      {/* Add/Edit Faculty Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold mb-6">
              {editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {formData.image_url ? (
                    <img 
                      src={formData.image_url} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={32} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                  />
                  {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <input
                    type="text"
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="e.g., 10 years"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Research Interests</label>
                <textarea
                  name="research_interests"
                  value={formData.research_interests}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Publications</label>
                <textarea
                  name="publications"
                  value={formData.publications}
                  onChange={handleInputChange}
                  rows="2"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
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
                  disabled={loading || uploading}
                  className="px-4 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FacultyManagement