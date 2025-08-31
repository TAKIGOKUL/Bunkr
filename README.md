# Bunkr - Attendance Tracker PWA

A minimal but ready-to-deploy Progressive Web App (PWA) for tracking attendance with Supabase authentication, course management, and duty leave document uploads.

## ✨ Features

### 🔐 Authentication
- **Supabase Auth**: Email/password authentication
- **User Profiles**: Name, roll number, timezone management
- **Secure Sessions**: JWT-based authentication with automatic refresh

### 📚 Course Management
- **Add/Edit/Delete Courses**: Simple course management interface
- **Attendance Tracking**: Mark sessions as present, late, absent, or excused
- **Real-time Updates**: Instant feedback with React Query

### 📅 Attendance Overview
- **Dashboard**: Overview of all courses and overall attendance percentage
- **Calendar View**: Absent dates preview with monthly navigation
- **Statistics**: Present, late, absent, and excused session counts

### 📄 Duty Leave Management
- **Document Uploads**: Support for PDF, Word, and image files
- **Status Tracking**: Pending, approved, or rejected leave requests
- **Secure Storage**: Private Supabase storage bucket with user isolation

### 🎨 Themes
- **Midnight Scholar (Dark)**: Default dark theme with gold accents
- **Metallic Luxe (Light)**: Elegant light theme with metallic accents
- **Theme Persistence**: Automatic theme saving and restoration

### 📱 PWA Features
- **Installable**: Add to home screen from mobile browsers
- **Offline Support**: Service worker with background sync
- **Responsive Design**: Mobile-first design with touch-friendly interface

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Authentication & Database**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **PWA**: Next-PWA with Workbox
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account and project

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd bunkr
npm install
```

### 2. Supabase Setup

1. **Create Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Database Setup**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `supabase-setup.sql`
   - Execute the SQL to create tables and policies

3. **Environment Variables**
   - Copy `env.example` to `.env.local`
   - Fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_APP_NAME=Bunkr
NEXT_PUBLIC_APP_VERSION=0.1.0
```

### 3. Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build and Deploy

```bash
npm run build
npm start
```

## 🗄️ Database Schema

### Tables

- **profiles**: User profile information
- **courses**: Course management
- **sessions**: Attendance records
- **duty_leave**: Leave requests and documents

### Row Level Security (RLS)

All tables have RLS enabled with policies ensuring users can only access their own data.

## 📱 PWA Configuration

The app includes:
- Service worker for offline functionality
- Web app manifest for installation
- Background sync capabilities
- Responsive design for all devices

## 🎨 Theme System

### Midnight Scholar (Dark)
- Background: `#0a0a0b`
- Surface: `#1a1a1c`
- Accent: `#f5c842`
- Text: `#ffffff`

### Metallic Luxe (Light)
- Background: `#f8f9fa`
- Surface: `#ffffff`
- Accent: `#d4a574`
- Text: `#1a1a1c`

## 🔒 Security Features

- **Row Level Security**: Database-level access control
- **JWT Authentication**: Secure session management
- **File Upload Validation**: Type and size restrictions
- **User Isolation**: Complete data separation between users

## 📊 Attendance Logic

- **Present**: 1.0 point
- **Late**: 0.5 points
- **Absent**: 0.0 points
- **Excused**: Excluded from calculations

Percentage = (Sum of weights / Total counted sessions) × 100

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── auth/             # Authentication components
│   └── layout/           # Layout components
├── contexts/              # React contexts
├── lib/                   # Utilities and configurations
└── types/                 # TypeScript type definitions
```

## 🔧 Customization

### Adding New Features

1. **New Pages**: Add routes in `src/app/`
2. **Components**: Create in `src/components/`
3. **Database**: Add tables and policies in Supabase
4. **Styling**: Modify `src/app/globals.css` and Tailwind config

### Theme Customization

Edit `src/lib/themes.ts` to modify color schemes and add new themes.

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**: Check Supabase credentials and policies
2. **Database Connection**: Verify Supabase project status
3. **PWA Issues**: Clear browser cache and service worker
4. **Build Errors**: Ensure all dependencies are installed

### Support

- Check Supabase documentation for database issues
- Review Next.js documentation for framework questions
- Open issues in the project repository

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Supabase](https://supabase.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)

---

**Bunkr** - Making attendance tracking simple and beautiful. 📚✨
