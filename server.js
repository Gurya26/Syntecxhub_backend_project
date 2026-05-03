const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve frontend (index.html)
app.use(express.static(__dirname));

// Home route → opens your UI
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// In-memory data (temporary database)
let users = [];

// 👉 GET all users
app.get("/users", (req, res) => {
  res.json(users);
});

// 👉 ADD user
app.post("/users", (req, res) => {
  const newUser = {
    id: Date.now(),
    name: req.body.name,
    email: req.body.email,
  };

  users.push(newUser);
  res.json(newUser);
});

// 👉 DELETE user
app.delete("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  users = users.filter((user) => user.id !== id);
  res.json({ message: "User deleted" });
});

// 👉 UPDATE user
app.put("/users/:id", (req, res) => {
  const id = parseInt(req.params.id);

  users = users.map((user) =>
    user.id === id ? { ...user, ...req.body } : user
  );

  res.json({ message: "User updated" });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});