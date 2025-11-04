import Blog from '../models/Blog.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req, res) => {
  try {
    const {
      category,
      tags,
      featured,
      published = true,
      limit = 10,
      page = 1,
      sort = '-publishedAt',
      search,
    } = req.query;

    const query = { published: published === 'true' };

    if (category) query.category = category;
    if (featured) query.featured = featured === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message,
    });
  }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlog = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message,
    });
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
export const createBlog = async (req, res) => {
  try {
    // Handle cover image upload
    if (req.file) {
      console.log('Processing cover image upload:', {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      try {
        const result = await uploadToCloudinary(req.file, 'portfolio/blogs');
        req.body.coverImage = {
          url: result.url,
          publicId: result.publicId,
        };
        console.log('Cloudinary upload successful:', result.publicId);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        throw uploadError;
      }
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating blog',
      error: error.message,
    });
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
export const updateBlog = async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Handle new cover image
    if (req.file) {
      console.log('Processing new cover image upload:', {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      });

      // Delete old image if exists
      if (blog.coverImage?.publicId) {
        console.log('Deleting old cover image:', blog.coverImage.publicId);
        await deleteFromCloudinary(blog.coverImage.publicId);
      }

      try {
        const result = await uploadToCloudinary(req.file, 'portfolio/blogs');
        req.body.coverImage = {
          url: result.url,
          publicId: result.publicId,
        };
        console.log('Cloudinary upload successful:', result.publicId);
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        throw uploadError;
      }
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating blog',
      error: error.message,
    });
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    // Delete cover image from Cloudinary
    if (blog.coverImage?.publicId) {
      await deleteFromCloudinary(blog.coverImage.publicId);
    }

    await blog.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting blog',
      error: error.message,
    });
  }
};

// @desc    Like a blog
// @route   POST /api/blogs/:id/like
// @access  Public
export const likeBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    blog.likes += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog liked',
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking blog',
      error: error.message,
    });
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comments
// @access  Public
export const addComment = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found',
      });
    }

    const comment = {
      author: req.body.author,
      email: req.body.email,
      content: req.body.content,
      approved: false,
    };

    blog.comments.push(comment);
    await blog.save();

    res.status(201).json({
      success: true,
      message: 'Comment added successfully (pending approval)',
      data: comment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding comment',
      error: error.message,
    });
  }
};

// @desc    Get blog categories
// @route   GET /api/blogs/categories
// @access  Public
export const getCategories = async (req, res) => {
  try {
    const categories = await Blog.aggregate([
      { $match: { published: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// @desc    Search blogs
// @route   GET /api/blogs/search
// @access  Public
export const searchBlogs = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const blogs = await Blog.find({
      published: true,
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { excerpt: { $regex: q, $options: 'i' } },
        { content: { $regex: q, $options: 'i' } },
        { tags: { $regex: q, $options: 'i' } },
      ],
    }).limit(20);

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching blogs',
      error: error.message,
    });
  }
};

// @desc    Get all blogs for admin (published + unpublished)
// @route   GET /api/blogs/admin/all
// @access  Private/Admin
export const getAdminBlogs = async (req, res) => {
  try {
    const {
      limit = 50,
      page = 1,
      sort = '-createdAt',
      search,
      category,
      published,
    } = req.query;

    // Build query - NO default published filter for admin
    const query = {};

    // Optional filters for admin
    if (published !== undefined && published !== '') {
      query.published = published === 'true';
    }

    if (category) query.category = category;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Blog.countDocuments(query);

    res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching admin blogs',
      error: error.message,
    });
  }
};
