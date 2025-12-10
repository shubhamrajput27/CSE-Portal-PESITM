import News from '../models/News.js'

// Get all news for admin (published and drafts)
export const getAllNewsForAdmin = async (req, res) => {
  try {
    const { limit, offset, category } = req.query
    
    let news
    if (category) {
      news = await News.getByCategory(category)
    } else {
      news = await News.getAllForAdmin(limit ? parseInt(limit) : null, offset ? parseInt(offset) : 0)
    }
    
    res.status(200).json({
      success: true,
      data: news
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching news', 
      error: error.message 
    })
  }
}

// Get all news
export const getAllNews = async (req, res) => {
  try {
    const { limit, offset, category } = req.query
    
    let news
    if (category) {
      news = await News.getByCategory(category)
    } else {
      news = await News.getAll(limit ? parseInt(limit) : null, offset ? parseInt(offset) : 0)
    }
    
    res.status(200).json({
      success: true,
      data: news
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching news', 
      error: error.message 
    })
  }
}

// Get featured news
export const getFeaturedNews = async (req, res) => {
  try {
    const news = await News.getFeatured()
    res.status(200).json({
      success: true,
      data: news
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching featured news', 
      error: error.message 
    })
  }
}

// Get single news by ID
export const getNewsById = async (req, res) => {
  try {
    const news = await News.getById(req.params.id)
    if (!news) {
      return res.status(404).json({ 
        success: false, 
        message: 'News not found' 
      })
    }
    res.status(200).json({
      success: true,
      data: news
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching news', 
      error: error.message 
    })
  }
}

// Create new news (Protected - Admin only)
export const createNews = async (req, res) => {
  try {
    const newsData = {
      ...req.body,
      author_id: req.admin.id
    }
    
    const news = await News.create(newsData)
    res.status(201).json({ 
      success: true, 
      message: 'News created successfully', 
      data: news 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error creating news', 
      error: error.message 
    })
  }
}

// Update news (Protected - Admin only)
export const updateNews = async (req, res) => {
  try {
    const news = await News.update(req.params.id, req.body)
    if (!news) {
      return res.status(404).json({ 
        success: false, 
        message: 'News not found' 
      })
    }
    res.status(200).json({ 
      success: true, 
      message: 'News updated successfully', 
      data: news 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error updating news', 
      error: error.message 
    })
  }
}

// Delete news (Protected - Admin only)
export const deleteNews = async (req, res) => {
  try {
    const news = await News.delete(req.params.id)
    if (!news) {
      return res.status(404).json({ 
        success: false, 
        message: 'News not found' 
      })
    }
    res.status(200).json({ 
      success: true, 
      message: 'News deleted successfully' 
    })
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: 'Error deleting news', 
      error: error.message 
    })
  }
}

// Get all categories
export const getNewsCategories = async (req, res) => {
  try {
    const categories = await News.getCategories()
    res.status(200).json({
      success: true,
      data: categories
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching categories', 
      error: error.message 
    })
  }
}

// Search news
export const searchNews = async (req, res) => {
  try {
    const { q } = req.query
    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      })
    }
    
    const news = await News.search(q)
    res.status(200).json({
      success: true,
      data: news
    })
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error searching news', 
      error: error.message 
    })
  }
}