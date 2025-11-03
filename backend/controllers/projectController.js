import Project from '../models/Project.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const {
      category,
      projectType,
      featured,
      tags,
      limit = 10,
      page = 1,
      sort = '-createdAt',
      search,
    } = req.query;

    // Build query
    const query = {};

    if (category) query.category = category;
    if (projectType) query.projectType = projectType;
    if (featured) query.featured = featured === 'true';
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const projects = await Project.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Project.countDocuments(query);

    res.status(200).json({
      success: true,
      count: projects.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: error.message,
    });
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({ slug: req.params.slug });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Increment view count
    project.metrics.views += 1;
    await project.save();

    res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: error.message,
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res) => {
  try {
    // Images are already uploaded to Cloudinary and sent in req.body.images
    // No need to handle file uploads here since frontend handles Cloudinary directly

    const project = await Project.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating project',
      error: error.message,
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Images are already uploaded to Cloudinary and sent in req.body.images
    // No need to handle file uploads here since frontend handles Cloudinary directly

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating project',
      error: error.message,
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Delete images from Cloudinary
    if (project.images && project.images.length > 0) {
      for (const image of project.images) {
        if (image.publicId) {
          await deleteFromCloudinary(image.publicId);
        }
      }
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: error.message,
    });
  }
};

// @desc    Like a project
// @route   POST /api/projects/:id/like
// @access  Public
export const likeProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    project.metrics.likes += 1;
    await project.save();

    res.status(200).json({
      success: true,
      message: 'Project liked',
      likes: project.metrics.likes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error liking project',
      error: error.message,
    });
  }
};

// @desc    Get trending projects
// @route   GET /api/projects/trending
// @access  Public
export const getTrendingProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .sort('-metrics.views -metrics.likes')
      .limit(6);

    res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching trending projects',
      error: error.message,
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Public
export const getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const featuredProjects = await Project.countDocuments({ featured: true });
    const totalViews = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$metrics.views' } } },
    ]);
    const totalLikes = await Project.aggregate([
      { $group: { _id: null, total: { $sum: '$metrics.likes' } } },
    ]);

    const categoryStats = await Project.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalProjects,
        featuredProjects,
        totalViews: totalViews[0]?.total || 0,
        totalLikes: totalLikes[0]?.total || 0,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project statistics',
      error: error.message,
    });
  }
};
