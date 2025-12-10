# CSE Portal - Events & Notifications Setup Guide

## ✅ System Overview

Your CSE Portal is **already configured** to sync events and notifications from the admin dashboard to the home page and events page. Here's how it works:

### Database Tables
- **`events`** - Stores all events created by admin
- **`notifications`** - Stores notifications and banner announcements
- **`news`** - Stores news articles

### API Endpoints (Already Working)
- `GET /api/events` - Public endpoint to fetch all events
- `GET /api/events/featured` - Fetch featured events for home page
- `GET /api/notifications` - Public endpoint to fetch notifications
- `GET /api/notifications/banner` - Fetch banner notifications (scrolling announcements)
- `GET /api/news` - Public endpoint to fetch news articles

### Frontend Components (Already Integrated)
- **`AnnouncementBanner.jsx`** - Displays scrolling notifications from database (auto-refreshes every 10 seconds)
- **`NewsEventsSection.jsx`** - Shows latest events and news on home page
- **`Events.jsx`** - Events page displays all events from database

---

## 🚀 Setup Instructions

### 1. Database Setup

Make sure your PostgreSQL database is running and initialized:

```powershell
# Navigate to server directory
cd C:\users\prade\CSE-Portal-PESITM\server

# Initialize database (if not already done)
psql -U postgres -d pesitm_cse_portal -f database/postgresql_schema.sql
```

The schema will create:
- `events` table with sample events
- `notifications` table with sample notifications
- `news` table with sample news

### 2. Environment Variables

Create/update `.env` file in `server/` directory:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=pesitm_cse_portal
DB_PASSWORD=admin123
DB_PORT=5432

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (for admin authentication)
JWT_SECRET=your_secret_key_here
```

### 3. Install Dependencies & Start Server

```powershell
# Install server dependencies (if not done)
cd server
npm install

# Start the backend server
npm start
```

Server should start on `http://localhost:5000`

### 4. Start Frontend

Open a new terminal:

```powershell
# Install client dependencies (if not done)
cd client
npm install

# Start the frontend development server
npm run dev
```

Frontend should start on `http://localhost:5173`

---

## 📝 How to Add Events and Notifications from Admin

### Adding Events

**Admin Dashboard → Events Management**

When you create an event in the admin panel, set these fields:

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Event title | "AI Workshop 2025" |
| `description` | Event details | "Hands-on workshop on AI fundamentals" |
| `date` | Event date | 2025-12-15 |
| `venue` | Location | "CSE Lab 1" |
| `category` | Type of event | "workshop", "hackathon", "seminar" |
| `image_url` | Event image URL | URL to image (optional) |
| `status` | Event status | "upcoming", "ongoing", "completed" |
| `is_featured` | Show on home page | `true` or `false` |

**Important Fields:**
- Set `is_featured = true` to display event on home page
- Set `status = 'upcoming'` for active events
- Provide `image_url` for better visual display

### Adding Notifications/Announcements

**Admin Dashboard → Notifications Management**

| Field | Description | Example |
|-------|-------------|---------|
| `title` | Notification title | "Admission Open 2025" |
| `message` | Detailed message | "Applications now open..." |
| `type` | Notification type | "info", "event", "warning", "success" |
| `priority` | Importance | "high", "normal", "low" |
| `show_banner` | Show in scrolling banner | `true` or `false` |
| `is_active` | Activate notification | `true` or `false` |
| `expires_at` | Expiration date (optional) | 2025-12-31 |

**Important:**
- Set `show_banner = true` to display in the scrolling announcement banner on home page
- Set `is_active = true` to make notification visible
- Banner refreshes automatically every 10 seconds

---

## 🔄 Data Flow

```
┌─────────────────┐
│  Admin Panel    │
│  (Create Event  │
│  or Notification)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   PostgreSQL    │
│   Database      │
│ (events/        │
│  notifications) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Public APIs    │
│  /api/events    │
│  /api/notifications│
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Frontend Components            │
│  • AnnouncementBanner (auto-refresh)│
│  • NewsEventsSection            │
│  • Events Page                  │
└─────────────────────────────────┘
```

