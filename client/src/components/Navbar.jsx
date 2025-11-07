import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ChevronDown } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

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
      {/* Header Section Above Navbar */}
      <div className="bg-white border-b sticky top-0 z-50">
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

      {/* Navigation Bar */}
      <nav className="bg-pesitm-blue text-white border-b sticky top-20 z-40">
        <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center space-x-3">
            <img src="/Navbar.jpg" alt="PESITM - Education for the real world" className="h-16 object-contain" />
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

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-pesitm-blue border-t border-white/20">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'border-l-4 border-white text-white bg-white/10'
                    : 'text-white hover:text-red-500 hover:bg-white/10 hover:translate-x-2'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
    </>
  )
}

export default Navbar
