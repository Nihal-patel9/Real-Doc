const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketIo = require('socket.io')
const cors = require('cors')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const documentRoutes = require('./routes/documents');
const userRoutes = require('./routes/user');

const io = socketIo(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors())
app.use(bodyParser.json())

app.use('/document', documentRoutes)

// user Routes

app.use('/user', userRoutes)

let documents = {};

io.on('connection', (socket) => {
    console.log('New client connected')
    socket.on('get-document', (documentId) => {
        if (!documents[documentId]) {
            documents[documentId] = '';
        }
        socket.join(documentId);
        socket.emit('load-document', documents[documentId]);

        socket.on('send-changes', (delta) => {
            documents[documentId] = delta;
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        });
    });
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})