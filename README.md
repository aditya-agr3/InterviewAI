# InterviewAI - AI-Powered Interview Preparation Web App

A complete, production-ready MERN stack application that helps users prepare for technical interviews using Google Gemini AI. The app generates personalized interview questions, provides expert answers, and offers AI-powered explanations.

## 🚀 Features

### Interview Preparation
- **User Authentication**: Secure JWT-based registration and login
- **AI-Generated Questions**: Personalized interview questions based on job role, experience level, and tech stack
- **Expert Answers**: Comprehensive, well-structured answers with code examples
- **AI Explanations**: Simplified explanations for complex concepts
- **Pin Questions**: Save important questions for later review
- **Personal Notes**: Add and manage notes for each question
- **Modern UI**: Clean, light-themed interface with Tailwind CSS

### Resume Builder
- **Resume Dashboard**: Organized view of all saved resumes with edit/delete actions
- **Live Resume Editor**: Instantly update and preview your resume as you type
- **Template Switching**: Choose from 4 professional templates (Modern, Classic, Creative, Minimal)
- **Color Palette Selector**: Customize the look with 8 color themes
- **PDF Download**: Download your resume as a polished PDF with one click
- **Save & Edit Resumes**: Store multiple resumes securely for future updates
- **Image Upload**: Upload and preview your profile photo in real-time
- **Full CRUD Support**: Complete backend API integration with MongoDB

## 🛠️ Tech Stack

### Frontend
- React 18 with Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Context API
- jsPDF for PDF generation
- html2canvas for PDF rendering

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- Google Gemini API

## 📁 Project Structure

```
interviewAI/
├── frontend/          # React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── context/       # React Context (Auth)
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── styles/        # Global styles
│   ├── package.json
│   └── vite.config.ts
│
└── backend/           # Node.js API
    ├── src/
    │   ├── controllers/   # Route controllers
    │   ├── routes/        # API routes
    │   ├── models/        # MongoDB models
    │   ├── middlewares/   # Auth middleware
    │   ├── services/      # Gemini API service
    │   └── utils/         # Utilities
    ├── package.json
    └── tsconfig.json
```

## 🚀 Quick Deploy (Free Hosting)

**Want to deploy for FREE?** See our deployment guides:
- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - 5-minute deployment guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment options
- **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** - GitHub repository setup

**Recommended Free Stack:**
- Frontend: [Vercel](https://vercel.com) (free, unlimited)
- Backend: [Render](https://render.com) (free tier, 750 hrs/month)
- Database: [MongoDB Atlas](https://mongodb.com/cloud/atlas) (free, 512MB)

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Gemini API Key ([Get it here](https://aistudio.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interviewAI
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend (.env)

**⚠️ IMPORTANT:** Create a `.env` file in the `backend/` directory before starting the server:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/interviewai
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_min_32_characters
GEMINI_API_KEY=your_gemini_api_key_here
```

**Notes:** 
- `JWT_SECRET` must be at least 32 characters long for security
- `GEMINI_API_KEY` should start with "AIza" - if you get 403 errors, verify the key is correct
- The server will not start if required environment variables are missing
- Generate a secure JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Get Gemini API Key: Visit https://aistudio.google.com/app/apikey and create a new API key

#### Frontend (.env)

Create a `.env` file in the `frontend/` directory (optional):

```env
VITE_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Sessions
- `POST /api/sessions` - Create a new interview session
- `GET /api/sessions` - Get all sessions for authenticated user
- `GET /api/sessions/:sessionId` - Get a specific session with questions
- `GET /api/sessions/pinned` - Get all pinned questions

### Questions
- `POST /api/sessions/:sessionId/questions/:questionId/explain` - Generate AI explanation
- `PATCH /api/sessions/:sessionId/questions/:questionId/pin` - Toggle pin status
- `PATCH /api/sessions/:sessionId/questions/:questionId/notes` - Update notes

### Resumes
- `GET /api/resumes` - Get all resumes for authenticated user
- `GET /api/resumes/:resumeId` - Get a specific resume
- `POST /api/resumes` - Create a new resume
- `PUT /api/resumes/:resumeId` - Update a resume
- `DELETE /api/resumes/:resumeId` - Delete a resume
- `POST /api/resumes/:resumeId/upload-image` - Upload profile image

## 🎨 Design Theme

The application uses a modern light theme with the following color palette:

- **Background**: #F9FAFB
- **Card/Surface**: #FFFFFF
- **Primary**: #4F46E5 (Indigo)
- **Secondary**: #7C3AED (Purple)
- **Text Heading**: #111827
- **Text Body**: #374151
- **Text Muted**: #6B7280

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration

## 📝 Usage

### Interview Preparation
1. **Register/Login**: Create an account or sign in
2. **Create Session**: Start a new interview session by providing:
   - Job role (e.g., "Full Stack Developer")
   - Experience level (Beginner, Intermediate, Advanced, Expert)
   - Tech stack (e.g., React, Node.js, MongoDB)
3. **Review Questions**: Browse AI-generated questions and answers
4. **Interact**: 
   - Click questions to expand/collapse
   - Get AI explanations for complex topics
   - Pin important questions
   - Add personal notes
5. **Pinned Questions**: View all pinned questions in one place

### Resume Builder
1. **Access Resume Builder**: Click "Build Resume" from the dashboard
2. **Create Resume**: Click "Create New Resume" to start
3. **Fill Information**: Use the tabbed editor to add:
   - Personal information (name, contact, social links)
   - Professional summary
   - Work experience
   - Education
   - Skills
   - Certifications
4. **Customize**: 
   - Choose from 4 templates (Modern, Classic, Creative, Minimal)
   - Select a color theme from 8 options
   - Upload a profile photo
5. **Preview**: See live preview as you type
6. **Save & Download**: Save your resume and download as PDF

## 🏗️ Building for Production

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
```
The built files will be in the `dist/` directory.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React and Vite for the frontend framework
- Express.js and MongoDB for the backend stack

---

Built with ❤️ using the MERN stack and Google Gemini AI
