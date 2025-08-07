const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const userModel = require("./models/user");
const postModel = require("./models/post");
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/your-db-name')
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error("MongoDB Error", err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home Page
app.get('/', (req, res) => {
    res.render("index");
});


// Login Page
app.get('/login', (req, res) => {
    res.render("login");
});
app.get('/register', (req, res) => {
  res.render('register'); // 'register.ejs' should be inside the views folder
});


// Register Handler
app.post('/register', async (req, res) => {
    try {
        const { email, password, username, name, age } = req.body;

        // Step 1: Check existing user
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).send("User already registered");
        }

        // Step 2: Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Step 3: Create user
        const newUser = await userModel.create({
            name,
            email,
            username,
            age,
            password: hashedPassword,
            post: []
        });

        // Step 4: Generate Token
        const token = jwt.sign(
            { email: newUser.email, userid: newUser._id },
            "shhhh",
            { expiresIn: '1h' }  // safer token expiry
        );

        // Step 5: Set cookie
        res.cookie("token", token, { httpOnly: true });

        // Step 6: Response
        res.status(201).send("User registered successfully!");

    } catch (err) {
        console.error("🔥 Registration Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Login Handler
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).send("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).send("Incorrect password");

        const token = jwt.sign(
            { email: user.email, userid: user._id },
            "shhhh",
            { expiresIn: '1h' }
        );

        res.cookie("token", token, { httpOnly: true });

        res.send("Login successful");

    } catch (err) {
        console.error("🔥 Login Error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Start Server
app.listen(4000, () => {
    console.log("Server running on port 4000");
});
