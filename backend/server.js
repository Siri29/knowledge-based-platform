const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
const app = express();
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/spaces', require('./routes/spaces'));
app.use('/api/pages', require('./routes/pages'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/documents', require('./routes/documents'));

app.get('/', (req, res) => {
  res.send('Knowledge Base API is running...');
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Socket.io for real-time features
const io = require('socket.io')(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  
  socket.on('join-page', (pageId) => {
    socket.join(pageId);
  });
  
  socket.on('leave-page', (pageId) => {
    socket.leave(pageId);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { app, io };
