import { useState, useEffect, useRef } from 'react';
import { Search, X, User, Mail, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const StudentSearch = ({ onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [filters, setFilters] = useState({
    semester: 'all',
    section: 'all'
  });
  const searchRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        performSearch();
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  const performSearch = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('facultyToken') || localStorage.getItem('adminToken');
      
      const params = new URLSearchParams({
        search: searchTerm,
        ...(filters.semester !== 'all' && { semester: filters.semester }),
        ...(filters.section !== 'all' && { section: filters.section })
      });

      const response = await axios.get(
        `/api/students/search?${params}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setResults(response.data.data);
        setShowResults(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (student) => {
    if (onSelect) {
      onSelect(student);
    }
    setSearchTerm('');
    setShowResults(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20} />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search by name, USN, email..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          )}
          {loading && (
            <div className="absolute inset-y-0 right-10 flex items-center pr-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <select
            value={filters.semester}
            onChange={(e) => setFilters({ ...filters, semester: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Semesters</option>
            {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
              <option key={sem} value={sem}>Sem {sem}</option>
            ))}
          </select>

          <select
            value={filters.section}
            onChange={(e) => setFilters({ ...filters, section: e.target.value })}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Sections</option>
            {['A', 'B', 'C', 'D'].map(sec => (
              <option key={sec} value={sec}>Section {sec}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Results Dropdown */}
      <AnimatePresence>
        {showResults && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-96 overflow-y-auto"
          >
            <div className="p-2">
              <div className="px-3 py-2 text-sm text-gray-500 font-medium border-b">
                Found {results.length} student{results.length !== 1 ? 's' : ''}
              </div>
              {results.map((student) => (
                <motion.div
                  key={student.id}
                  whileHover={{ backgroundColor: '#f3f4f6' }}
                  onClick={() => handleSelect(student)}
                  className="p-3 cursor-pointer rounded-lg transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold flex-shrink-0">
                      {student.name?.charAt(0) || 'S'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {student.name}
                        </h4>
                        <div className="flex gap-1">
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                            Sem {student.semester}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                            Sec {student.section}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{student.usn}</p>
                      {student.email && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Mail size={12} />
                          <span className="truncate">{student.email}</span>
                        </div>
                      )}
                      {student.phone && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Phone size={12} />
                          <span>{student.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      {showResults && results.length === 0 && !loading && searchTerm.length >= 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-8 text-center"
        >
          <User className="mx-auto text-gray-300 mb-2" size={48} />
          <p className="text-gray-500">No students found</p>
          <p className="text-sm text-gray-400 mt-1">Try different search terms or filters</p>
        </motion.div>
      )}
    </div>
  );
};

export default StudentSearch;
