import { Megaphone } from 'lucide-react'
import { useEffect, useState } from 'react'
import axios from 'axios'

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([
    "Latest Updates",
    "Counselling on 10th August 2025",
    "Join us for Open Day-8th November 2025",
    "NBA Accreditation received for 2024-2027",
    "New Industry Collaboration with leading Tech Companies"
  ])

  // Fetch banner notifications from API
  useEffect(() => {
    const fetchBannerNotifications = async () => {
      try {
        // Fetch all active notifications (same as admin panel sees)
        const response = await axios.get('http://localhost:5000/api/notifications')
        if (response.data.success && response.data.data.length > 0) {
          const bannerNotifications = response.data.data.map(notification => notification.title)
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
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 bg-red-700 rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-black whitespace-nowrap font-normal">
                    {announcement}
                  </span>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {announcements.map((announcement, index) => (
              <div key={`duplicate-${index}`} className="flex items-center gap-5 flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-3.5 h-3.5 bg-red-700 rounded-full flex-shrink-0"></div>
                  <span className="text-lg text-black whitespace-nowrap font-normal">
                    {announcement}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

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
