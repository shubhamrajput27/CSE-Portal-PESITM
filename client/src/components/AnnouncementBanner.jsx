import { Megaphone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "Latest Updates",
      description: "Stay updated with the latest happenings in our department. Visit our website regularly for new updates and announcements.",
      date: "Ongoing"
    },
    {
      id: 2,
      title: "Counselling on 10th August 2025",
      description: "Academic counselling session for all CSE students. Discuss your academic progress, course selection, and career guidance with faculty members. Time: 10:00 AM - 4:00 PM, Venue: Department Seminar Hall.",
      date: "August 10, 2025"
    },
    {
      id: 3,
      title: "Join us for Open Day-8th November 2025",
      description: "Experience our state-of-the-art facilities, meet our faculty, and explore the CSE department. Open for prospective students and parents. Includes lab tours, project demonstrations, and interaction with current students.",
      date: "November 8, 2025"
    },
    {
      id: 4,
      title: "NBA Accreditation received for 2024-2027",
      description: "We are proud to announce that our CSE program has been accredited by the National Board of Accreditation (NBA) for the period 2024-2027. This recognition validates our commitment to quality education and continuous improvement.",
      date: "January 2024"
    },
    {
      id: 5,
      title: "New Industry Collaboration with leading Tech Companies",
      description: "The CSE department has signed MoUs with leading technology companies for internships, guest lectures, and placement opportunities. This collaboration will provide students with hands-on industry experience and enhance their career prospects.",
      date: "December 2025"
    }
  ])
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null)

  // Fetch banner notifications from API
  useEffect(() => {
    const fetchBannerNotifications = async () => {
      try {
        // Fetch all active notifications (same as admin panel sees)
        const response = await axios.get('http://localhost:5000/api/notifications')
        if (response.data.success && response.data.data.length > 0) {
          const bannerNotifications = response.data.data.map((notification, index) => ({
            id: notification.id || index + 1,
            title: notification.title,
            description: notification.content || notification.description || 'No details available.',
            date: notification.date || new Date(notification.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || 'Recent'
          }))
          setAnnouncements(bannerNotifications)
        }
      } catch (error) {
        console.error('Error fetching banner notifications:', error)
        // Keep default announcements if API fails
      }
    }

    fetchBannerNotifications()
    
    // Poll for updates every 10 seconds for real-time updates
    const interval = setInterval(fetchBannerNotifications, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-white border-b border-gray-200 overflow-hidden">
      <div className="announcement-container flex items-center px-4 py-2 gap-5 max-w-7xl mx-auto">
        {/* Icon and Label */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="bg-pesitm-blue p-1.5 rounded">
            <Megaphone size={20} className="text-white" />
          </div>
          <span className="font-medium text-lg text-black whitespace-nowrap">
            ANNOUNCEMENT
          </span>
          <div className="w-px h-6 bg-black"></div>
        </div>

        {/* Scrolling Announcements */}
        <div className="flex-1 overflow-hidden relative">
          <div className="announcement-scroll flex items-center gap-5">
            {announcements.map((announcement, index) => (
              <div key={index} className="flex items-center gap-5 flex-shrink-0">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <div className="w-3.5 h-3.5 bg-red-700 rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-black whitespace-nowrap font-normal">
                    {announcement.title}
                  </span>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {announcements.map((announcement, index) => (
              <div key={`duplicate-${index}`} className="flex items-center gap-5 flex-shrink-0">
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setSelectedAnnouncement(announcement)}
                >
                  <div className="w-3.5 h-3.5 bg-red-700 rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-black whitespace-nowrap font-normal">
                    {announcement.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedAnnouncement && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAnnouncement(null)}
        >
          <div 
            className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-pesitm-blue text-white p-6 flex justify-between items-start rounded-t-lg">
              <div className="flex items-start gap-4 flex-1">
                <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                  <Megaphone size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-2">{selectedAnnouncement.title}</h2>
                  <p className="text-sm text-gray-100 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 bg-pesitm-gold rounded-full"></span>
                    {selectedAnnouncement.date}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedAnnouncement(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors ml-4"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="prose max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line">
                  {selectedAnnouncement.description}
                </p>
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="w-full bg-pesitm-blue hover:bg-opacity-90 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .announcement-scroll {
          animation: scroll 30s linear infinite;
        }

        .announcement-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default AnnouncementBanner
