import React from 'react';
import { useNavigate } from 'react-router-dom';

const TaskList = ({ tasks, loading, onEdit, onDelete }) => {
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!tasks.length) return <div className="text-gray-600">No tasks found.</div>;

  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full bg-white shadow border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-2 py-2">Title</th>
            <th className="px-2 py-2">Status</th>
            <th className="px-2 py-2">Priority</th>
            <th className="px-2 py-2">Due</th>
            <th className="px-2 py-2">Assigned</th>
            <th className="px-2 py-2">Documents</th>
            <th className="px-2 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task._id} className="border-t">
              <td className="px-2 py-2 underline text-blue-600 cursor-pointer"
                onClick={() => navigate(`/tasks/${task._id}`)}>{task.title}</td>
              <td className="px-2 py-2">{task.status}</td>
              <td className="px-2 py-2">{task.priority}</td>
              <td className="px-2 py-2">{task.dueDate ? task.dueDate.substr(0, 10) : ''}</td>
              <td className="px-2 py-2">{task.assignedTo?.email ?? ''}</td>
              <td className="px-2 py-2">{task.documents?.length ?? 0}</td>
              <td className="px-2 py-2 flex gap-1">
                <button onClick={() => onEdit && onEdit(task)}
                  className="bg-yellow-400 text-white px-2 py-1 rounded text-xs">Edit</button>
                <button onClick={() => onDelete && onDelete(task._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
