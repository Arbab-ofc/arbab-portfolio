import Experience from '../models/Experience.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

// @desc    Get all experiences
// @route   GET /api/experience
// @access  Public
export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find().sort('-startDate order');

    res.status(200).json({
      success: true,
      count: experiences.length,
      data: experiences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: error.message,
    });
  }
};

// @desc    Create experience
// @route   POST /api/experience
// @access  Private/Admin
export const createExperience = async (req, res) => {
  try {
    if (req.file) {
      const result = await uploadToCloudinary(req.file, 'portfolio/experience');
      req.body.logo = {
        url: result.url,
        publicId: result.publicId,
      };
    }

    const experience = await Experience.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating experience',
      error: error.message,
    });
  }
};

// @desc    Update experience
// @route   PUT /api/experience/:id
// @access  Private/Admin
export const updateExperience = async (req, res) => {
  try {
    let experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    if (req.file) {
      if (experience.logo?.publicId) {
        await deleteFromCloudinary(experience.logo.publicId);
      }

      const result = await uploadToCloudinary(req.file, 'portfolio/experience');
      req.body.logo = {
        url: result.url,
        publicId: result.publicId,
      };
    }

    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Experience updated successfully',
      data: experience,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating experience',
      error: error.message,
    });
  }
};

// @desc    Delete experience
// @route   DELETE /api/experience/:id
// @access  Private/Admin
export const deleteExperience = async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found',
      });
    }

    if (experience.logo?.publicId) {
      await deleteFromCloudinary(experience.logo.publicId);
    }

    await experience.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Experience deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting experience',
      error: error.message,
    });
  }
};
