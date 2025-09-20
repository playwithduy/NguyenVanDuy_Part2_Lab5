const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session'); // <--- thêm
const MongoStore = require('connect-mongo'); // <--- lưu session trong MongoDB
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth'); // <--- thêm

const app = express();


// middlewares
app.use(express.json());
app.use(cookieParser());
// connect to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/sessionAuth", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// session setup
app.use(
    session({
        secret: 'mysecretkey',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({ mongoUrl: 'mongodb://127.0.0.1:27017/sessionAuth' }),
        cookie: {
            httpOnly: true,
            secure: false, // Chỉ gửi cookie qua HTTPS trong môi trường production

            maxAge: 1000 * 60 * 60 // 1h
        }
    }));

// routes

app.use('/auth', authRoutes); // <--- thêm

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});