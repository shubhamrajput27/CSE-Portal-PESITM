import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { Calendar, MapPin, Users, FileText } from 'lucide-react'

const Events = () => {
  const [searchParams] = useSearchParams()
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'news' ? 'news' : 'events')

  useEffect(() => {
    fetchEvents()
    fetchNews()
  }, [])

  useEffect(() => {
    // Update active tab based on URL parameter
    const tab = searchParams.get('tab')
    if (tab === 'news') {
      setActiveTab('news')
    } else {
      setActiveTab('events')
    }
  }, [searchParams])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events')
      if (response.data.success && response.data.data.length > 0) {
        setEvents(response.data.data)
      } else {
        console.log('No events in database, using placeholder events')
        setEvents(placeholderEvents)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents(placeholderEvents)
    } finally {
      setLoading(false)
    }
  }

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/news')
      if (response.data.success && response.data.data.length > 0) {
        setNews(response.data.data)
      } else {
        setNews(placeholderNews)
      }
    } catch (error) {
      console.error('Error fetching news:', error)
      // Set placeholder news when API fails
      setNews(placeholderNews)
    }
  }

  const placeholderEvents = [
    {
      _id: '1',
      title: 'National Level Technical Symposium - TECHNOVATE 2024',
      date: '2024-12-15',
      description: 'Annual technical fest featuring coding competitions, hackathons, paper presentations, and tech talks by industry experts.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      venue: 'PESITM Main Auditorium',
      category: 'Technical Fest'
    },
    {
      _id: '2',
      title: 'Workshop on Machine Learning and AI',
      date: '2024-11-20',
      description: 'Two-day hands-on workshop covering fundamentals of ML, neural networks, and practical implementation using Python.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      venue: 'AI/ML Lab',
      category: 'Workshop'
    },
    {
      _id: '3',
      title: 'Guest Lecture on Cloud Computing by AWS Expert',
      date: '2024-11-25',
      description: 'Industry expert from Amazon Web Services sharing insights on cloud architecture and career opportunities.',
      image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800',
      venue: 'Seminar Hall',
      category: 'Guest Lecture'
    },
    {
      _id: '4',
      title: 'CodeSprint - 24 Hour Hackathon',
      date: '2024-12-01',
      description: 'Intense 24-hour coding marathon where teams build innovative solutions to real-world problems.',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      venue: 'CSE Department Labs',
      category: 'Hackathon'
    },
    {
      _id: '5',
      title: 'Cybersecurity Awareness Week',
      date: '2024-11-28',
      description: 'Week-long series of sessions on ethical hacking, network security, and cyber threats awareness.',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      venue: 'Various Locations',
      category: 'Seminar Series'
    },
    {
      _id: '6',
      title: 'Alumni Meetup and Networking Event',
      date: '2024-12-10',
      description: 'Connect with successful alumni working in top tech companies, share experiences, and network.',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      venue: 'College Grounds',
      category: 'Networking'
    },
  ]

  const placeholderNews = [
    {
      _id: '1',
      title: 'Department Achieves Top Rankings in University Examinations',
      date: '2024-12-01',
      description: 'CSE Department students secured top positions in recent semester examinations with exceptional performance across all subjects.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
      category: 'Achievement'
    },
    {
      _id: '2',
      title: 'New AI Research Lab Inaugurated',
      date: '2024-11-28',
      description: 'State-of-the-art Artificial Intelligence and Machine Learning research lab inaugurated with latest equipment and high-performance computing facilities.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      category: 'Infrastructure'
    },
    {
      _id: '3',
      title: 'Students Win National Level Hackathon',
      date: '2024-11-25',
      description: 'Team of CSE students won first prize at Smart India Hackathon 2024 with innovative solution for smart city development.',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      category: 'Achievement'
    },
    {
      _id: '4',
      title: 'MoU Signed with Leading Tech Company',
      date: '2024-11-20',
      description: 'Department signed Memorandum of Understanding with major tech firm for industry collaboration and student internship opportunities.',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800',
      category: 'Collaboration'
    },
    {
      _id: '5',
      title: 'Faculty Member Publishes Research in International Journal',
      date: '2024-11-15',
      description: 'Dr. Prasanna Kumar HR published groundbreaking research paper on Machine Learning applications in reputed IEEE journal.',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
      category: 'Research'
    },
    {
      _id: '6',
      title: 'Placement Drive Success - 95% Students Placed',
      date: '2024-11-10',
      description: 'CSE Department achieves record placement statistics with students securing positions in top companies like Microsoft, Amazon, Google, and TCS.',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800',
      category: 'Placement'
    },
    {
      _id: '7',
      title: 'Student Team Wins IEEE Project Competition',
      date: '2024-11-05',
      description: 'Final year students won IEEE project competition with IoT-based smart agriculture monitoring system.',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      category: 'Achievement'
    },
    {
      _id: '8',
      title: 'Department Launches New Certification Programs',
      date: '2024-10-30',
      description: 'CSE Department introduces industry-aligned certification programs in Cloud Computing, Cybersecurity, and Data Science.',
      image: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800',
      category: 'Academic'
    },
    {
      _id: '9',
      title: 'International Collaboration with Foreign University',
      date: '2024-10-25',
      description: 'Department establishes research collaboration with renowned foreign university for joint research projects and student exchange programs.',
      image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800',
      category: 'Collaboration'
    },
  ]

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(dateString).toLocaleDateString('en-US', options)
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gradient-to-r from-pesitm-blue to-blue-900 text-white py-16">
        <div className="container-custom">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Events & News</h1>
            <p className="text-xl text-gray-200">Stay updated with latest happenings</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-gray-100 border-b border-gray-200">
        <div className="container-custom">
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab('events')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all ${
                activeTab === 'events'
                  ? 'bg-white text-pesitm-blue border-b-4 border-pesitm-gold'
                  : 'text-gray-600 hover:text-pesitm-blue'
              }`}
            >
              <Calendar size={20} />
              <span>Upcoming Events</span>
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center space-x-2 px-6 py-4 font-semibold transition-all ${
                activeTab === 'news'
                  ? 'bg-white text-pesitm-blue border-b-4 border-pesitm-gold'
                  : 'text-gray-600 hover:text-pesitm-blue'
              }`}
            >
              <FileText size={20} />
              <span>Latest News</span>
            </button>
          </div>
        </div>
      </section>

      {/* Content based on active tab */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {(activeTab === 'events' ? events : news).map((item, index) => (
                <AnimatedSection key={item._id} delay={index * 0.1} className="flex">
                  <div className="card overflow-hidden p-0 hover:scale-105 transition-transform w-full flex flex-col">
                    <div className="h-48 overflow-hidden flex-shrink-0">
                      <img
                        src={item.image_url || item.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
                        alt={item.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 self-start ${
                        activeTab === 'events' 
                          ? 'bg-pesitm-gold text-pesitm-blue' 
                          : 'bg-blue-100 text-pesitm-blue'
                      }`}>
                        {item.category}
                      </div>
                      <h3 className="text-xl font-bold text-pesitm-blue mb-3 h-14 overflow-hidden">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 mb-4 h-20 overflow-hidden">
                        {item.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500 mt-auto pt-2">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-pesitm-blue" />
                          <span>{formatDate(item.date)}</span>
                        </div>
                        {activeTab === 'events' && item.venue && (
                          <div className="flex items-center space-x-2">
                            <MapPin size={16} className="text-pesitm-blue" />
                            <span>{item.venue}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {!loading && activeTab === 'events' && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No upcoming events at the moment.</p>
            </div>
          )}

          {!loading && activeTab === 'news' && news.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No news updates at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Past Highlights */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <AnimatedSection>
            <h2 className="section-heading text-center mb-12">Recent Highlights</h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="card text-center">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">50+</div>
                <p className="text-gray-600">Events Conducted This Year</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <div className="card text-center">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">1000+</div>
                <p className="text-gray-600">Student Participants</p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <div className="card text-center">
                <div className="text-4xl font-bold text-pesitm-blue mb-2">30+</div>
                <p className="text-gray-600">Industry Experts Invited</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Events
