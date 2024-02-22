const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.use(auth);

// Create a new task
router.post("/", async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json({ message: "Task created successfully.", task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();
    if (!tasks) {
      return res.status(404).json({ error: "No Task Found" });
    }
    res.json({ message: "Success", tasks });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get a specific task by ID
router.get("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ error: "Invalid id." });
    const task = await Task.findById(req.params.id);
    if (!task) {
      console.log("task not found");
      return res.status(404).json({ error: "Task not found by this id." });
    }
    res.json({ message: "Success", task });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Update a task by ID
router.put("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ error: "Invalid id." });
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(task);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task Updated Successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a task by ID
router.delete("/:id", async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).json({ error: "Invalid id." });
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", task });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
