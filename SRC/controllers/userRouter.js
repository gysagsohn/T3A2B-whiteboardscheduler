const express = require("express");
const { UserModel } = require("../models/UserModel");
const router = express.Router();
const { comparePasswords, createJwt } = require("../utils/auth");
const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/", asyncHandler(async (req, res, next) => {
    let result = await UserModel.find({}).exec();
    res.json({
        message: "User Route is working",
        result: result
    });
}));

// User login route
router.post("/login", asyncHandler(async (req, res, next) => {
    console.log("Request Body:", req.body); // Log the request body

    const { useremail, password } = req.body;

    if (!useremail || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    try {
        const user = await UserModel.findOne({ useremail }).exec();
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await comparePasswords(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = createJwt(user._id);
        res.json({
            message: "Login successful",
            token: token
        });
    } catch (error) {
        next(error); // Pass error to the error handler
    }
}));

router.get("/:id", asyncHandler(async (req, res, next) => {
    let result = await UserModel.findById(req.params.id).exec();
    if (!result) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({
        message: "User Route is working",
        result: result
    });
}));

router.post("/", asyncHandler(async (req, res, next) => {
    const { useremail } = req.body;
    const existingUser = await UserModel.findOne({ useremail }).exec();
    if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    let user = new UserModel(req.body);
    try {
        let result = await user.save();
        res.status(201).json({
            message: "Created new user",
            result: result
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid user data", error: error.message });
    }
}));

router.put("/:id", asyncHandler(async (req, res, next) => {
    try {
        let result = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).exec();
        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            message: "Updated user",
            result: result
        });
    } catch (error) {
        res.status(400).json({ message: "Invalid user data", error: error.message });
    }
}));

router.delete("/:id", asyncHandler(async (req, res, next) => {
    let result = await UserModel.findByIdAndDelete(req.params.id).exec();
    if (!result) {
        return res.status(404).json({ message: "User not found" });
    }
    res.json({
        message: "Deleted user",
        result: result
    });
}));

router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong!", error: err.message });
});

module.exports = router;
