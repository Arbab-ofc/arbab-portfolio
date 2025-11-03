import Quote from '../models/Quote.js';

// @desc    Get all quotes
// @route   GET /api/quotes
// @access  Public
export const getQuotes = async (req, res) => {
  try {
    const {
      category,
      featured,
      tags,
      limit = 50,
      page = 1,
      sort = 'priority',
      search,
      active,
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    // Always filter by active status unless explicitly set to false
    if (active !== undefined) {
      query.active = active === 'true';
    } else {
      query.active = true;
    }
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const quotes = await Quote.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Quote.countDocuments(query);

    res.status(200).json({
      success: true,
      count: quotes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: quotes,
    });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quotes',
      error: error.message,
    });
  }
};

// @desc    Get single quote by ID
// @route   GET /api/quotes/:id
// @access  Public
export const getQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    res.status(200).json({
      success: true,
      data: quote,
    });
  } catch (error) {
    console.error('Error fetching quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quote',
      error: error.message,
    });
  }
};

// @desc    Create new quote
// @route   POST /api/quotes
// @access  Private/Admin
export const createQuote = async (req, res) => {
  try {
    const quote = await Quote.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quote created successfully',
      data: quote,
    });
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating quote',
      error: error.message,
    });
  }
};

// @desc    Update quote
// @route   PUT /api/quotes/:id
// @access  Private/Admin
export const updateQuote = async (req, res) => {
  try {
    let quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    quote = await Quote.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Quote updated successfully',
      data: quote,
    });
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating quote',
      error: error.message,
    });
  }
};

// @desc    Delete quote
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
export const deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);

    if (!quote) {
      return res.status(404).json({
        success: false,
        message: 'Quote not found',
      });
    }

    await quote.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Quote deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting quote',
      error: error.message,
    });
  }
};

// @desc    Get featured quotes
// @route   GET /api/quotes/featured
// @access  Public
export const getFeaturedQuotes = async (req, res) => {
  try {
    const {
      limit = 10,
      category,
    } = req.query;

    const query = { featured: true, active: true };
    if (category) query.category = category;

    const quotes = await Quote.find(query)
      .sort('priority')
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes,
    });
  } catch (error) {
    console.error('Error fetching featured quotes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured quotes',
      error: error.message,
    });
  }
};

// @desc    Get quote statistics
// @route   GET /api/quotes/stats
// @access  Public
export const getQuoteStats = async (req, res) => {
  try {
    const stats = await Quote.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const totalQuotes = await Quote.countDocuments({ active: true });
    const featuredQuotes = await Quote.countDocuments({ featured: true, active: true });

    res.status(200).json({
      success: true,
      data: {
        total: totalQuotes,
        featured: featuredQuotes,
        byCategory: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching quote stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quote statistics',
      error: error.message,
    });
  }
};