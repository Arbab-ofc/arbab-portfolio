import Contact from '../models/Contact.js';
import nodemailer from 'nodemailer';

// Email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message, phone, company, budget, projectType, timeline } = req.body;

    // Get IP and user agent
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('user-agent');

    // Create contact
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      phone,
      company,
      budget,
      projectType,
      timeline,
      ipAddress,
      userAgent,
    });

    // Send email notification to admin
    try {
      const transporter = createTransporter();

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: process.env.ADMIN_EMAIL,
        subject: `New Contact Form Submission: ${subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
          <p><strong>Company:</strong> ${company || 'N/A'}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Project Type:</strong> ${projectType || 'N/A'}</p>
          <p><strong>Budget:</strong> ${budget || 'N/A'}</p>
          <p><strong>Timeline:</strong> ${timeline || 'N/A'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>Submitted at: ${new Date().toLocaleString()}</small></p>
        `,
      };

      await transporter.sendMail(mailOptions);

      // Send auto-reply to user
      const autoReplyOptions = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Thank you for contacting me!',
        html: `
          <h2>Hi ${name},</h2>
          <p>Thank you for reaching out! I've received your message and will get back to you as soon as possible.</p>
          <p>Here's a copy of your message:</p>
          <blockquote style="border-left: 3px solid #3b82f6; padding-left: 15px; color: #666;">
            ${message}
          </blockquote>
          <p>Best regards,<br>Arbab Arshad</p>
          <hr>
          <p style="color: #999; font-size: 12px;">This is an automated response. Please do not reply to this email.</p>
        `,
      };

      await transporter.sendMail(autoReplyOptions);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      // Continue even if email fails
    }

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error submitting contact form',
      error: error.message,
    });
  }
};

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
export const getContacts = async (req, res) => {
  try {
    const { status, priority, limit = 20, page = 1 } = req.query;

    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const contacts = await Contact.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Contact.countDocuments(query);

    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: contacts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts',
      error: error.message,
    });
  }
};

// @desc    Get single contact
// @route   GET /api/contact/:id
// @access  Private/Admin
export const getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    // Mark as read
    if (contact.status === 'new') {
      contact.status = 'read';
      await contact.save();
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact',
      error: error.message,
    });
  }
};

// @desc    Update contact status
// @route   PUT /api/contact/:id
// @access  Private/Admin
export const updateContact = async (req, res) => {
  try {
    const { status, priority, notes } = req.body;

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, priority, notes, repliedAt: status === 'replied' ? Date.now() : undefined },
      { new: true, runValidators: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact updated successfully',
      data: contact,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating contact',
      error: error.message,
    });
  }
};

// @desc    Delete contact
// @route   DELETE /api/contact/:id
// @access  Private/Admin
export const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found',
      });
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact',
      error: error.message,
    });
  }
};
