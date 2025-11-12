import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, User, Mail, Phone, Award, X, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

const FacultyManagement = () => {
  const [faculty, setFaculty] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingFaculty, setEditingFaculty] = useState(null)
  const [selectedFaculty, setSelectedFaculty] = useState(null) // For popup
  const [imagePreview, setImagePreview] = useState('') // For image preview
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: 'CSE',
    qualification: '',
    experience: '',
    specialization: '',
    bio: '', // Changed from description
    isActive: true
  })

  useEffect(() => {
    fetchFaculty()
  }, [])

  // Fetch faculty from API
  const fetchFaculty = async () => {
    try {
      const response = await fetch('/api/faculty')
      if (response.ok) {
        const data = await response.json()
        setFaculty(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching faculty:', error)
      // Fallback to sample data if API fails
      setFaculty([
        {
          id: 1,
          name: 'Dr. Prasanna Kumar H R',
          email: 'hod.cse@pesitm.edu.in',
          designation: 'Professor & HOD',
          qualification: 'Ph.D in Computer Science',
          experience: '15 years',
          specialization: 'Machine Learning, Data Mining',
          bio: 'Distinguished Professor and Head of CSE Department',
          image_url: '/hod.jpg',
          is_active: true
        }
      ])
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Reset form and states
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      designation: '',
      department: 'CSE',
      qualification: '',
      experience: '',
      specialization: '',
      bio: '',
      isActive: true
    })
    setImagePreview('')
    setEditingFaculty(null)
    setShowAddForm(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (editingFaculty) {
      // Update existing faculty
      setFaculty(faculty.map(f => 
        f.id === editingFaculty.id ? { 
          ...formData, 
          id: editingFaculty.id,
          image: imagePreview || f.image // Use new image or keep existing
        } : f
      ))
    } else {
      // Add new faculty
      const newFaculty = {
        ...formData,
        id: Date.now(),
        image: imagePreview || '/default-avatar.jpg'
      }
      setFaculty([...faculty, newFaculty])
    }
    resetForm()
  }

  const handleEdit = (facultyMember) => {
    setEditingFaculty(facultyMember)
    setFormData({
      ...facultyMember,
      bio: facultyMember.bio || ''
    })
    setImagePreview(facultyMember.image || '')
    setShowAddForm(true)
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this faculty member?')) {
      setFaculty(faculty.filter(f => f.id !== id))
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
              phone: '',
              designation: '',
              department: 'CSE',
              qualification: '',
              experience: '',
              specialization: '',
              image: '',
              isActive: true
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
                  {facultyMember.image ? (
                    <img 
                      src={facultyMember.image} 
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
                <div className="flex items-center space-x-2">
                  <Mail size={16} className="text-gray-400" />
                  <span className="text-gray-600">{facultyMember.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-gray-600">{facultyMember.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award size={16} className="text-gray-400" />
                  <span className="text-gray-600">{facultyMember.qualification}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  <strong>Experience:</strong> {facultyMember.experience}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  <strong>Specialization:</strong> {facultyMember.specialization}
                </p>
              </div>
              
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => setSelectedFaculty(facultyMember)}
                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="View Details"
                >
                  <Eye size={18} />
                </button>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
                  <select
                    name="designation"
                    value={formData.designation}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  >
                    <option value="">Select Designation</option>
                    <option value="Professor & HOD">Professor & HOD</option>
                    <option value="Professor">Professor</option>
                    <option value="Associate Professor">Associate Professor</option>
                    <option value="Assistant Professor">Assistant Professor</option>
                    <option value="Lecturer">Lecturer</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    placeholder="e.g., Ph.D in Computer Science"
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
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  placeholder="e.g., Machine Learning, AI, Database Systems"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio/Description</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Brief description about the faculty member..."
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                <div className="space-y-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pesitm-blue focus:border-pesitm-blue"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-24 h-24 object-cover rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="rounded"
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active faculty member
                </label>
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
                  {editingFaculty ? 'Update Faculty' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Faculty Detail Modal */}
      {selectedFaculty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Faculty Details</h3>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={24} className="text-gray-500" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Faculty Image */}
                <div className="md:col-span-1">
                  <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                    {selectedFaculty.image ? (
                      <img 
                        src={selectedFaculty.image} 
                        alt={selectedFaculty.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Faculty Information */}
                <div className="md:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900">{selectedFaculty.name}</h4>
                    <p className="text-lg text-pesitm-blue font-medium">{selectedFaculty.designation}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-gray-600">{selectedFaculty.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-gray-600">{selectedFaculty.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award size={16} className="text-gray-400" />
                      <span className="text-gray-600">{selectedFaculty.qualification}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User size={16} className="text-gray-400" />
                      <span className="text-gray-600">Experience: {selectedFaculty.experience}</span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-gray-900 mb-2">Specialization</h5>
                    <p className="text-gray-600">{selectedFaculty.specialization}</p>
                  </div>

                  {selectedFaculty.bio && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">About</h5>
                      <p className="text-gray-600 leading-relaxed">{selectedFaculty.bio}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={() => {
                    setSelectedFaculty(null)
                    handleEdit(selectedFaculty)
                  }}
                  className="px-4 py-2 bg-pesitm-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Edit Faculty
                </button>
                <button
                  onClick={() => setSelectedFaculty(null)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default FacultyManagement