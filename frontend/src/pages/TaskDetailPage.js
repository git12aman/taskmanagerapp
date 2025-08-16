import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const API = 'http://localhost:5000/api/tasks';

const TaskDetailPage = () => {
  const { id } = useParams();
  const token = useSelector(state => state.auth.token);
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch task details including documents
  useEffect(() => {
    const fetchTask = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTask(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch task.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchTask();
  }, [id, token]);

  // Document download handler with token in header
  const handleDownload = async (docIndex) => {
    if (!token) {
      alert('Please login to download documents.');
      return;
    }
    try {
      const response = await axios.get(
        `${API}/${id}/document/${docIndex}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = task.documents[docIndex]?.originalname || `document_${docIndex + 1}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      alert(err.response?.data?.message || 'Failed to download document.');
    }
  };

  if (loading) return <p>Loading task...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!task) return null;

  return (
    <div>
      <h1>Task: {task.title}</h1>
      <p>Status: {task.status}</p>
      <p>Priority: {task.priority}</p>
      <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>

      <h2>Documents</h2>
      {task.documents && task.documents.length > 0 ? (
        <ul>
          {task.documents.map((doc, index) => (
            <li key={doc.filename}>
              {doc.originalname}
              <button style={{ marginLeft: '10px' }} onClick={() => handleDownload(index)}>
                Download
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No documents attached.</p>
      )}
    </div>
  );
};

export default TaskDetailPage;
