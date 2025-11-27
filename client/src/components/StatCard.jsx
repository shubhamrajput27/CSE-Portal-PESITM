import { motion } from 'framer-motion'

/**
 * Reusable Statistics Card Component
 * 
 * @param {string} title - Card title
 * @param {string|number} value - Main value to display
 * @param {element} icon - Icon component
 * @param {string} color - Background color class (e.g., 'bg-blue-500')
 * @param {string} trend - Optional trend indicator
 * @param {function} onClick - Optional click handler
 */
const StatCard = ({ 
  title, 
  value, 
  icon, 
  color = 'bg-blue-500', 
  trend, 
  onClick,
  className = ''
}) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onClick={onClick}
      className={`bg-white rounded-lg shadow-md p-6 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-500 text-sm font-medium mb-2">{title}</p>
          <h3 className="text-3xl font-bold text-gray-800 mb-1">{value}</h3>
          {trend && (
            <p className="text-xs text-gray-500 mt-2">{trend}</p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