---

## 🧪 Testing the Flow

### Test 1: Add a Banner Notification

1. **Login to Admin Panel** (`/admin/login`)
2. **Go to Notifications Management**
3. **Create New Notification:**
   - Title: "Test Banner Notification"
   - Message: "This is a test scrolling banner"
   - show_banner: `true`
   - is_active: `true`
4. **Save and Visit Home Page**
5. **Expected Result:** Notification appears in scrolling banner within 10 seconds

### Test 2: Add a Featured Event

1. **Login to Admin Panel**
2. **Go to Events Management**
3. **Create New Event:**
   - Title: "Test Event"
   - Description: "This is a test event"
   - Date: Future date
   - Venue: "Main Hall"
   - Category: "workshop"
   - is_featured: `true`
   - status: "upcoming"
   - image_url: (any valid image URL or leave blank)
4. **Save and Visit:**
   - Home Page → Should appear in "News & Events" section
   - Events Page (`/events`) → Should appear in events grid

### Test 3: API Verification

Open browser console on home page and check:

```javascript
// Check if events are fetched
fetch('http://localhost:5000/api/events')
  .then(r => r.json())
  .then(console.log)

// Check if banner notifications are fetched
fetch('http://localhost:5000/api/notifications/banner')
  .then(r => r.json())
  .then(console.log)
```

---

## 🐛 Troubleshooting

### Issue: Home Page Shows Sample Data Instead of Database Data

**Cause:** Server not running or database empty

**Solution:**
1. Verify server is running: `http://localhost:5000/api/events` should return JSON
2. Check browser console for errors (F12 → Console)
3. Ensure PostgreSQL database is running
4. Run database initialization script

### Issue: Banner Not Showing My Notification

**Checklist:**
- [ ] Notification `show_banner = true`
- [ ] Notification `is_active = true`
- [ ] Notification `expires_at` is NULL or future date
- [ ] Server is running
- [ ] Wait 10 seconds for auto-refresh (or refresh page)

### Issue: Event Not Appearing on Home Page

**Checklist:**
- [ ] Event `is_featured = true`
- [ ] Event `status != 'deleted'`
- [ ] Server is running
- [ ] Refresh the page

### Issue: Database Connection Error

**Solution:**
1. Check PostgreSQL is running: `psql -U postgres`
2. Verify database exists: `\l` in psql
3. Check `.env` file has correct credentials
4. Restart server after changing `.env`

---

## 📊 Database Schema Reference

### Events Table
```sql
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    date TIMESTAMP,
    venue VARCHAR(200),
    category VARCHAR(50) DEFAULT 'workshop',
    organizer VARCHAR(200),
    image_url VARCHAR(500),
    attendees INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'upcoming',
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    author_id INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Notifications Table
```sql
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    priority VARCHAR(20) DEFAULT 'normal',
    is_active BOOLEAN DEFAULT TRUE,
    show_banner BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    author_id INTEGER REFERENCES admin_users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✨ Features

1. **Real-time Updates**: Banner notifications auto-refresh every 10 seconds
2. **Fallback Data**: If database is empty, displays sample data
3. **Featured Events**: Mark events as featured to show on home page
4. **Banner Control**: Control which notifications appear in scrolling banner
5. **Expiration**: Set expiration dates for notifications
6. **Authentication**: Only authenticated admins can create/edit events and notifications

---

## 🎯 Next Steps

1. ✅ Start both server and client
2. ✅ Verify database connection
3. ✅ Login to admin panel
4. ✅ Create test event with `is_featured = true`
5. ✅ Create test notification with `show_banner = true`
6. ✅ Visit home page to see updates
7. ✅ Check events page to see all events

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12) for error messages
2. Check server terminal for backend errors
3. Verify PostgreSQL is running and accessible
4. Ensure `.env` file is configured correctly

**Everything is already set up and working! Just start the servers and test it out.** 🚀
