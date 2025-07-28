# Knowledge Base Platform

A full-stack knowledge management platform built with the MERN stack, similar to Confluence. This platform allows teams to collaboratively create, edit, organize, and search rich-text documents in a hierarchical structure.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**: JWT-based auth with role-based permissions (Admin, Editor, Viewer)
- **Document Management**: Create, edit, delete rich-text pages with version control
- **Hierarchical Organization**: Pages organized under spaces with sub-page support
- **Full-Text Search**: Search across page titles, content, and tags
- **Collaboration**: Commenting system for team collaboration
- **Rich Text Editor**: WYSIWYG editor with ReactQuill
- **Responsive UI**: Bootstrap-based responsive design

### User Roles
- **Admin**: Full access to all features, can manage spaces and users
- **Editor**: Can create and edit pages, manage own content
- **Viewer**: Read-only access to public content and assigned spaces

## 🛠️ Tech Stack

### Backend
- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database and ODM
- **JWT** + **bcryptjs** - Authentication and password hashing
- **Socket.io** - Real-time features
- **Express Validator** - Input validation
- **Multer** - File upload handling

### Frontend
- **React.js** - Frontend framework
- **React Router** - Client-side routing
- **Bootstrap** + **React Bootstrap** - UI components
- **ReactQuill** - Rich text editor
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library

## 📁 Project Structure

```
knowledge-based-platform/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── spaceController.js
│   │   ├── pageController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Space.js
│   │   ├── Page.js
│   │   ├── PageVersion.js
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── spaces.js
│   │   ├── pages.js
│   │   └── comments.js
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js
│   │   ├── components/
│   │   │   ├── FormInput.js
│   │   │   └── Navbar.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── LoginPage.js
│   │   │   ├── RegisterPage.js
│   │   │   ├── SpacePage.js
│   │   │   ├── PageEditor.js
│   │   │   └── PageView.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd knowledge-based-platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the backend directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/knowledge-base
   JWT_SECRET=your-super-secret-jwt-key-here
   CLIENT_URL=http://localhost:3000
   
   # Email configuration (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
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
   Server will run on http://localhost:5000

3. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   ```
   Application will open at http://localhost:3000

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Spaces Endpoints
- `GET /api/spaces` - Get all accessible spaces
- `POST /api/spaces` - Create new space (Admin/Editor)
- `GET /api/spaces/:id` - Get space details
- `PUT /api/spaces/:id` - Update space (Owner only)
- `DELETE /api/spaces/:id` - Delete space (Owner only)

### Pages Endpoints
- `GET /api/pages` - Get pages with filters
- `POST /api/pages` - Create new page (Admin/Editor)
- `GET /api/pages/:id` - Get page details
- `PUT /api/pages/:id` - Update page (Admin/Editor)
- `DELETE /api/pages/:id` - Delete page (Admin/Editor)
- `GET /api/pages/search` - Search pages
- `GET /api/pages/:id/versions` - Get page version history

### Comments Endpoints
- `GET /api/comments/page/:pageId` - Get page comments
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment (Author only)
- `DELETE /api/comments/:id` - Delete comment (Author/Admin)

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- Input validation and sanitization
- Password hashing with bcrypt
- CORS configuration
- Protected routes and middleware

## 🎨 UI Features

- Responsive design with Bootstrap
- Rich text editor with formatting options
- Real-time notifications
- Breadcrumb navigation
- Search functionality
- Comment system
- Version history display

## 🚀 Deployment

### Using Docker (Recommended)

1. **Create Dockerfile for Backend**
2. **Create Dockerfile for Frontend**
3. **Create docker-compose.yml**
4. **Deploy to cloud platform**

### Manual Deployment

1. **Backend**: Deploy to services like Heroku, AWS EC2, or DigitalOcean
2. **Frontend**: Deploy to Vercel, Netlify, or AWS S3
3. **Database**: Use MongoDB Atlas for cloud database

## 🔮 Future Enhancements

- [ ] Real-time collaborative editing
- [ ] Page templates
- [ ] File attachments and image uploads
- [ ] Export to PDF functionality
- [ ] Dark mode theme
- [ ] Advanced search filters
- [ ] Activity audit trail
- [ ] Email notifications
- [ ] Mobile app
- [ ] Integration with external tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the development team.

---

For questions or support, please open an issue in the repository.