# 🎓 PESITM CSE Department Portal

Welcome to the official web portal for the Computer Science & Engineering Department at PES Institute of Technology and Management (PESITM), Shivamogga! 

This modern, dynamic portal serves as a central hub for students, faculty, and visitors to explore our department's activities, achievements, and resources.

## ✨ What Makes This Portal Special?

- **Beautiful & Responsive Design**: Works seamlessly on phones, tablets, and desktops with a mobile-first approach using Tailwind CSS
- **Multi-Level Authentication**: Separate login systems for Admins, Faculty, and Students with secure JWT-based authentication
- **Real-time Updates**: All content dynamically fetched from PostgreSQL database
- **Faculty Profiles**: Comprehensive faculty directory with specializations and contact information
- **Events & News Hub**: Stay updated with department events, workshops, hackathons, and announcements with auto-scrolling carousel
- **Research Showcase**: Discover ongoing research projects and innovative work by our faculty and students
- **Interactive Contact**: Easy-to-use contact form for queries and feedback
- **Smooth User Experience**: Engaging animations and intuitive navigation for better interaction

## 📁 Project Structure

```
pesitm-cse-website/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── assets/        # Images and static files
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js Backend
│   ├── routes/           # API routes
│   ├── models/           # Mongoose models
│   ├── controllers/      # Route controllers
│   └── server.js         # Express server
│
├── .env.example          # Environment variables template
└── README.md            # This file
```

## 🛠️ Tech Stack

### Frontend (Client-Side)
- **React 18**: Modern UI library for building interactive user interfaces
- **Vite**: Lightning-fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for beautiful, responsive designs
- **React Router**: Smooth client-side navigation and routing
- **Axios**: Promise-based HTTP client for API communication
- **Lucide React**: Beautiful, customizable icon library

### Backend (Server-Side)
- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Fast and minimalist web framework
- **PostgreSQL**: Powerful, open-source relational database for robust data management
- **bcrypt**: Secure password hashing for user authentication
- **JWT (jsonwebtoken)**: Secure token-based authentication system
- **Multer**: File upload handling for images and documents
- **CORS**: Cross-origin resource sharing for secure API access

## 📋 Prerequisites

