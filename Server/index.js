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
const env = require('dotenv').config()

mongoose.connect('mongodb://localhost:27017/RealDoc', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

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

// register 
app.post('/user/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ msg: 'Username already exists' });
        }

        user = new User({
            username,
            password,
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'your_jwt_secret',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login endpoint
app.post('/user/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Username' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Password' });
        }

        const payload = {
            user: {
                id: user.id,
            },
        };

        jwt.sign(
            payload,
            'your_jwt_secret',
            { expiresIn: 3600 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



const port = process.env.PORT || 5000
server.listen(port, () => {
    console.log(`server running on port : ${port}`)
})