# CSE Portal - PESITM Shivamogga 🎓

A complete web portal for the Computer Science & Engineering Department at PES Institute of Technology and Management, Shivamogga. This modern application helps students, faculty, and administrators stay connected with everything happening in the department.

## What's Inside? ✨

This portal brings together everything you need in one place:

- **Secure Login System** - Separate dashboards for admins, faculty, and students with role-based access
- **Attendance Tracking** - Faculty can mark attendance; students can view their attendance records
- **Marks Management** - Faculty can enter marks; students can check their academic progress
- **News & Events** - Stay updated with department announcements, events, and achievements
- **Faculty Profiles** - Browse faculty information, research interests, and contact details
- **Research Hub** - Explore ongoing research projects and publications
- **Student Resources** - Access study materials, notices, and academic information
- **Responsive Design** - Works beautifully on phones, tablets, and desktop computers

## Technology Stack 🛠️

**Frontend:**
- React 18 with Vite for fast development
- Tailwind CSS for beautiful, responsive design
- React Router for smooth navigation
- Lucide React for clean icons

**Backend:**
- Node.js with Express framework
- PostgreSQL database for reliable data storage
- JWT authentication for secure sessions
- bcrypt for password encryption

## Quick Start Guide 🚀

### What You Need

Make sure you have these installed:
- Node.js (version 18 or higher)
- PostgreSQL (version 12 or higher)
- Git

### Installation Steps

1. **Clone the repository:**
```bash
git clone https://github.com/shubhamrajput27/CSE-Portal-PESITM.git
cd CSE-Portal-PESITM
```

2. **Set up the backend:**
```bash
cd server
npm install
```

Create a `.env` file in the `server` folder with these details:
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cse_portal_pesitm
DB_USER=postgres
DB_PASSWORD=your_password_here

PORT=5000
JWT_SECRET=your_secret_key_here
```

3. **Initialize the database:**
```bash
node scripts/initPostgres.js
```

This creates all necessary tables and adds sample data to get you started.

4. **Set up the frontend:**
```bash
cd ../client
npm install
```

Create a `.env` file in the `client` folder:
```env
VITE_API_URL=http://localhost:5000
```

### Running the Application

You'll need two terminal windows:

**Terminal 1 - Start the backend:**
```bash
cd server
npm start
```

**Terminal 2 - Start the frontend:**
```bash
cd client
npm run dev
```

The application will open at `http://localhost:3003` (or whatever port Vite assigns).

## Test Login Credentials 🔑

Use these credentials to explore the portal:

**Admin Access:**
- Username: `admin`
- Password: `admin123`

**Faculty Access:**
- Faculty ID: `FAC001`
- Password: `faculty123`

**Student Access:**
- USN: `4PM23CS101`
- Password: `student123`

> **Important:** Change these passwords after your first login for security!

## Features by Role 👥

### Admin Dashboard
- Manage faculty profiles, events, and news
- View student and faculty data
- Control system settings and announcements
- Upload and manage research publications
- Handle placement records and achievements

### Faculty Dashboard
- View personal profile and schedule
- Mark student attendance
- Enter and update marks
- Post study materials and resources
- View mentee information
- Access department notifications

### Student Dashboard
- View attendance records across all subjects
- Check marks and academic performance
- Access study materials and notes
- View department news and events
- Check notices and announcements
- Browse placement opportunities

## Project Structure 📁

```
CSE-Portal-PESITM/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/           # Main page components
│   │   ├── context/         # React context for state management
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── server/                   # Backend Node.js application
│   ├── controllers/         # Business logic
│   ├── models/             # Database models
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── scripts/            # Database initialization scripts
│   └── package.json
│
└── README.md               # This file
```

## Common Issues & Solutions 🔧

**Can't connect to database?**
- Check if PostgreSQL is running
- Verify database name and credentials in `.env`
- Make sure you ran the initialization script

**Port already in use?**
- Change the PORT in `server/.env` to 5001 or another free port
- Kill the process using that port

**Login not working?**
- Verify JWT_SECRET is set in `.env`
- Check that you're using the correct credentials
- Make sure the database has been initialized

**Frontend can't reach backend?**
- Confirm backend server is running on port 5000
- Check VITE_API_URL in `client/.env` matches your backend URL

## Security Best Practices 🔒

- Never commit `.env` files to version control
- Change default passwords immediately after setup
- Use strong, random strings for JWT_SECRET
- Keep Node.js and dependencies up to date
- Use HTTPS in production environments
- Regularly backup your database

## Contributing 🤝

We welcome contributions! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/NewFeature`)
3. Make your changes and test thoroughly
4. Commit your changes (`git commit -m 'Add NewFeature'`)
5. Push to your branch (`git push origin feature/NewFeature`)
6. Open a Pull Request

## License 📄

This project is open source and available under the MIT License.

## Contact 📬

**CSE Department, PESITM Shivamogga**
- Email: cse@pestrust.edu.in
- Phone: +91-8182-235555
- Website: https://pestrust.edu.in/pesitm/
- Address: NH-206, Sagar Road, Shivamogga, Karnataka 577204

---

**Built with ❤️ for the PESITM CSE Community**
