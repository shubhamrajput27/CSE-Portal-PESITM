import { useState, useEffect, useRef } from 'react'
import { Calendar, MapPin, ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from './AnimatedSection'
import axios from 'axios'

const NewsEventsSection = () => {
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('events')
  const scrollContainerRef = useRef(null)

  // Fetch events and news from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch events
        const eventsResponse = await axios.get('http://localhost:5000/api/events')
        if (eventsResponse.data) {
          setEvents(eventsResponse.data.slice(0, 6))
        }
        
        // Fetch news
        const newsResponse = await axios.get('http://localhost:5000/api/news')
        if (newsResponse.data.success) {
          setNews(newsResponse.data.data.slice(0, 6))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to sample data if API fails
        setEvents(sampleEvents)
        setNews(sampleNews)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Auto-scroll effect for horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current
    if (!scrollContainer) return

    let scrollInterval
    let scrollDirection = 1 // 1 for right, -1 for left
    let isPaused = false

    const startAutoScroll = () => {
      scrollInterval = setInterval(() => {
        if (!isPaused && scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth
          const currentScroll = scrollContainer.scrollLeft

          // Change direction at the ends
          if (currentScroll >= maxScroll) {
            scrollDirection = -1
          } else if (currentScroll <= 0) {
            scrollDirection = 1
          }

          // Scroll smoothly
          scrollContainer.scrollLeft += scrollDirection * 2
        }
      }, 30)
    }

    // Pause on hover
    const handleMouseEnter = () => {
      isPaused = true
    }

    const handleMouseLeave = () => {
      isPaused = false
    }

    scrollContainer.addEventListener('mouseenter', handleMouseEnter)
    scrollContainer.addEventListener('mouseleave', handleMouseLeave)

    startAutoScroll()

    return () => {
      clearInterval(scrollInterval)
      if (scrollContainer) {
        scrollContainer.removeEventListener('mouseenter', handleMouseEnter)
        scrollContainer.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [loading, activeTab])

  // Sample events data as fallback
  const sampleEvents = [
    {
      _id: '1',
      title: 'AI & ML Workshop',
      description: 'Comprehensive workshop on Artificial Intelligence and Machine Learning fundamentals',
      date: new Date('2025-11-15'),
      venue: 'CSE Lab 1',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      category: 'Workshop'
    },
    {
      _id: '2',
      title: 'PES Inaugy Hackathon, Shivamogga',
      description: 'Annual hackathon event showcasing innovative projects and solutions',
      date: new Date('2025-11-20'),
      venue: 'Main Auditorium',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      category: 'Hackathon'
    },
    {
      _id: '3',
      title: 'Summer Internship Program 2025',
      description: 'Applications open for summer internship opportunities with leading tech companies',
      date: new Date('2025-12-01'),
      venue: 'Conference Hall',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      category: 'Workshop'
    },
    {
      _id: '4',
      title: 'Guest Lecture on Cloud Computing',
      description: 'Expert speaker from AWS to discuss cloud architecture and best practices',
      date: new Date('2025-11-25'),
      venue: 'Seminar Hall',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      category: 'Guest Lecture'
    },
    {
      _id: '5',
      title: 'Project Expo 2025',
      description: 'Annual exhibition of student projects across various domains of computer science',
      date: new Date('2025-12-05'),
      venue: 'Exhibition Hall',
      image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800',
      category: 'Exhibition'
    },
    {
      _id: '6',
      title: 'Coding Competition - CodeWars',
      description: 'Inter-college coding competition with exciting prizes and challenges',
      date: new Date('2025-12-10'),
      venue: 'Computer Lab 2',
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      category: 'Competition'
    },
    {
      _id: '7',
      title: 'Cybersecurity Awareness Week',
      description: 'Week-long program on cybersecurity threats and defense mechanisms',
      date: new Date('2025-12-15'),
      venue: 'Multiple Venues',
      image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
      category: 'Workshop'
    }
  ]

  // Sample news data
  const sampleNews = [
    {
      id: 1,
      title: 'Welcome to CSE Department Portal',
      excerpt: 'New department portal launched with enhanced features for students and faculty',
      category: 'announcement',
      image_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      published_at: '2024-11-10T10:00:00Z'
    },
    {
      id: 2,
      title: 'Research Collaboration with Industry',
      excerpt: 'New partnerships established with leading tech companies for research projects',
      category: 'research',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      published_at: '2024-11-08T14:30:00Z'
    },
    {
      id: 3,
      title: 'Student Achievements in National Competition',
      excerpt: 'CSE students win first place in national level hackathon competition',
      category: 'achievement',
      image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
      published_at: '2024-11-05T16:45:00Z'
    },
    {
      id: 4,
      title: 'New Computer Lab with Advanced Infrastructure',
      excerpt: 'State-of-the-art computer lab inaugurated with latest hardware and software',
      category: 'announcement',
      image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
      published_at: '2024-11-03T09:00:00Z'
    },
    {
      id: 5,
      title: 'Faculty Publications in Top Journals',
      excerpt: 'Department faculty members publish research papers in prestigious international journals',
      category: 'research',
      image_url: 'https://images.unsplash.com/photo-1532619187608-e5375cab36aa?w=800',
      published_at: '2024-10-28T11:20:00Z'
    },
    {
      id: 6,
      title: 'Placement Drive: 150+ Students Placed',
      excerpt: 'Record placement season with students securing positions in top tech companies',
      category: 'achievement',
      image_url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800',
      published_at: '2024-10-25T15:30:00Z'
    },
    {
      id: 7,
      title: 'Department Hosts National Conference',
      excerpt: 'Successfully organized national conference on emerging technologies in computing',
      category: 'announcement',
      image_url: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800',
      published_at: '2024-10-20T13:45:00Z'
    }
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: 'numeric', month: 'short', year: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  const renderNewsCard = (newsItem, index) => (
    <div key={newsItem.id || index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={newsItem.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={newsItem.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-pesitm-blue text-white px-3 py-1 rounded-full text-sm font-medium">
            {newsItem.category?.charAt(0).toUpperCase() + newsItem.category?.slice(1) || 'News'}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <FileText size={16} className="mr-2" />
          {formatDate(newsItem.published_at)}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {newsItem.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {newsItem.excerpt}
        </p>
        <Link 
          to={`/news/${newsItem.id}`}
          className="inline-flex items-center text-pesitm-blue hover:text-blue-700 font-semibold transition-colors"
        >
          Read More
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  )

  const renderEventCard = (event, index) => (
    <div key={event._id || event.id || index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-4 left-4">
          <span className="bg-pesitm-gold text-white px-3 py-1 rounded-full text-sm font-medium">
            {event.category}
          </span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={16} className="mr-2" />
          {formatDate(event.date)}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
          {event.title}
        </h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {event.description}
        </p>
        {event.venue && (
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <MapPin size={16} className="mr-2" />
            {event.venue}
          </div>
        )}
        <Link 
          to={`/events/${event._id || event.id}`}
          className="inline-flex items-center text-pesitm-blue hover:text-blue-700 font-semibold transition-colors"
        >
          Learn More
          <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  )

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        {/* Section Header */}
        <AnimatedSection>
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-pesitm-blue">
            Latest News & Events
          </h2>
          
          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('news')}
                className={`px-6 py-3 border-2 font-semibold rounded-lg transition flex items-center space-x-2 ${
                  activeTab === 'news'
                    ? 'bg-pesitm-blue text-white border-pesitm-blue'
                    : 'border-pesitm-blue text-pesitm-blue hover:bg-pesitm-blue hover:text-white'
                }`}
              >
                <FileText size={20} />
                <span>Latest News</span>
              </button>
              <button
                onClick={() => setActiveTab('events')}
                className={`px-6 py-3 border-2 font-semibold rounded-lg transition flex items-center space-x-2 ${
                  activeTab === 'events'
                    ? 'bg-pesitm-blue text-white border-pesitm-blue'
                    : 'border-pesitm-blue text-pesitm-blue hover:bg-pesitm-blue hover:text-white'
                }`}
              >
                <Calendar size={20} />
                <span>Upcoming Events</span>
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* Content - Horizontal Scroll */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pesitm-blue"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        ) : (
          <div className="relative">
            {/* Horizontal Scrollable Container with Auto-Scroll */}
            <div 
              ref={scrollContainerRef}
              className="overflow-x-auto pb-4 scrollbar-hide"
              style={{ scrollBehavior: 'smooth' }}
            >
              <div className="flex gap-6 px-2" style={{ minWidth: 'max-content' }}>
                {activeTab === 'news' 
                  ? news.map((newsItem, index) => (
                      <AnimatedSection key={newsItem.id || index} delay={index * 0.1}>
                        <div style={{ width: '350px', flexShrink: 0 }}>
                          {renderNewsCard(newsItem, index)}
                        </div>
                      </AnimatedSection>
                    ))
                  : events.map((event, index) => (
                      <AnimatedSection key={event._id || event.id || index} delay={index * 0.1}>
                        <div style={{ width: '350px', flexShrink: 0 }}>
                          {renderEventCard(event, index)}
                        </div>
                      </AnimatedSection>
                    ))
                }
              </div>
            </div>
          </div>
        )}

        {/* View All Button */}
        <AnimatedSection delay={0.6}>
          <div className="text-center mt-12">
            <Link 
              to={activeTab === 'news' ? '/events?tab=news' : '/events'}
              className="btn-secondary inline-flex items-center"
            >
              View All {activeTab === 'news' ? 'News' : 'Events'}
              <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default NewsEventsSection