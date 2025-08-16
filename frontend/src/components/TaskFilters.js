import React from 'react';

const TaskFilters = ({ filters, setFilters }) => (
  <div className="flex flex-wrap gap-3 items-end mb-4">
    <div>
      <label className="block text-sm">Status</label>
      <select
        className="border rounded p-1"
        value={filters.status}
        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
    <div>
      <label className="block text-sm">Priority</label>
      <select
        className="border rounded p-1"
        value={filters.priority}
        onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
      >
        <option value="">Any</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
    </div>
    <div>
      <label className="block text-sm">Due Before</label>
      <input
        type="date"
        className="border rounded p-1"
        value={filters.dueDate}
        onChange={e => setFilters(f => ({ ...f, dueDate: e.target.value }))}
      />
    </div>
    <div>
      <label className="block text-sm">Sort By</label>
      <select
        className="border rounded p-1"
        value={filters.sortBy}
        onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
      >
        <option value="">--</option>
        <option value="priority">Priority</option>
        <option value="dueDate">Due Date</option>
        <option value="status">Status</option>
      </select>
    </div>
    <div>
      <label className="block text-sm">Order</label>
      <select
        className="border rounded p-1"
        value={filters.order}
        onChange={e => setFilters(f => ({ ...f, order: e.target.value }))}
      >
        <option value="asc">ASC</option>
        <option value="desc">DESC</option>
      </select>
    </div>
  </div>
);

export default TaskFilters;
