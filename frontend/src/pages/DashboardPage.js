import React, { useEffect, useState } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from '../redux/taskSlice';
import { useDispatch, useSelector } from 'react-redux';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import TaskFilters from '../components/TaskFilters';
import axios from 'axios';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { list, loading } = useSelector(state => state.tasks);
  const { user, token } = useSelector(state => state.auth);

  const [filters, setFilters] = useState({ status: '', priority: '', dueDate: '', sortBy: '', order: 'asc' });
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    dispatch(fetchTasks(filters));
    // Admin fetch all users for assigning, users fetch only self.
    if (user?.role === 'admin') {
      axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setUsers(res.data)).catch(()=>setUsers([]));
    } else {
      setUsers([{ _id: user.id, email: user.email }]);
    }
  }, [dispatch, user, token, filters]);

  const handleCreate = () => { setEditTask(null); setShowForm(true); setMsg(''); };
  const handleEdit = task => { setEditTask(task); setShowForm(true); setMsg(''); };
  const handleDelete = id => {
    if (window.confirm('Delete this task?')) {
      dispatch(deleteTask(id)).unwrap()
        .then(()=>setMsg("Task deleted.")).catch(()=>setMsg("Error deleting!"));
    }
  };
  const handleSubmit = (form) => {
    const action = editTask
      ? updateTask({ id: editTask._id, data: form })
      : createTask(form);
    dispatch(action).unwrap()
      .then(() => { setShowForm(false); setMsg(editTask ? "Task updated!" : "Task created!"); })
      .catch(() => setMsg("Error saving task."));
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <button className="bg-blue-600 text-white py-2 px-4 rounded"
          onClick={handleCreate}>Create New Task</button>
      </div>
      <TaskFilters filters={filters} setFilters={setFilters} />
      {msg && <div className="mb-2 text-green-700">{msg}</div>}
      <TaskList tasks={list} loading={loading} onEdit={handleEdit} onDelete={handleDelete} />
      {showForm && (
        <TaskForm open={showForm} onClose={()=>setShowForm(false)}
          initial={editTask} onSubmit={handleSubmit} users={users} />
      )}
    </div>
  );
};

export default DashboardPage;
