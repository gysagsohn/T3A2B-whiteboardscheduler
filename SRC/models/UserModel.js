const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the user model
const userSchema = mongoose.Schema({
    useremail: {
        type: String,
        required: true,
        unique: true // Ensure usernames are unique
        trim: true // Remove whitespace from both ends of the string some error handling
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    username: {
        type: String,
        required: true,
        unique: false
    },
    usercompany: {
        type: String,
        required: true,
        unique: false
    },

    //stretch goal create a user log where it shows what the user has done. Thinking of doing this by collecting the data of each edit from data type and storing it all here
})


// need to come back and make something for Admin and Authorization 
// need to come back and establish a method to encrypt password

// Create and export the User model based on the schema
const UserModel = mongoose.model("User", userSchema);

module.exports = {
	UserModel
}