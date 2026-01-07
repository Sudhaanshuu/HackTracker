# Hackathon Tracker - Setup Instructions

## New Workflow Overview

This app has been redesigned with a simplified workflow:

1. **Landing Page**: No login required - shows options to create team, access existing team, or admin dashboard
2. **Create Team**: Teams get auto-assigned numbers (1, 2, 3...) and set their own password
3. **Team Access**: Teams enter their team number + password to access their dashboard
4. **Admin Dashboard**: Direct access to manage all teams and update progress

## Database Setup

### 1. Create New Supabase Project
1. Go to [Supabase](https://supabase.com) and create a new project
2. Wait for the project to be ready

### 2. Run Database Schema
1. Go to the SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `database_schema.sql`
3. Run the SQL to create all tables and sample data

### 3. Update Environment Variables
Update your `.env.local` file with your new Supabase credentials:

```env
VITE_SUPABASE_URL=your_new_supabase_url
VITE_SUPABASE_ANON_KEY=your_new_anon_key
```

## Features

### Team Creation
- Auto-assigned team numbers (1, 2, 3...)
- Custom team passwords
- Team member details (name, background, role)
- Problem statement and theme selection

### Team Dashboard
- **Overview**: Team info, members, current evaluation
- **Milestones**: Track brainstorming, PRD, and build completion
- **Tools & Tech**: Record coding tools and LLM usage
- **Submissions**: Screen recording and final submission URLs

### Admin Dashboard
- View all teams in a grid layout
- Click any team to see detailed information
- Update milestones and evaluation scores
- View team progress and submissions

### Evaluation Criteria
- **Novelty** (1-5): How innovative is the solution?
- **Fastest to Build** (1-5): Speed of development
- **Feature Count** (1-5): Number of implemented features
- **Clarity** (1-5): How clear is the presentation/demo?
- **Impact/Reach** (1-5): Potential impact of the solution

## Running the App

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open http://localhost:5173 in your browser

## Usage Flow

### For Teams:
1. Visit the landing page
2. Click "Create New Team" to register
3. Fill in team details and member information
4. Get assigned a team number and set a password
5. Use the team dashboard to track progress
6. Update milestones, tools, and submit links

### For Admins:
1. Visit the landing page
2. Click "Admin Access"
3. View all teams in the overview
4. Click on any team to manage their progress
5. Update evaluation scores and milestones

## Key Changes from Previous Version

- **No Authentication**: Removed complex user management
- **Simple Team Access**: Team number + password system
- **Auto Team Numbers**: Sequential numbering (1, 2, 3...)
- **Direct Admin Access**: No login required for admin functions
- **Simplified Database**: Focused on core hackathon tracking features
- **Mobile Responsive**: Works well on all device sizes

## Database Tables

- **teams**: Core team information
- **participants**: Team member details
- **milestones**: Progress tracking
- **tool_usage**: Technology stack used
- **progress_updates**: Submission links
- **evaluations**: Scoring system

The app is now ready to use for your hackathon event!