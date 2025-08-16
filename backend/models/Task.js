const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  status: { type: String, enum: ['todo', 'in_progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: Date,
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  documents: [
    {
      filename: String,
      originalname: String,
      path: String,
      mimetype: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
