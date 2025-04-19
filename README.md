
# AttendSync - Attendance Management System

Last updated: 2025-04-19

## Overview
AttendSync is a modern web-based attendance management system built with React and TypeScript. It provides separate interfaces for teachers and students to manage and track attendance efficiently.

## Features
- Dual authentication system (Student/Teacher roles)
- Real-time attendance tracking
- Advanced analytics and reporting
- Student self-service portal
- Excel data import/export
- Responsive design for all devices

## Tech Stack
- React 18
- TypeScript
- Tailwind CSS
- Shadcn/UI Components
- React Query
- React Router DOM
- Recharts for data visualization
- XLSX for Excel file handling

## Getting Started

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation
1. Clone the repository
```bash
git clone [your-repo-url]
cd attendsync
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure
```
src/
  ├── components/     # UI components
  ├── context/       # React context providers
  ├── hooks/         # Custom React hooks
  ├── pages/         # Route components
  ├── lib/           # Utility functions
  └── utils/         # Helper functions
```

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Deployment
The project includes configuration files for both Netlify and Vercel deployment.

## License
[Your chosen license]
