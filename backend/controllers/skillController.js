import Skill from '../models/Skill.js';

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};

    const skills = await Skill.find(query)
      .populate('projects', 'title slug')
      .sort('order category');

    // Group by category
    const groupedSkills = skills.reduce((acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push(skill);
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: skills.length,
      data: groupedSkills,
      list: skills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching skills',
      error: error.message,
    });
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private/Admin
export const createSkill = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating skill',
      error: error.message,
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private/Admin
export const updateSkill = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Skill updated successfully',
      data: skill,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating skill',
      error: error.message,
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private/Admin
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
    }

    await skill.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Skill deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting skill',
      error: error.message,
    });
  }
};
