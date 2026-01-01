import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  Users, 
  Calendar, 
  Bell, 
  LogOut, 
  FileText,
  BookOpen,
  Award,
  BarChart3
} from 'lucide-react'
import { motion } from 'framer-motion'
import AnimatedSection from '../components/AnimatedSection'
import FacultyManagement from '../components/FacultyManagement'
import EventsManagement from '../components/EventsManagement'
import NewsManagement from '../components/NewsManagement'
import NotificationManagement from '../components/NotificationManagement'
import { useAuth } from '../context/AuthContext'
import { ROLES } from '../utils/authUtils'

const AdminDashboard = () => {
  const { adminUser, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

  const handleLogout = () => {
    logout(ROLES.ADMIN)
  }

  const dashboardCards = [
    {
      title: 'Faculty Management',
      icon: <Users size={24} />,
      description: 'Add, edit, or remove faculty members',
      color: 'bg-blue-500',
      hoverColor: 'hover:bg-blue-600',
      tab: 'faculty'
    },
    {
      title: 'Events Management',
      icon: <Calendar size={24} />,
      description: 'Manage events, workshops, and seminars',
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-600',
      tab: 'events'
    },
    {
      title: 'News Management',
      icon: <FileText size={24} />,
      description: 'Post and manage news articles',
      color: 'bg-purple-500',
      hoverColor: 'hover:bg-purple-600',
      tab: 'news'
    },
    {
      title: 'Notifications',
      icon: <Bell size={24} />,
      description: 'Send announcements and notifications',
      color: 'bg-orange-500',
      hoverColor: 'hover:bg-orange-600',
      tab: 'notifications'
    },
    {
      title: 'Research Management',
      icon: <BookOpen size={24} />,
      description: 'Manage research projects and publications',
      color: 'bg-indigo-500',
      hoverColor: 'hover:bg-indigo-600',
      tab: 'research'
    },
    {
      title: 'Achievements',
      icon: <Award size={24} />,
      description: 'Add department achievements',
      color: 'bg-pink-500',
      hoverColor: 'hover:bg-pink-600',
      tab: 'achievements'
    }
  ]

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pesitm-blue"></div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-pesitm-blue">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {adminUser?.full_name}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{adminUser?.full_name}</p>
                <p className="text-xs text-gray-500 capitalize">{adminUser?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'border-pesitm-blue text-pesitm-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <BarChart3 size={16} className="inline mr-2" />
              Overview
            </button>
            {dashboardCards.map((card) => (
              <button
                key={card.tab}
                onClick={() => setActiveTab(card.tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === card.tab
                    ? 'border-pesitm-blue text-pesitm-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {card.icon}
                <span className="ml-2">{card.title.replace(' Management', '')}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dashboardCards.map((card, index) => (
                <motion.div
                  key={card.tab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setActiveTab(card.tab)}
                  className={`${card.color} ${card.hoverColor} text-white p-6 rounded-xl shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105`}
                >
                  <div className="flex items-center justify-between mb-4">
                    {card.icon}
                    <div className="text-right">
                      <div className="text-2xl font-bold">•</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.description}</p>
                  <div className="mt-4 flex justify-end">
                    <div className="bg-white/20 p-2 rounded-full">
                      <Plus size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Total Faculty</p>
                    <p className="text-2xl font-bold text-gray-900">24</p>
                  </div>
                  <Users className="text-blue-500" size={24} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Active Events</p>
                    <p className="text-2xl font-bold text-gray-900">8</p>
                  </div>
                  <Calendar className="text-green-500" size={24} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">News Articles</p>
                    <p className="text-2xl font-bold text-gray-900">15</p>
                  </div>
                  <FileText className="text-purple-500" size={24} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-500 text-sm">Notifications</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                  <Bell className="text-orange-500" size={24} />
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Faculty Management Tab */}
        {activeTab === 'faculty' && <FacultyManagement />}

        {/* Events Management Tab */}
        {activeTab === 'events' && <EventsManagement />}

        {/* News Management Tab */}
        {activeTab === 'news' && <NewsManagement />}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && <NotificationManagement />}

        {/* Research Management Tab */}
        {activeTab === 'research' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Research Management</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Research</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Research management interface will be implemented here</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-400">Features:</p>
                  <ul className="text-sm text-gray-500">
                    <li>• Add research projects</li>
                    <li>• Manage publications</li>
                    <li>• Track research progress</li>
                    <li>• Associate faculty with research</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Achievements Management</h2>
              <button className="btn-primary flex items-center space-x-2">
                <Plus size={20} />
                <span>Add Achievement</span>
              </button>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="text-center py-12">
                <Award size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">Achievements management interface will be implemented here</p>
                <div className="mt-4 space-y-2">
                  <p className="text-sm text-gray-400">Features:</p>
                  <ul className="text-sm text-gray-500">
                    <li>• Add department achievements</li>
                    <li>• Student accomplishments</li>
                    <li>• Faculty awards and recognition</li>
                    <li>• Competition results</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard