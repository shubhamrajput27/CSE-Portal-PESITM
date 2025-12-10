# CSE Portal Database Schema

## Overview
This directory contains the database schema files for the PESITM CSE Portal application.

## Master Schema File
**`postgresql_schema.sql`** - This is the primary and only database schema file you need.

This file contains:
- Admin users and authentication management
- Student login system
- Faculty member login system
- News/Announcements management
- Notifications system
- Events management
- Faculty profiles
- Research projects
- All necessary indexes and triggers
- Default data for admin users, students, and faculty

## Usage

### Initial Setup
1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE pesitm_cse_portal;
   ```

2. Connect to the database and run the schema:
   ```bash
   psql -U postgres -d pesitm_cse_portal -f postgresql_schema.sql
   ```

3. Or through the Node.js initialization script:
   ```bash
   npm run init-db
   ```

### Database Structure

#### Core Tables
- **admin_users** - Administrative users with role-based access control
- **admin_sessions** - JWT token management for admin authentication
- **admin_activity_log** - Audit trail for admin actions

#### Student Management
- **students** - Student login credentials and profiles
- **student_sessions** - Student session tokens
- **student_activity_log** - Student activity tracking

#### Faculty Management
- **faculty_users** - Faculty login credentials
- **faculty_sessions** - Faculty session tokens
- **faculty_activity_log** - Faculty activity tracking
- **faculty** - Faculty profile information

#### Content Management
- **news** - News articles with publishing workflow
- **notifications** - System notifications and announcements
- **events** - Events management with image support
- **research** - Research projects and publications

#### Features Included
- ✅ Image URL fields for news, events, faculty, and research
- ✅ Published/Draft status for news and events
- ✅ Featured content functionality
- ✅ Display order for sorting
- ✅ Timestamps (created_at, updated_at, published_at)
- ✅ Automatic timestamp updates via triggers
- ✅ Comprehensive indexes for performance
- ✅ Referential integrity with foreign keys

## Deprecated Files
The following files have been deprecated and are no longer used:
- `enhanced_schema.sql` - Superseded by postgresql_schema.sql
- `migrate.sql` - Superseded by postgresql_schema.sql

These files can be safely removed.

## Notes
- All timestamps are stored in UTC
- Passwords are hashed by the application, not stored as plain text
- Temporary passwords in the schema should be replaced by the application during initialization
- The schema uses `ON CONFLICT DO NOTHING` for safe re-runs
