import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Blog from '../models/Blog.js';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
    
    if (!adminExists) {
      await User.create({
        name: 'Arbab Arshad',
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: 'admin',
        bio: 'Full-Stack MERN Developer & Data Analyst',
      });
      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️  Admin user already exists');
    }
  } catch (error) {
    console.error('❌ Error creating admin:', error);
  }
};

const seedSkills = async () => {
  try {
    const skillsCount = await Skill.countDocuments();
    
    if (skillsCount === 0) {
      const skills = [
        // Frontend
        { name: 'React', category: 'Frontend', proficiency: 90, experience: '2 years', icon: 'react', order: 1 },
        { name: 'Next.js', category: 'Frontend', proficiency: 85, experience: '1.5 years', icon: 'nextjs', order: 2 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 90, experience: '2 years', icon: 'tailwind', order: 3 },
        { name: 'JavaScript', category: 'Frontend', proficiency: 90, experience: '3 years', icon: 'javascript', order: 4 },
        { name: 'TypeScript', category: 'Frontend', proficiency: 80, experience: '1 year', icon: 'typescript', order: 5 },
        
        // Backend
        { name: 'Node.js', category: 'Backend', proficiency: 88, experience: '2 years', icon: 'nodejs', order: 6 },
        { name: 'Express.js', category: 'Backend', proficiency: 90, experience: '2 years', icon: 'express', order: 7 },
        { name: 'REST APIs', category: 'Backend', proficiency: 90, experience: '2 years', icon: 'api', order: 8 },
        { name: 'JWT', category: 'Backend', proficiency: 85, experience: '2 years', icon: 'jwt', order: 9 },
        
        // Database
        { name: 'MongoDB', category: 'Database', proficiency: 88, experience: '2 years', icon: 'mongodb', order: 10 },
        { name: 'Mongoose', category: 'Database', proficiency: 90, experience: '2 years', icon: 'mongoose', order: 11 },
        { name: 'SQL', category: 'Database', proficiency: 75, experience: '1 year', icon: 'sql', order: 12 },
        
        // Data Analytics
        { name: 'Python', category: 'Data Analytics', proficiency: 85, experience: '2 years', icon: 'python', order: 13 },
        { name: 'Pandas', category: 'Data Analytics', proficiency: 80, experience: '1.5 years', icon: 'pandas', order: 14 },
        { name: 'NumPy', category: 'Data Analytics', proficiency: 80, experience: '1.5 years', icon: 'numpy', order: 15 },
        { name: 'Matplotlib', category: 'Data Analytics', proficiency: 75, experience: '1 year', icon: 'matplotlib', order: 16 },
        
        // Tools
        { name: 'Git/GitHub', category: 'Tools', proficiency: 90, experience: '3 years', icon: 'git', order: 17 },
        { name: 'Postman', category: 'Tools', proficiency: 85, experience: '2 years', icon: 'postman', order: 18 },
        { name: 'VS Code', category: 'Tools', proficiency: 95, experience: '3 years', icon: 'vscode', order: 19 },
      ];
      
      await Skill.insertMany(skills);
      console.log('✅ Skills seeded');
    } else {
      console.log('ℹ️  Skills already exist');
    }
  } catch (error) {
    console.error('❌ Error seeding skills:', error);
  }
};

