import Newsletter from '../models/Newsletter.js';
import GuestBook from '../models/GuestBook.js';
import Testimonial from '../models/Testimonial.js';
import Analytics from '../models/Analytics.js';

// ============= NEWSLETTER CONTROLLER =============

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email, name } = req.body;

    const existingSubscriber = await Newsletter.findOne({ email });
    if (existingSubscriber) {
      if (existingSubscriber.active) {
        return res.status(400).json({
          success: false,
          message: 'Email already subscribed',
        });
      } else {
        existingSubscriber.active = true;
        existingSubscriber.subscribedAt = Date.now();
        await existingSubscriber.save();
        return res.status(200).json({
          success: true,
          message: 'Subscription reactivated successfully',
        });
      }
    }

    const subscriber = await Newsletter.create({ email, name });

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: subscriber,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error subscribing to newsletter',
      error: error.message,
    });
  }
};

export const unsubscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const subscriber = await Newsletter.findOne({ email });
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found',
      });
    }

    subscriber.active = false;
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error unsubscribing from newsletter',
      error: error.message,
    });
  }
};

export const getNewsletterSubscribers = async (req, res) => {
  try {
    const { active = true } = req.query;
    const subscribers = await Newsletter.find({ active: active === 'true' }).sort('-subscribedAt');

    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching subscribers',
      error: error.message,
    });
  }
};

// ============= GUESTBOOK CONTROLLER =============

export const getGuestBookEntries = async (req, res) => {
  try {
    const { approved = true, featured } = req.query;
    const query = { approved: approved === 'true' };
    if (featured) query.featured = featured === 'true';

    const entries = await GuestBook.find(query).sort('-createdAt');

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching guestbook entries',
      error: error.message,
    });
  }
};

export const createGuestBookEntry = async (req, res) => {
  try {
    const entry = await GuestBook.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Thank you for signing the guestbook! Your entry is pending approval.',
      data: entry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating guestbook entry',
      error: error.message,
    });
  }
};

export const updateGuestBookEntry = async (req, res) => {
  try {
    const entry = await GuestBook.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Entry updated successfully',
      data: entry,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating entry',
      error: error.message,
    });
  }
};

export const deleteGuestBookEntry = async (req, res) => {
  try {
    const entry = await GuestBook.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found',
      });
    }

    await entry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Entry deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting entry',
      error: error.message,
    });
  }
};

// ============= TESTIMONIAL CONTROLLER =============

export const getTestimonials = async (req, res) => {
  try {
    const { approved = true, featured } = req.query;
    const query = { approved: approved === 'true' };
    if (featured) query.featured = featured === 'true';

    const testimonials = await Testimonial.find(query)
      .populate('projectId', 'title slug')
      .sort('order -createdAt');

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message,
    });
  }
};

export const createTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message,
    });
  }
};

export const updateTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message,
    });
  }
};

export const deleteTestimonial = async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found',
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting testimonial',
      error: error.message,
    });
  }
};

// ============= ANALYTICS CONTROLLER =============

export const trackVisit = async (req, res) => {
  try {
    const { sessionId, page, action } = req.body;

    let analytics = await Analytics.findOne({ sessionId });

    if (!analytics) {
      analytics = await Analytics.create({
        sessionId,
        ipAddress: req.ip,
        device: req.body.device,
        browser: req.body.browser,
        os: req.body.os,
        referrer: req.body.referrer,
        country: req.body.country,
        city: req.body.city,
      });
    }

    if (page) {
      analytics.pages.push({
        path: page.path,
        duration: page.duration,
      });
    }

    if (action) {
      analytics.actions.push({
        type: action.type,
        target: action.target,
      });
    }

    await analytics.save();

    res.status(200).json({
      success: true,
      message: 'Visit tracked successfully',
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error tracking visit',
      error: error.message,
    });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = {};
    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) query.timestamp.$gte = new Date(startDate);
      if (endDate) query.timestamp.$lte = new Date(endDate);
    }

    const totalVisits = await Analytics.countDocuments(query);
    const uniqueVisitors = await Analytics.distinct('sessionId', query).then(arr => arr.length);

    const deviceStats = await Analytics.aggregate([
      { $match: query },
      { $group: { _id: '$device', count: { $sum: 1 } } },
    ]);

    const countryStats = await Analytics.aggregate([
      { $match: query },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const topPages = await Analytics.aggregate([
      { $match: query },
      { $unwind: '$pages' },
      { $group: { _id: '$pages.path', views: { $sum: 1 }, avgDuration: { $avg: '$pages.duration' } } },
      { $sort: { views: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVisits,
        uniqueVisitors,
        deviceStats,
        countryStats,
        topPages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics',
      error: error.message,
    });
  }
};
