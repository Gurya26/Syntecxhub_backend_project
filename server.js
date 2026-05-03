const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

let users = [];
let id = 1;

// CREATE
app.post("/users", (req, res) => {
  const user = { id: id++, ...req.body };
  users.push(user);
  res.send(user);
});

// READ
app.get("/users", (req, res) => {
  res.send(users);
});

// UPDATE
app.put("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(u => u.id === userId);

  if (!user) return res.send("User not found");

  user.name = req.body.name;
  user.email = req.body.email;

  res.send("User updated");
});

// DELETE
app.delete("/users/:id", (req, res) => {
  const userId = parseInt(req.params.id);
  users = users.filter(u => u.id !== userId);
  res.send("User deleted");
});

// TEST
app.get("/", (req, res) => {
  res.send("Server running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});