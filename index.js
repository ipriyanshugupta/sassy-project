require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongooseConfig = require("./config/mongo-config");
const redisClient = require("./config/redis-config");
const taskRoutes = require("./routes/task");
const userRoutes = require("./routes/user");
const app = express();

app.use(cookieParser());

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Routes
app.use("/task", taskRoutes);
app.use("/user", userRoutes);

app.get("/", (req, res) => {
  res.send("Simple Task management App");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
