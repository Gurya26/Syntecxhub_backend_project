const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // serve index.html

// MongoDB connection
mongoose.connect("mongodb+srv://admin:Anam123@cluster0.kpkszvv.mongodb.net/mydb")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// Schema with validation
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please use valid email"]
  }
});

const User = mongoose.model("User", userSchema);

// Routes

// Home route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Get users
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

// Add user
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update user
app.put("/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));