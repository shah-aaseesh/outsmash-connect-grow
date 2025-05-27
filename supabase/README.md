
# Supabase Database Setup

This file contains the SQL schema needed to set up the database for the dating app.

## Setup Instructions

1. **Connect to Supabase**: Make sure you have connected your Lovable project to Supabase using the green Supabase button in the top right of the interface.

2. **Run the Schema**: Copy the contents of `schema.sql` and run it in your Supabase SQL editor:
   - Go to your Supabase dashboard
   - Navigate to the SQL Editor
   - Paste the contents of `schema.sql`
   - Click "Run" to execute the schema

3. **Verify Setup**: After running the schema, you should see these tables in your database:
   - `profiles` - User profile information
   - `photos` - User photo URLs and metadata
   - `interests` - Predefined interests list
   - `profile_interests` - Junction table linking profiles to interests
   - `preferences` - User matching preferences
   - `matches` - User matches (for future use)
   - `messages` - Match messages (for future use)

4. **Storage Bucket**: The schema also creates a `user-photos` storage bucket with proper RLS policies for photo uploads.

## What This Schema Includes

### Tables
- **profiles**: Core user profile data with RLS policies
- **photos**: Photo storage with primary photo designation
- **interests**: Predefined list of interests matching the frontend
- **profile_interests**: Many-to-many relationship between profiles and interests
- **preferences**: User matching preferences (age range, distance, looking for)
- **matches**: Future match functionality
- **messages**: Future messaging functionality

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Proper foreign key relationships
- Storage policies for photo uploads

### Features
- Automatic timestamp updates
- Data validation constraints
- Unique constraints where appropriate
- Cascading deletes for data integrity

## Testing the Setup

After running the schema, test the profile setup flow:
1. Register a new user
2. Complete the profile setup process
3. Verify data is saved correctly in all tables
4. Test photo uploads to the storage bucket

The profile setup flow should now work end-to-end without errors.
