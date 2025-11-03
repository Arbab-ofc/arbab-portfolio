# Arbab Portfolio - Backend API

Premium MERN Stack Portfolio Backend with comprehensive features including authentication, real-time chat, analytics, and more.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **RESTful API**: Complete CRUD operations for all resources
- **Real-time Features**: Socket.io for live chat and notifications
- **File Upload**: Cloudinary integration for image/file management
- **Email Service**: Nodemailer for contact forms and notifications
- **Security**: Helmet, rate limiting, input sanitization, XSS protection
- **Analytics**: Track visitor behavior and engagement
- **Caching**: Redis support for improved performance (optional)
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account
- Gmail account (for email service)

## 🛠️ Installation

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
   - Copy `.env.example` to `.env`
   - Update the values in `.env`:
     - MongoDB URI
     - JWT secrets
     - Cloudinary credentials
     - Email configuration
     - Admin credentials

3. **Seed the database** (optional):
```bash
node scripts/seedData.js
```

## 🏃 Running the Server

### Development mode:
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `GET /api/projects/trending` - Get trending projects
- `GET /api/projects/stats` - Get project statistics
- `GET /api/projects/:slug` - Get single project
- `POST /api/projects` - Create project (Admin)
- `PUT /api/projects/:id` - Update project (Admin)
- `DELETE /api/projects/:id` - Delete project (Admin)
- `POST /api/projects/:id/like` - Like a project

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/categories` - Get blog categories
- `GET /api/blogs/search` - Search blogs
- `GET /api/blogs/:slug` - Get single blog
- `POST /api/blogs` - Create blog (Admin)
- `PUT /api/blogs/:id` - Update blog (Admin)
- `DELETE /api/blogs/:id` - Delete blog (Admin)
- `POST /api/blogs/:id/like` - Like a blog
- `POST /api/blogs/:id/comments` - Add comment

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create skill (Admin)
- `PUT /api/skills/:id` - Update skill (Admin)
- `DELETE /api/skills/:id` - Delete skill (Admin)

### Experience
- `GET /api/experience` - Get all experiences
- `POST /api/experience` - Create experience (Admin)
- `PUT /api/experience/:id` - Update experience (Admin)
- `DELETE /api/experience/:id` - Delete experience (Admin)

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contacts (Admin)
- `GET /api/contact/:id` - Get single contact (Admin)
- `PUT /api/contact/:id` - Update contact (Admin)
- `DELETE /api/contact/:id` - Delete contact (Admin)

### Newsletter
- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `POST /api/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/newsletter` - Get subscribers (Admin)

### Guestbook
- `GET /api/guestbook` - Get guestbook entries
- `POST /api/guestbook` - Create entry
- `PUT /api/guestbook/:id` - Update entry (Admin)
- `DELETE /api/guestbook/:id` - Delete entry (Admin)

### Testimonials
- `GET /api/testimonials` - Get testimonials
- `POST /api/testimonials` - Create testimonial (Admin)
- `PUT /api/testimonials/:id` - Update testimonial (Admin)
- `DELETE /api/testimonials/:id` - Delete testimonial (Admin)

### Analytics
- `POST /api/analytics/track` - Track visitor activity
- `GET /api/analytics` - Get analytics data (Admin)

## 🔒 Security Features

- **Helmet**: Security headers
- **Rate Limiting**: Prevent abuse
- **Input Sanitization**: Prevent NoSQL injection
- **XSS Protection**: Clean user inputs
- **CORS**: Configured for frontend origin
- **JWT**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security

## 📁 Project Structure

```
backend/
├── config/           # Configuration files
│   ├── database.js
│   └── cloudinary.js
├── controllers/      # Route controllers
├── middleware/       # Custom middleware
├── models/          # Mongoose models
├── routes/          # API routes
├── scripts/         # Utility scripts
├── uploads/         # Temporary file uploads
├── .env             # Environment variables
├── .env.example     # Environment template
├── server.js        # Entry point
└── package.json
```

## 🌐 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRE=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Frontend
FRONTEND_URL=http://localhost:5173

# Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=secure_password
```

## 🚀 Deployment

### Render/Railway
1. Create new web service
2. Connect GitHub repository
3. Set environment variables
4. Deploy

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use strong JWT secrets
- Configure production MongoDB URI
- Set up production email service
- Configure CORS for production frontend URL

## 📝 Notes

- Default admin credentials are set in `.env`
- Change admin password after first login
- Email service requires Gmail app password
- Cloudinary is used for all file uploads
- Socket.io runs on the same port as Express

## 🤝 Contributing

This is a personal portfolio project. Feel free to fork and customize for your own use.

## 📄 License

MIT License - feel free to use this project for your own portfolio.

## 👤 Author

**Arbab Arshad**
- Email: arbabprvt@gmail.com
- GitHub: [@Arbab-ofc](https://github.com/Arbab-ofc)
- LinkedIn: [arbab-ofc](https://www.linkedin.com/in/arbab-ofc/)
