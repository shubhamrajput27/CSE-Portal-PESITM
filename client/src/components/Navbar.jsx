import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSticky, setIsSticky] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      // Make navbar sticky after scrolling past 100px (height of header)
      setIsSticky(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Faculty', path: '/faculty' },
    { name: 'Research & Labs', path: '/research' },
    { name: 'Events', path: '/events' },
    { name: 'Achievements', path: '/achievements' },
    { name: 'Contact', path: '/contact' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Header Section Above Navbar - Scrolls normally */}
      <div className="bg-white border-b">
        <div className="w-full py-2">
          <a 
            href="https://pestrust.edu.in/pesitm/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block hover:opacity-90 transition-opacity"
          >
            <img 
              src="/PESITM.jpg" 
              alt="PES Institute of Technology & Management" 
              className="w-full h-20 object-contain"
            />
          </a>
        </div>
      </div>

      {/* Navigation Bar - Becomes sticky when scrolling */}
      <nav className={`bg-pesitm-blue text-white border-b transition-all duration-300 ${
        isSticky ? 'fixed top-0 left-0 right-0 shadow-lg z-50' : 'relative z-40'
      }`}>
        <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center bg-white px-6 py-2 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300">
            <img src="/Navbar.jpg" alt="PESITM - Education for the real world" className="h-14 w-auto object-contain" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 text-sm font-bold transition-all duration-300 relative group ${
                  isActive(link.path) ? 'text-red-500' : 'text-white hover:text-red-500'
                }`}
              >
                {link.name}
                {/* Underline effect - red when active or on hover */}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-red-500 transform transition-all duration-300 ${
                  isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </Link>
            ))}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:block">
            <Link
              to="/login"
              className="flex items-center space-x-2 px-4 py-2 bg-white text-pesitm-blue rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 font-bold shadow-md hover:shadow-lg"
            >
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md hover:bg-white/10"
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Slide-in Drawer */}
      <div 
        className={`md:hidden fixed inset-y-0 right-0 transform transition-transform duration-300 ease-in-out bg-pesitm-blue w-64 shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } z-50`}
      >
        <div className="flex flex-col h-full">
          {/* Close button */}
          <div className="flex justify-between items-center p-4 border-b border-white/20">
            <span className="text-lg font-bold text-white">Menu</span>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-md hover:bg-white/10"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 py-4 space-y-2 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg text-base font-bold transition-all duration-300 transform ${
                  isActive(link.path)
                    ? 'bg-white/20 text-red-500 border-l-4 border-red-500 scale-105'
                    : 'text-white hover:bg-white/15 hover:text-red-500 hover:translate-x-2 hover:border-l-4 hover:border-red-500 hover:shadow-lg'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Login Button */}
            <div className="pt-4 mt-4 border-t border-white/20">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 rounded-lg text-white bg-white/10 hover:bg-white/20 transition-all duration-300 font-bold text-center"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </nav>

    {/* Spacer to prevent content jump when navbar becomes fixed */}
    {isSticky && <div className="h-20" />}
    </>
  )
}

export default Navbar