Before diving in, make sure you have these installed on your computer:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn** package manager
- **PostgreSQL** (v12 or higher) - [Download here](https://www.postgresql.org/download/)
- **Git** - For version control [Download here](https://git-scm.com/)

## ⚙️ Installation & Setup

Let's get your portal up and running! Follow these simple steps:

### 1. Clone the Repository

```bash
git clone https://github.com/shubhamrajput27/CSE-Portal-PESITM.git
cd CSE-Portal-PESITM
```

### 2. Database Setup (PostgreSQL)

First, let's set up the database:

```bash
# Open PostgreSQL command line (psql)
psql -U postgres

# Create the database
CREATE DATABASE cse_portal_pesitm;

# Exit psql
\q
```

Now, initialize the database with our schema:

```bash
cd server
node scripts/initPostgres.js
```

This will create all necessary tables (admin_users, students, faculty_users, events, news, research, etc.) and add sample data.

### 3. Backend Setup

```bash
cd server
npm install

# Create .env file
cp .env.example .env
```

Edit `server/.env` with your PostgreSQL configuration:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cse_portal_pesitm
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (use a strong random string)
JWT_SECRET=your_super_secret_jwt_key_here

# Email Configuration (optional - for contact form)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=cse@pestrust.edu.in
```

**Important**: Replace `your_postgres_password` with your actual PostgreSQL password!

### 4. Frontend Setup

```bash
cd ../client
npm install
```

The frontend is already configured to connect to `http://localhost:5000` for API calls.

## 🚀 Running the Application

Time to bring your portal to life! You'll need two terminal windows:

### Development Mode (Recommended for testing)

**Terminal 1 - Start the Backend Server:**
```bash
cd server
npm start
```
✅ Server will run at `http://localhost:5000`

**Terminal 2 - Start the Frontend:**
```bash
cd client
npm run dev
```
✅ Frontend will run at `http://localhost:3000`

Now open your browser and visit `http://localhost:3000` - Your portal is live! 🎉

### Default Login Credentials

Once your portal is running, you can log in with these default accounts:

**Admin Login:**
- Username: `admin`
- Password: `admin123`
- Access: Full administrative control

**Student Login:**
- USN: `1PE21CS001`
- Password: `student123`
- Access: Student dashboard and features

**Faculty Login:**
- Faculty ID: `FAC001`
- Password: `faculty123`
- Access: Faculty dashboard and management

**⚠️ Important**: Change these default passwords in production!

### Production Build

**Frontend:**
```bash
cd client
npm run build
npm run preview
```

**Backend:**
```bash
cd server
npm start
```

## 📊 Database Structure

Our PostgreSQL database includes the following tables:

- **admin_users**: Admin login credentials and permissions
- **students**: Student information and authentication
- **faculty_users**: Faculty members' authentication data
- **faculty**: Faculty profiles with specializations and contact details
- **events**: Department events, workshops, and hackathons
- **news**: News articles and announcements
- **research**: Research projects and publications
- **sessions**: User session management for security
- **activity_log**: Track user activities and login history
- **contacts**: Contact form submissions

The `initPostgres.js` script automatically creates all tables and adds sample data to get you started!

## 🌐 API Endpoints

Our backend exposes these RESTful API endpoints:

### 🔐 Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/student/login` - Student login  
- `POST /api/faculty-auth/login` - Faculty login
- `POST /api/*/logout` - Logout (for respective user types)
- `GET /api/*/profile` - Get user profile (authenticated)

### 👨‍🏫 Faculty Management
- `GET /api/faculty` - Get all faculty members
- `GET /api/faculty/:id` - Get specific faculty details
- `POST /api/faculty` - Add new faculty (admin only)
- `PUT /api/faculty/:id` - Update faculty info (admin only)
- `DELETE /api/faculty/:id` - Remove faculty (admin only)

### 📅 Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events only
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create new event (admin only)
- `PUT /api/events/:id` - Update event (admin only)
- `DELETE /api/events/:id` - Delete event (admin only)

### 📰 News
- `GET /api/news` - Get all news articles
- `GET /api/news/:id` - Get specific news article
- `POST /api/news` - Publish news (admin only)
- `PUT /api/news/:id` - Update news (admin only)
- `DELETE /api/news/:id` - Delete news (admin only)

### 🔬 Research
- `GET /api/research` - Get all research projects
- `GET /api/research/:id` - Get research details
- `POST /api/research` - Add research (admin/faculty)
- `PUT /api/research/:id` - Update research
- `DELETE /api/research/:id` - Delete research

### 📧 Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all messages (admin only)
- `DELETE /api/contact/:id` - Delete message (admin only)

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy:
```bash
cd client
vercel
```

3. Update environment variables in Vercel dashboard

### Backend Deployment (Render)

1. Create account at [Render](https://render.com)
2. Create new Web Service
3. Connect your GitHub repository
4. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
5. Add environment variables in Render dashboard

### Alternative: Railway

1. Install Railway CLI:
```bash
npm install -g @railway/cli
```

2. Deploy:
```bash
cd server
railway login
railway init
railway up
```

## 🎨 Customization

### Colors
Edit `client/tailwind.config.js` to change the color scheme:

```javascript
colors: {
  pesitm: {
    blue: '#003366',    // Primary blue
    gold: '#FFB81C',    // Accent gold
  }
}
```

### Content
- Update faculty data in `Faculty` page
- Modify about text in `About` page
- Change contact details in `Contact` page and `Footer` component

## 📝 Environment Variables Reference

### Server (.env) - Backend Configuration
- `DB_HOST`: PostgreSQL server host (default: localhost)
- `DB_PORT`: PostgreSQL port (default: 5432)
- `DB_NAME`: Database name (cse_portal_pesitm)
- `DB_USER`: Database username (default: postgres)
- `DB_PASSWORD`: Your PostgreSQL password
- `PORT`: Server port (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation
- `NODE_ENV`: Environment (development/production)
- `EMAIL_USER`: Email for sending notifications (optional)
- `EMAIL_PASSWORD`: Email app password (optional)
- `ADMIN_EMAIL`: Admin email for contact forms (optional)

### Client - Frontend Configuration
The frontend is pre-configured to use `http://localhost:5000` for API calls during development.

## 🔒 Security Best Practices

We take security seriously! Here's what's implemented and what you should do:

✅ **Implemented:**
- Password hashing with bcrypt (12 salt rounds)
- JWT-based authentication for secure sessions
- SQL injection protection with parameterized queries
- Session management with activity logging
- Separate authentication for Admin, Faculty, and Students

⚠️ **Important Reminders:**
- **Never** commit `.env` files to Git (already in .gitignore)
- Change default passwords immediately in production
- Use strong JWT_SECRET (at least 32 random characters)
- Enable CORS only for trusted domains in production
- Always use HTTPS in production deployment
- Regularly update dependencies for security patches
- Implement rate limiting for login attempts in production

## 🐛 Troubleshooting

Running into issues? Here are common problems and their solutions:

### ❌ PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: 
- Make sure PostgreSQL service is running
- Windows: Check Services → PostgreSQL should be running
- Verify DB_PASSWORD in `.env` matches your PostgreSQL password

### ❌ Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: 
- Another application is using port 5000
- Change the PORT in `.env` to something else (e.g., 5001)
- Or kill the process: `netstat -ano | findstr :5000` then `taskkill /PID <pid> /F`

### ❌ Database Tables Not Found
```
Error: relation "students" does not exist
```
**Solution**: 
- Run the initialization script: `node server/scripts/initPostgres.js`
- This creates all necessary tables and sample data

### ❌ Login Not Working (401 Unauthorized)
**Solution**: 
- Check if passwords are hashed in the database
- Verify you're using the correct credentials (see Default Login Credentials section)
- Make sure JWT_SECRET is set in `.env`

### ❌ CORS Error in Browser
```
Access to fetch blocked by CORS policy
```
**Solution**: 
- Verify frontend is running on port 3000
- Check CORS settings in `server/server.js`
- Make sure backend is running on port 5000

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

We welcome contributions from the PESITM community! Here's how you can help:

1. **Fork** the repository to your GitHub account
2. **Create** your feature branch: `git checkout -b feature/AmazingFeature`
3. **Make** your changes and test thoroughly
4. **Commit** with a clear message: `git commit -m 'Add some AmazingFeature'`
5. **Push** to your branch: `git push origin feature/AmazingFeature`
6. **Open** a Pull Request with a description of your changes

### Contribution Ideas:
- 🎨 UI/UX improvements
- 🐛 Bug fixes
- 📝 Documentation updates
- ✨ New features (student portal, faculty dashboard, etc.)
- 🔒 Security enhancements
- ⚡ Performance optimizations

## 📄 License

This project is licensed under the MIT License.

## � Get in Touch

Have questions or suggestions? We'd love to hear from you!

**CSE Department, PESITM Shivamogga**
- 📧 Email: cse@pestrust.edu.in
- ☎️ Phone: +91-8182-235555
- 🌐 Website: [https://pestrust.edu.in/pesitm/](https://pestrust.edu.in/pesitm/)
- 📍 Address: NH-206, Sagar Road, Shivamogga - 577204, Karnataka, India

## 🙏 Acknowledgments

This portal was developed with support from:
- **PES Institute of Technology and Management, Shivamogga** - For providing the opportunity and resources
- **VTU, Belagavi** - Our esteemed affiliating university
- **Faculty Members** - For their valuable guidance and feedback
- **Students** - For testing and suggestions to improve the portal
- **Open Source Community** - For the amazing tools and libraries used in this project

## 📜 License

This project is licensed under the MIT License - feel free to use it for educational purposes.

---

<div align="center">

**Made with ❤️ by the CSE Department, PESITM**

*Empowering minds, Building futures* 🚀

</div>
