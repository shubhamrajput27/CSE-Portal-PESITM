import { useState, useEffect } from 'react'
import axios from 'axios'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { Mail, Phone, Award, BookOpen, Briefcase, GraduationCap, FileText, X, Filter } from 'lucide-react'

const Faculty = () => {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const placeholderFaculty = [
    {
      _id: '1',
      name: 'Dr. Prasanna Kumar HR',
      designation: 'Professor and Head',
      department: 'Computer Science & Engineering',
      email: 'prasannakumar.hr@pestrust.edu.in',
      phone: '+91-9448123456',
      qualification: 'Ph.D, M.Tech, B.E',
      experience: '26 years',
      specialization: 'Machine Learning, Data Analytics, IoT',
      image: '/faculty/Dr. Prasanna Kumar HR.png',
      research: [
        'IoT-based Smart Healthcare Systems',
        'Machine Learning Applications in Agriculture',
        'Data Analytics for Decision Making'
      ],
      publications: [
        'Published 15+ research papers in international journals',
        'Authored book chapters on IoT and ML'
      ],
      patents: ['Smart Irrigation System using IoT (Patent Filed)'],
      achievements: [
        'Best Teacher Award 2023',
        'Excellence in Research Award 2022'
      ]
    },
    {
      _id: '2',
      name: 'Dr. Manu AP',
      designation: 'Professor',
      department: 'Computer Science & Engineering',
      email: 'manu.ap@pestrust.edu.in',
      phone: '+91-9448234567',
      qualification: 'Ph.D, M.Tech, B.E',
      experience: '20 years',
      specialization: 'Artificial Intelligence, Deep Learning, Computer Vision',
      image: '/faculty/Dr. Manu AP.png',
      research: [
        'Deep Learning for Medical Image Analysis',
        'Computer Vision Applications',
        'AI-based Pattern Recognition'
      ],
      publications: ['12+ research papers in SCI/Scopus indexed journals'],
      patents: [],
      achievements: ['Research Excellence Award', 'Best Paper Award at International Conference']
    },
    {
      _id: '3',
      name: 'Dr. Chethan LS',
      designation: 'Professor',
      department: 'Computer Science & Engineering',
      email: 'chethan.ls@pestrust.edu.in',
      phone: '+91-9448345678',
      qualification: 'Ph.D, M.Tech, B.E',
      experience: '18 years',
      specialization: 'Cloud Computing, Distributed Systems, Network Security',
      image: '/faculty/Dr. Chethan LS.png',
      research: [
        'Cloud Resource Optimization',
        'Security in Distributed Systems',
        'Edge Computing'
      ],
      publications: ['10+ papers in international conferences and journals'],
      patents: [],
      achievements: ['Outstanding Faculty Award 2021']
    },
    {
      _id: '4',
      name: 'Dr. Sunilkumar H R',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'sunilkumar.hr@pestrust.edu.in',
      phone: '+91-9448456789',
      qualification: 'Ph.D, M.Tech, B.E',
      experience: '12 years',
      specialization: 'Cybersecurity, Blockchain, Cryptography',
      image: '/faculty/Dr. Sunilkumar H R.png',
      research: [
        'Blockchain for Secure Transactions',
        'Cryptographic Protocols',
        'Network Security'
      ],
      publications: ['8+ research publications'],
      patents: [],
      achievements: []
    },
    {
      _id: '5',
      name: 'Mr. Raghavendra K',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'raghavendra.k@pestrust.edu.in',
      phone: '+91-9448567890',
      qualification: 'M.Tech, B.E',
      experience: '10 years',
      specialization: 'Web Development, Database Management, Software Engineering',
      image: '/faculty/Mr. Raghavendra K.png',
      research: [
        'Modern Web Technologies',
        'Database Optimization',
        'Software Testing Methodologies'
      ],
      publications: ['5+ papers in national/international conferences'],
      patents: [],
      achievements: []
    },
    {
      _id: '6',
      name: 'Mrs. Prathibha S',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'prathibha.s@pestrust.edu.in',
      phone: '+91-9448678901',
      qualification: 'M.Tech, B.E',
      experience: '8 years',
      specialization: 'Data Structures, Algorithms, Programming Languages',
      image: '/faculty/Mrs. Prathibha S.png',
      research: [
        'Algorithm Optimization',
        'Competitive Programming',
        'Problem Solving Techniques'
      ],
      publications: ['4+ research papers'],
      patents: [],
      achievements: []
    },
    {
      _id: '7',
      name: 'Mr. Rajesh T H',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'rajesh.th@pestrust.edu.in',
      phone: '+91-9448789012',
      qualification: 'M.Tech, B.E',
      experience: '7 years',
      specialization: 'Mobile App Development, Android, iOS',
      image: '/faculty/Mr. Rajesh T H.png',
      research: [
        'Cross-platform Mobile Development',
        'Mobile UI/UX Design',
        'App Performance Optimization'
      ],
      publications: ['3+ papers in mobile computing'],
      patents: [],
      achievements: []
    },
    {
      _id: '8',
      name: 'Mr. Sandeep KH',
      designation: 'Assistant Professor',
      department: 'Computer Science & Engineering',
      email: 'sandeep.kh@pestrust.edu.in',
      phone: '+91-9448890123',
      qualification: 'M.Tech, B.E',
      experience: '6 years',
      specialization: 'Data Science, Big Data Analytics, Python Programming',
      image: '/faculty/Mr. Sandeep KH.png',
      research: [
        'Big Data Processing',
        'Predictive Analytics',
        'Data Visualization'
      ],
      publications: ['Research in data analytics'],
      patents: [],
      achievements: []
    }
  ]

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/faculty')
      if (response.data.success) {
        setFaculty(response.data.data)
      } else {
        setFaculty(placeholderFaculty)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching faculty:', error)
      // Use placeholder data if API fails
      setFaculty(placeholderFaculty)
      setLoading(false)
    }
  }

  const designations = ['all', 'Professor', 'Associate Professor', 'Assistant Professor', 'Staffs']

  const filteredFaculty = filter === 'all' 
    ? faculty 
    : faculty.filter(f => {
        if (filter === 'Professor') {
          return f.designation === 'Professor' || f.designation === 'Professor and Head'
        } else if (filter === 'Associate Professor') {
          return f.designation === 'Associate Professor'
        } else if (filter === 'Assistant Professor') {
          return f.designation === 'Assistant Professor'
        } else if (filter === 'Staffs') {
          return f.designation === 'Staff' || f.designation === 'Technical Staff' || f.designation === 'Lab Assistant'
        }
        return f.designation.includes(filter)
      })

  const openModal = (member) => {
    setSelectedFaculty(member)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setTimeout(() => setSelectedFaculty(null), 300)
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pesitm-blue to-blue-900 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Faculty</h1>
            <p className="text-xl text-gray-200">Meet our experienced and dedicated team</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="container-custom">
          <div className="flex items-center justify-center space-x-4 flex-wrap gap-3">
            <Filter size={20} className="text-pesitm-blue" />
            {designations.map((designation) => (
              <button
                key={designation}
                onClick={() => setFilter(designation)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === designation
                    ? 'bg-pesitm-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-200'
                }`}
              >
                {designation === 'all' ? 'All Faculty' : designation}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredFaculty.map((member, index) => (
                <AnimatedSection key={member._id} delay={index * 0.1}>
                  <div 
                    className="card hover:scale-105 transition-transform cursor-pointer hover:shadow-2xl"
                    onClick={() => openModal(member)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-40 h-40 rounded-lg overflow-hidden mb-4 bg-gray-200">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150?text=' + member.name.split(' ')[0]
                          }}
                        />
                      </div>
                      <h3 className="text-lg font-bold text-pesitm-blue mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm font-semibold text-pesitm-gold mb-2">
                        {member.designation}
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Click to view details
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {!loading && filteredFaculty.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No faculty members found for this filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Faculty Detail Modal */}
      {showModal && selectedFaculty && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-pesitm-blue to-blue-900 text-white p-6 rounded-t-lg flex justify-between items-start">
              <div className="flex gap-6 items-start">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-white flex-shrink-0">
                  <img
                    src={selectedFaculty.image}
                    alt={selectedFaculty.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/150?text=' + selectedFaculty.name.split(' ')[0]
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold mb-2">{selectedFaculty.name}</h2>
                  <p className="text-xl text-pesitm-gold mb-2">{selectedFaculty.designation}</p>
                  <p className="text-sm text-gray-200">{selectedFaculty.department}</p>
                </div>
              </div>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8">
              {/* Contact Information */}
              <div className="mb-8 grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Mail size={20} className="text-pesitm-blue" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <a href={`mailto:${selectedFaculty.email}`} className="text-pesitm-blue hover:underline">
                      {selectedFaculty.email}
                    </a>
                  </div>
                </div>
                {selectedFaculty.phone && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-pesitm-blue" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Phone</p>
                      <a href={`tel:${selectedFaculty.phone}`} className="text-pesitm-blue hover:underline">
                        {selectedFaculty.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Academic Details */}
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap size={20} className="text-pesitm-blue" />
                    <h3 className="font-bold text-pesitm-blue">Qualification</h3>
                  </div>
                  <p className="text-gray-700">{selectedFaculty.qualification}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase size={20} className="text-pesitm-blue" />
                    <h3 className="font-bold text-pesitm-blue">Experience</h3>
                  </div>
                  <p className="text-gray-700">{selectedFaculty.experience}</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award size={20} className="text-pesitm-blue" />
                    <h3 className="font-bold text-pesitm-blue">Specialization</h3>
                  </div>
                  <p className="text-gray-700 text-sm">{selectedFaculty.specialization}</p>
                </div>
              </div>

              {/* Research Interests */}
              {selectedFaculty.research && selectedFaculty.research.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText size={24} className="text-pesitm-blue" />
                    <h3 className="text-2xl font-bold text-pesitm-blue">Research Interests</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    {selectedFaculty.research.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Publications */}
              {selectedFaculty.publications && selectedFaculty.publications.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={24} className="text-pesitm-blue" />
                    <h3 className="text-2xl font-bold text-pesitm-blue">Publications</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    {selectedFaculty.publications.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Patents */}
              {selectedFaculty.patents && selectedFaculty.patents.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={24} className="text-pesitm-blue" />
                    <h3 className="text-2xl font-bold text-pesitm-blue">Patents</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    {selectedFaculty.patents.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Achievements */}
              {selectedFaculty.achievements && selectedFaculty.achievements.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={24} className="text-pesitm-blue" />
                    <h3 className="text-2xl font-bold text-pesitm-blue">Achievements & Awards</h3>
                  </div>
                  <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                    {selectedFaculty.achievements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Close Button */}
              <div className="mt-8 pt-6 border-t border-gray-200 flex justify-end">
                <button
                  onClick={closeModal}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Faculty
