import { useState, useEffect } from 'react'
import axios from 'axios'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { Mail, User, Filter } from 'lucide-react'

const Faculty = () => {
  const [faculty, setFaculty] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  const placeholderFaculty = [
    {
      _id: '1',
      name: 'Dr. Prasanna Kumar H R',
      designation: 'Professor and Head',
      specialization: 'Computer Science & Engineering',
      email: 'hodcse@pestrust.edu.in',
      qualification: 'Ph.D, M.Tech',
      experience: '26 years',
      image: '/hod.jpg',
      bio: 'Dr. Prasanna Kumar H R brings extensive experience in computer science education and research. Under his leadership, the department has achieved significant milestones in academic excellence, research publications, and industry collaborations.'
    },
    {
      _id: '2',
      name: 'Dr. Manu A P',
      designation: 'Professor',
      specialization: 'Computer Science & Engineering',
      email: 'manu.ap@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Experienced Professor in Computer Science'
    },
    {
      _id: '3',
      name: 'Dr. Chethan L S',
      designation: 'Professor',
      specialization: 'Computer Science & Engineering',
      email: 'chethan.ls@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Professor specializing in Computer Science'
    },
    {
      _id: '4',
      name: 'Mr. Raghavendra K',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'raghavendra.k@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '5',
      name: 'Mrs. Prathibha S',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'prathibha.s@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor with focus on CSE'
    },
    {
      _id: '6',
      name: 'Dr. Sunilkumar H R',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'sunilkumar.hr@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '7',
      name: 'Mr. Rajesh T H',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'rajesh.th@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor specializing in CSE'
    },
    {
      _id: '8',
      name: 'Ms. Suchitra H L',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'suchitra.hl@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '9',
      name: 'Mrs. Suchitha H S',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'suchitha.hs@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '10',
      name: 'Ms. Vinutha H M',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'vinutha.hm@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '11',
      name: 'Mr. Sandeep. K.H',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'sandeep.kh@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '12',
      name: 'Ms. Madhu D.',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'madhu.d@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '13',
      name: 'Mr. Chethan P J',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'chethan.pj@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '14',
      name: 'Ms. Gagana G R',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'gagana.gr@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
    {
      _id: '15',
      name: 'Mr. Shivanand C. Maradi',
      designation: 'Assistant Professor',
      specialization: 'Computer Science & Engineering',
      email: 'shivanand.maradi@pestrust.edu.in',
      image: 'https://via.placeholder.com/150',
      bio: 'Assistant Professor in Computer Science'
    },
  ]

  useEffect(() => {
    fetchFaculty()
  }, [])

  const fetchFaculty = async () => {
    try {
      const response = await axios.get('/api/faculty')
      setFaculty(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching faculty:', error)
      // Use placeholder data if API fails
      setFaculty(placeholderFaculty)
      setLoading(false)
    }
  }

  const designations = ['all', 'Professor', 'Associate Professor', 'Assistant Professor']

  const filteredFaculty = filter === 'all' 
    ? faculty 
    : faculty.filter(f => f.designation.includes(filter))

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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFaculty.map((member, index) => (
                <AnimatedSection key={member._id} delay={index * 0.1}>
                  <div className="card hover:scale-105 transition-transform">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-32 h-32 rounded-full overflow-hidden mb-4 bg-gray-200">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-bold text-pesitm-blue mb-2">
                        {member.name}
                      </h3>
                      <p className="text-sm font-semibold text-pesitm-gold mb-2">
                        {member.designation}
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {member.specialization}
                      </p>
                      {member.qualification && (
                        <p className="text-xs text-gray-500 mb-1">
                          <strong>Qualification:</strong> {member.qualification}
                        </p>
                      )}
                      {member.experience && (
                        <p className="text-xs text-gray-500 mb-3">
                          <strong>Experience:</strong> {member.experience}
                        </p>
                      )}
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Mail size={16} />
                        <a 
                          href={`mailto:${member.email}`}
                          className="hover:text-pesitm-blue transition"
                        >
                          {member.email}
                        </a>
                      </div>
                      {member.bio && (
                        <p className="text-sm text-gray-600 mt-4 italic">
                          {member.bio}
                        </p>
                      )}
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
    </div>
  )
}

export default Faculty
