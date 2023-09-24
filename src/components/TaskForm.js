import React, { useState } from 'react';

const TaskForm = ({ onCreate, onUpdate, taskToUpdate }) => {
  const [task, setTask] = useState({ task: '', status: '', startTime: '', endTime: '', name: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (taskToUpdate === null) {
      onCreate(task);
    } else {
      onUpdate(task, taskToUpdate);
    }
    setTask({ task: '', status: '', startTime: '', endTime: '', name: '' });
  };

  return (
    <div>
      <h2>Create/Update Task</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="task" value={task.task} onChange={handleInputChange} placeholder="Task" />
        <input type="text" name="status" value={task.status} onChange={handleInputChange} placeholder="Status" />
        <input type="text" name="startTime" value={task.startTime} onChange={handleInputChange} placeholder="Start Time" />
        <input type="text" name="endTime" value={task.endTime} onChange={handleInputChange} placeholder="End Time" />
        <input type="text" name="name" value={task.name} onChange={handleInputChange} placeholder="Name" />
        <button type="submit">{taskToUpdate === null ? 'Create Task' : 'Update Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;