const seedExperience = async () => {
  try {
    const expCount = await Experience.countDocuments();
    
    if (expCount === 0) {
      const experiences = [
        {
          company: 'Unified Mentor',
          position: 'Full Stack Web Developer Intern',
          location: 'Remote',
          type: 'Internship',
          startDate: new Date('2024-10-01'),
          endDate: new Date('2025-01-01'),
          current: false,
          description: 'Developed multiple full-stack web applications using MERN stack',
          responsibilities: [
            'Built secure document sharing system with role-based access',
            'Created student-teacher appointment booking portal',
            'Developed catering reservation and ordering system',
            'Implemented hospital operations scheduler',
          ],
          achievements: [
            'Successfully delivered 4 projects within timeline',
            'Implemented secure authentication and authorization',
            'Optimized database queries for better performance',
          ],
          technologies: ['React', 'Node.js', 'Express.js', 'MongoDB', 'JWT'],
          order: 1,
        },
        {
          company: 'CodSoft',
          position: 'Web Developer Intern',
          location: 'Remote',
          type: 'Internship',
          startDate: new Date('2024-09-25'),
          endDate: new Date('2024-10-25'),
          current: false,
          description: 'Developed web applications focusing on project management and e-commerce',
          responsibilities: [
            'Built project management website with task tracking',
            'Developed e-commerce platform with cart and checkout',
            'Implemented responsive UI designs',
          ],
          achievements: [
            'Completed projects ahead of schedule',
            'Received positive feedback from mentors',
          ],
          technologies: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'],
          order: 2,
        },
        {
          company: 'Veridia.io',
          position: 'SDE Intern',
          location: 'Remote/India',
          type: 'Internship',
          startDate: new Date('2024-07-03'),
          endDate: new Date('2024-10-08'),
          current: false,
          description: 'Developed secure voting platform and attendance tracking system',
          responsibilities: [
            'Built VoteVerse online voting platform',
            'Created AttendX attendance tracking system',
            'Implemented security features and data integrity',
          ],
          achievements: [
            'Ensured one-vote-per-voter-per-election integrity',
            'Implemented automatic consistency calculation',
            'Enhanced user security protocols',
          ],
          technologies: ['React', 'Node.js', 'MongoDB', 'JWT', 'bcrypt'],
          order: 3,
        },
      ];
      
      await Experience.insertMany(experiences);
      console.log('✅ Experience seeded');
    } else {
      console.log('ℹ️  Experience already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding experience:', error);
  }
};

const seedProjects = async () => {
  try {
    const projectCount = await Project.countDocuments();
    
    if (projectCount === 0) {
      const projects = [
        {
          title: 'PlanMint',
          slug: 'planmint',
          shortDescription: 'MERN stack project platform for small teams with role-based access control',
          longDescription: 'Clean, fast project platform with opinionated guardrails where owners/admins control membership and project status while members focus on assigned work.',
          category: 'SaaS',
          projectType: 'Full Stack',
          technologies: {
            frontend: ['React', 'React Router', 'React Icons'],
            backend: ['Node.js', 'Express.js'],
            database: ['MongoDB'],
            tools: ['JWT', 'bcrypt.js'],
          },
          links: {
            live: 'https://planmint.vercel.app',
            github: 'https://github.com/Arbab-ofc/PlanMint',
          },
          featured: true,
          tags: ['MERN', 'Project Management', 'Team Collaboration'],
          features: [
            'Role-based access control',
            'Project status management',
            'Task assignment system',
            'Clean and intuitive UI',
          ],
          status: 'completed',
          priority: 1,
        },
        {
          title: 'VoteVerse',
          slug: 'voteverse',
          shortDescription: 'Secure, modern online voting platform with OTP verification',
          longDescription: 'User registration, OTP verification via email, election participation, and one-vote-per-election enforcement with responsive UI.',
          category: 'SaaS',
          projectType: 'Full Stack',
          technologies: {
            frontend: ['React.js', 'Tailwind CSS', 'React Router DOM', 'React Toastify', 'Axios'],
            backend: ['Node.js', 'Express.js', 'Nodemailer'],
            database: ['MongoDB', 'Mongoose'],
            tools: ['JWT', 'bcrypt'],
          },
          links: {
            live: 'https://voteverse.vercel.app',
            github: 'https://github.com/Arbab-ofc/VoteVerse',
          },
          featured: true,
          tags: ['MERN', 'Voting System', 'Security', 'OTP'],
          features: [
            'OTP-based email verification',
            'One-vote-per-election enforcement',
            'Secure authentication',
            'Real-time vote counting',
          ],
          status: 'completed',
          priority: 2,
        },
        {
          title: 'EcoBloom',
          slug: 'ecobloom',
          shortDescription: 'Full-stack e-commerce platform for plants',
          longDescription: 'Browse and purchase plants with cart/checkout functionality and admin dashboard for plant & order management.',
          category: 'E-commerce',
          projectType: 'Full Stack',
          technologies: {
            frontend: ['React'],
            backend: ['Node.js', 'Express.js'],
            database: ['MongoDB'],
            devops: ['Cloudinary', 'Vercel', 'Render'],
          },
          links: {
            live: 'https://ecobloom.vercel.app',
            github: 'https://github.com/Arbab-ofc/EcoBloom',
          },
          featured: true,
          tags: ['MERN', 'E-commerce', 'Plants', 'Shopping Cart'],
          features: [
            'Product browsing and filtering',
            'Shopping cart functionality',
            'Secure checkout process',
            'Admin dashboard',
            'Order management',
          ],
          status: 'completed',
          priority: 3,
        },
      ];
      
      await Project.insertMany(projects);
      console.log('✅ Projects seeded');
    } else {
      console.log('ℹ️  Projects already exist');
    }
  } catch (error) {
    console.error('❌ Error seeding projects:', error);
  }
};

const seedAll = async () => {
  await connectDB();
  
  console.log('\n🌱 Starting database seeding...\n');
  
  await seedAdmin();
  await seedSkills();
  await seedExperience();
  await seedProjects();
  
  console.log('\n✅ Database seeding completed!\n');
  process.exit(0);
};

seedAll();
