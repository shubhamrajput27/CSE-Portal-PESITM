import { useState, useEffect } from 'react'
import { Calendar, MapPin, ArrowRight, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'
import AnimatedSection from './AnimatedSection'
import axios from 'axios'

const NewsEventsSection = () => {
  const [events, setEvents] = useState([])
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('events')

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
        // Fallback to sample data if API fails
        setEvents(sampleEvents)
        setNews(sampleNews)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

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
          
          {/* Button Navigation */}
          <div className="flex justify-center mb-12">
            <div className="flex flex-wrap gap-4">
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

        {/* Content Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pesitm-blue"></div>
            <p className="mt-4 text-gray-600">Loading content...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeTab === 'news' 
              ? news.map((newsItem, index) => (
                  <AnimatedSection key={newsItem.id || index} delay={index * 0.1}>
                    {renderNewsCard(newsItem, index)}
                  </AnimatedSection>
                ))
              : events.map((event, index) => (
                  <AnimatedSection key={event._id || event.id || index} delay={index * 0.1}>
                    {renderEventCard(event, index)}
                  </AnimatedSection>
                ))
            }
          </div>
        )}

        {/* View All Button */}
        <AnimatedSection delay={0.6}>
          <div className="text-center mt-12">
            <Link 
              to={activeTab === 'news' ? '/news' : '/events'}
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