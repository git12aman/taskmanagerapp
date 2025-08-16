import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Button, InputLabel, Select, FormControl, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

function TaskForm({ open, onClose, onSubmit, initial, users }) {
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    dueDate: '',
    assignedTo: '',
    documents: []
  });

  useEffect(() => {
    if (open && initial) {
      setForm({
        title: initial.title ?? '',
        description: initial.description ?? '',
        status: initial.status ?? 'todo',
        priority: initial.priority ?? 'medium',
        dueDate: initial.dueDate ? initial.dueDate.substr(0, 10) : '',
        assignedTo: initial.assignedTo?._id ?? '',
        documents: []
      });
    } else if (open) {
      setForm({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: '',
        assignedTo: users.length ? users[0]._id : '',
        documents: []
      });
    }
  }, [open, initial, users]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (name === 'documents') {
      if (files.length + form.documents.length > 3) {
        alert('You can only upload up to 3 PDF documents.');
        return;
      }
      setForm(f => ({ ...f, documents: [...f.documents, ...Array.from(files)] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!form.title.trim()) {
      alert("Title is required!");
      return;
    }
    onSubmit(form);
  };

  const handleRemoveFile = (index) => {
    setForm(f => {
      const docs = [...f.documents];
      docs.splice(index, 1);
      return { ...f, documents: docs };
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{initial ? "Edit Task" : "Create Task"}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent dividers>
          <TextField label="Title" name="title" fullWidth margin="normal" required value={form.title} onChange={handleChange} />
          <TextField label="Description" name="description" fullWidth margin="normal" multiline rows={3} value={form.description} onChange={handleChange} />
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select name="status" value={form.status} label="Status" onChange={handleChange}>
              <MenuItem value="todo">Todo</MenuItem>
              <MenuItem value="in_progress">In Progress</MenuItem>
              <MenuItem value="done">Done</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select name="priority" value={form.priority} label="Priority" onChange={handleChange}>
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Due Date"
            name="dueDate"
            type="date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={form.dueDate}
            onChange={handleChange}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Assigned To</InputLabel>
            <Select name="assignedTo" value={form.assignedTo} label="Assigned To" onChange={handleChange}>
              {users.map(u => (
                <MenuItem value={u._id} key={u._id}>{u.email}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <div style={{ marginTop: 10, marginBottom: 5 }}>
            <input
              type="file"
              multiple
              accept="application/pdf"
              name="documents"
              onChange={handleChange}
            />
            <div style={{ fontSize: 12, color: '#555' }}>Attach up to 3 PDF documents</div>
          </div>

          {form.documents.length > 0 && (
            <div>
              <strong>Selected documents:</strong>
              <ul>
                {form.documents.map((file, index) => (
                  <li key={index}>
                    {file.name}{" "}
                    <button type="button" onClick={() => handleRemoveFile(index)} style={{ color: 'red', cursor: 'pointer', border: 'none', background: 'none' }}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={false}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {initial ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default TaskForm;
