const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB Connection
mongoose.connect("mongodb://admin:Anam1234@ac-j5g3hmc-shard-00-00.kpkszvv.mongodb.net:27017,ac-j5g3hmc-shard-00-01.kpkszvv.mongodb.net:27017,ac-j5g3hmc-shard-00-02.kpkszvv.mongodb.net:27017/?ssl=true&replicaSet=atlas-lmr2ek-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("MongoDB Connected ✅"))
.catch(err => console.log(err));

// 📦 Schema with validation
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

// ➕ CREATE USER
app.post("/users", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email required" });
    }

    const user = new User({ name, email });
    await user.save();

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📥 GET USERS
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✏️ UPDATE USER ✅ (NEW)
app.put("/users/:id", async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: "Name and Email required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ❌ DELETE USER
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🚀 SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});