# Knowledge Base Platform

A comprehensive knowledge management and document collaboration platform built with React.js and Node.js.

[![Watch Demo]
(https://drive.google.com/file/d/1EBHUVzZwRPT3N6p_UnkUzsjheYQTnEgT/view?usp=sharing)
> Click the image to watch a walkthrough video hosted on Google Drive.


## 🚀 Features

### 🔐 User Authentication System
- User registration with email validation
- Login with email/password
- Forgot password functionality with email reset
- JWT-based authentication for API security
- Role-based access control (Admin, Editor, Viewer)

### 📄 Document Management
- **Document Listing**: Display all accessible documents with metadata (title, author, last modified, visibility status)
- **Document Creation**: Rich WYSIWYG editor for creating formatted documents
- **Document Editing**: In-place editing with auto-save functionality (2-second delay)
- **Search Functionality**: Global search across document titles and content
- **Version Control**: Track all document changes with timestamps and history

### 👥 User Collaboration
- **User Mentions**: @username functionality that triggers notifications
- **Auto-sharing**: When a user is mentioned, they automatically get read access to the document
- **Real-time collaboration**: Multiple users can work on documents simultaneously

### 🔒 Privacy Controls
- **Public Documents**: Accessible to anyone with the link (no login required)
- **Private Documents**: Only accessible to the author and explicitly shared users
- **Sharing Management**: Add/remove user access with different permission levels (view/edit)

### 🏢 Workspace Management
- **Spaces**: Organize content into dedicated workspaces
- **Templates**: Reusable document templates for consistency
- **Activity Feed**: Track all platform activities and changes
- **Admin Dashboard**: User management and platform statistics

### 🎨 Modern UI/UX
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Toggle between themes
- **Professional Logo**: Custom branding with animations
- **Bootstrap Integration**: Clean, modern interface

## 🛠️ Tech Stack

### Frontend
- **React.js 18** - Modern UI framework
- **React Router 6** - Client-side routing
- **React Bootstrap** - UI components
- **Axios** - HTTP client
- **React Icons** - Icon library
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Nodemailer** - Email functionality

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/knowledge-based-platform.git
cd knowledge-based-platform
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/knowledge-base
JWT_SECRET=your-super-secret-jwt-key-here
CLIENT_URL=http://localhost:3000

# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
```bash
cd ../backend
npm run seed
```

This creates sample users, documents, and content.

## 🚀 Running the Application

### Development Mode
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Production Build
```bash
cd frontend
npm run build
```

## 👥 Default Users

After running the seed command, you can login with:

- **Admin**: admin@example.com / admin123
- **Editor**: editor@example.com / password123
- **Viewer**: viewer@example.com / password123
- **Editor**: lakshmi@example.com / password123
- **Editor**: karthik@example.com / password123
- **Viewer**: deepika@example.com / password123
- **Editor**: suresh@example.com / password123
- **Viewer**: ananya@example.com / password123

## 📁 Project Structure

```
knowledge-based-platform/
├── backend/
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── utils/              # Utility functions
│   ├── scripts/            # Database scripts
│   └── server.js           # Entry point
├── frontend/
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React contexts
│   │   ├── pages/          # Page components
│   │   ├── styles/         # CSS files
│   │   └── api/            # API configuration
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/reset-password` - Reset password

### Documents
- `GET /api/documents` - Get all accessible documents
- `GET /api/documents/:id` - Get specific document
- `POST /api/documents` - Create new document
- `PUT /api/documents/:id` - Update document
- `POST /api/documents/:id/share` - Share document
- `GET /api/documents/search` - Search documents
- `GET /api/documents/public/:id` - Get public document

### Spaces
- `GET /api/spaces` - Get all spaces
- `POST /api/spaces` - Create new space
- `GET /api/spaces/:id` - Get specific space
- `PUT /api/spaces/:id` - Update space

### Templates
- `GET /api/templates` - Get all templates
- `POST /api/templates` - Create new template
- `GET /api/templates/:id` - Get specific template

### Admin (Admin only)
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/users` - All users
- `PUT /api/admin/users/:id/role` - Update user role
- `DELETE /api/admin/users/:id` - Delete user

## 🎯 Key Features Explained

### Document Collaboration
- **WYSIWYG Editor**: Rich text editing with formatting tools
- **Auto-save**: Changes saved automatically every 2 seconds
- **Version History**: Complete change tracking with timestamps
- **User Mentions**: @username triggers notifications and auto-sharing
- **Permission Levels**: View-only or edit access control

### Privacy & Security
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, Editor, Viewer permissions
- **Document Privacy**: Public/private visibility controls
- **Secure Sharing**: Email-based user sharing system

### Admin Features
- **User Management**: View, edit, delete users
- **Platform Statistics**: Users, documents, spaces, activities
- **Activity Monitoring**: Real-time platform activity feed
- **Password Display**: View user passwords for support

## 🚀 Deployment

### Frontend (Netlify)
1. Build the project: `npm run build`
2. Deploy `build` folder to Netlify
3. Set environment variables for API URL

### Backend (Heroku/Railway)
1. Deploy backend to cloud platform
2. Set environment variables
3. Update CORS settings for frontend domain

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## 📝 License

This project is licensed under the MIT License.

## 🐛 Known Issues

- Email functionality requires SMTP configuration
- File upload not implemented (planned feature)
- Real-time notifications need WebSocket implementation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- **v1.1.0** - Added document collaboration
- **v1.2.0** - Enhanced UI/UX and admin features

---

Built with ❤️ using React.js and Node.js
