-- Run this script to set up the enhanced database schema
-- Connect to your database and execute this file

\echo 'Starting CSE Portal Enhanced Schema Migration...'

-- Run the enhanced schema
\i enhanced_schema.sql

\echo 'Schema migration completed successfully!'
\echo 'You can now start the application.'
