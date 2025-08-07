const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
        min: [10, "Minimum age is 10"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        match: [/.+\@.+\..+/, "Please fill a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    }
}, {
    timestamps: true 
});


const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
