import { useState, useEffect } from 'react'
import axios from 'axios'
import AnimatedSection from '../components/AnimatedSection'
import LoadingSpinner from '../components/LoadingSpinner'
import { Calendar, MapPin, Users } from 'lucide-react'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/events')
      if (response.data.success) {
        setEvents(response.data.data)
      } else {
        setEvents(placeholderEvents)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents(placeholderEvents)
      setLoading(false)
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

      {/* Events Grid */}
      <section className="py-16">
        <div className="container-custom">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event, index) => (
                <AnimatedSection key={event._id} delay={index * 0.1}>
                  <div className="card overflow-hidden p-0 hover:scale-105 transition-transform">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6">
                      <div className="inline-block px-3 py-1 bg-pesitm-gold text-pesitm-blue text-xs font-semibold rounded-full mb-3">
                        {event.category}
                      </div>
                      <h3 className="text-xl font-bold text-pesitm-blue mb-3 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <Calendar size={16} className="text-pesitm-blue" />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin size={16} className="text-pesitm-blue" />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}

          {!loading && events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No upcoming events at the moment.</p>
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
