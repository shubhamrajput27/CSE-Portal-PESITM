import { motion } from 'framer-motion'

/**
 * Reusable Dashboard Layout Component
 * 
 * @param {element} children - Main content
 * @param {string} title - Page title
 * @param {string} subtitle - Page subtitle
 * @param {element} headerActions - Action buttons in header
 * @param {string} bgGradient - Background gradient class
 */
const DashboardLayout = ({ 
  children, 
  title, 
  subtitle, 
  headerActions,
  bgGradient = 'from-blue-600 to-blue-800'
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${bgGradient} text-white`}>
        <div className="container-custom py-8">
          <div className="flex justify-between items-start">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-bold mb-2"
              >
                {title}
              </motion.h1>
              {subtitle && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-blue-100 text-lg"
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
            {headerActions && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {headerActions}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container-custom py-8">
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout
