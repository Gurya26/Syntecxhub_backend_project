const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

let users = [];

// GET users
app.get("/users", (req, res) => {
  res.json(users);
});

// ADD user
app.post("/users", (req, res) => {
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
  };
  users.push(newUser);
  res.json(newUser);
});

// DELETE user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(user => user.id !== id);
  res.json({ message: "User deleted" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});