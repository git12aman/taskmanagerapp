const express = require("express");
const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Multer PDF Only, Max 3 files, Max 10MB each
const upload = multer({
  dest: "uploads/",
  limits: { files: 3, fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDFs allowed"));
  }
});
const handleMulter = (req, res, next) => {
  upload.array("documents", 3)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    next();
  });
};
async function validateAssignedUser(userId) {
  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return { valid: false, message: "Invalid assignedTo user ID." };
  }
  const userExists = await User.findById(userId);
  if (!userExists) {
    return { valid: false, message: "Assigned user does not exist." };
  }
  return { valid: true };
}

// --- CREATE Task ---
router.post("/", auth, handleMulter, async (req, res) => {
  try {
    const { title, description, status, priority, dueDate, assignedTo } = req.body;
    if (!title) return res.status(400).json({ message: "Task title is required." });
    let assignedUserId = assignedTo;
    if (!assignedTo) assignedUserId = req.user.id;
    else {
      const validation = await validateAssignedUser(assignedTo);
      if (!validation.valid) return res.status(400).json({ message: validation.message });
    }
    const documents = (req.files || []).map(file => ({
      filename: file.filename,
      originalname: file.originalname,
      path: file.path,
      mimetype: file.mimetype,
    }));
    const task = new Task({
      title,
      description,
      status,
      priority,
      dueDate,
      assignedTo: assignedUserId,
      documents,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// --- LIST Tasks ---
router.get("/", auth, async (req, res) => {
  try {
    const { status, priority, dueDate, sortBy, order } = req.query;
    let filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
    if (req.user.role !== "admin") filter.assignedTo = req.user.id;
    let sort = {};
    if (sortBy && order) sort[sortBy] = order.toLowerCase() === "desc" ? -1 : 1;
    const tasks = await Task.find(filter).populate("assignedTo", "email").sort(sort);
    res.json(tasks);
  } catch (error) {
    console.error("List tasks error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- GET Task By ID ---
router.get("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("assignedTo", "email");
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (req.user.role !== "admin" && (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- UPDATE Task ---
router.patch("/:id", auth, handleMulter, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (req.user.role !== "admin" && (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    if (req.body.assignedTo) {
      const validation = await validateAssignedUser(req.body.assignedTo);
      if (!validation.valid) return res.status(400).json({ message: validation.message });
    }
    ["title", "description", "status", "priority", "dueDate", "assignedTo"].forEach(k => {
      if (req.body[k]) task[k] = req.body[k];
    });
    if (req.files && req.files.length) {
      if (task.documents.length + req.files.length > 3) {
        return res.status(400).json({ message: "Max 3 documents allowed." });
      }
      task.documents.push(...req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        mimetype: file.mimetype,
      })));
    }
    await task.save();
    res.json(task);
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// --- DELETE Task ---
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (req.user.role !== "admin" && (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    for (const doc of task.documents) {
      if (doc.path && fs.existsSync(doc.path)) {
        try { fs.unlinkSync(doc.path); } catch (err) { console.error("File delete error:", doc.path, err); }
      }
    }
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({ message: error.message || "Internal server error" });
  }
});

// --- DOWNLOAD Document ---
router.get("/:id/document/:docIndex", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    const index = parseInt(req.params.docIndex, 10);
    if (!task || !task.documents[index]) return res.status(404).json({ message: "Document not found" });
    if (req.user.role !== "admin" && (!task.assignedTo || task.assignedTo._id.toString() !== req.user.id)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    res.sendFile(path.resolve(task.documents[index].path));
  } catch (error) {
    console.error("Get document error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
