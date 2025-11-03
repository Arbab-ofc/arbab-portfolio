import Resume from '../models/Resume.js';
import { deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Upload a new resume
// @route   POST /api/resume/upload
// @access  Private/Admin
export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    const { title, description } = req.body;

    // Create new resume document
    const resume = new Resume({
      title: title || 'My Resume',
      description: description || '',
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
    });

    await resume.save();

    res.status(201).json({
      success: true,
      message: 'Resume uploaded successfully',
      data: resume,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading resume',
      error: error.message,
    });
  }
};

// @desc    Get all resumes
// @route   GET /api/resume
// @access  Private/Admin
export const getResumes = async (req, res) => {
  try {
    const { page = 1, limit = 10, active } = req.query;

    // Build query
    const query = {};
    if (active !== undefined) {
      query.isActive = active === 'true';
    }

    // Execute query with pagination
    const resumes = await Resume.find(query)
      .sort({ uploadedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Resume.countDocuments(query);

    res.status(200).json({
      success: true,
      count: resumes.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: resumes,
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resumes',
      error: error.message,
    });
  }
};

// @desc    Get single resume by ID
// @route   GET /api/resume/:id
// @access  Private/Admin
export const getResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching resume',
      error: error.message,
    });
  }
};

// @desc    Get active resume for public display
// @route   GET /api/resume/active
// @access  Public
export const getActiveResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ isActive: true }).sort({ uploadedAt: -1 });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'No active resume found',
      });
    }

    res.status(200).json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error fetching active resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching active resume',
      error: error.message,
    });
  }
};

// @desc    Update resume
// @route   PUT /api/resume/:id
// @access  Private/Admin
export const updateResume = async (req, res) => {
  try {
    const { title, description, isActive } = req.body;

    let resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Update fields
    if (title) resume.title = title;
    if (description !== undefined) resume.description = description;
    if (isActive !== undefined) resume.isActive = isActive;

    // If setting this resume as active, deactivate all others
    if (isActive === true) {
      await Resume.updateMany(
        { _id: { $ne: req.params.id } },
        { isActive: false }
      );
    }

    await resume.save();

    res.status(200).json({
      success: true,
      message: 'Resume updated successfully',
      data: resume,
    });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating resume',
      error: error.message,
    });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resume/:id
// @access  Private/Admin
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Delete file from Cloudinary
    try {
      await deleteFromCloudinary(resume.publicId);
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError);
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await resume.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting resume',
      error: error.message,
    });
  }
};

// @desc    Toggle resume active status
// @route   PATCH /api/resume/:id/toggle
// @access  Private/Admin
export const toggleResumeStatus = async (req, res) => {
  try {
    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found',
      });
    }

    // Toggle status
    resume.isActive = !resume.isActive;

    // If setting this resume as active, deactivate all others
    if (resume.isActive) {
      await Resume.updateMany(
        { _id: { $ne: req.params.id } },
        { isActive: false }
      );
    }

    await resume.save();

    res.status(200).json({
      success: true,
      message: `Resume ${resume.isActive ? 'activated' : 'deactivated'} successfully`,
      data: resume,
    });
  } catch (error) {
    console.error('Error toggling resume status:', error);
    res.status(500).json({
      success: false,
      message: 'Error toggling resume status',
      error: error.message,
    });
  }
};