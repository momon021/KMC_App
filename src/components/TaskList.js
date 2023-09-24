import React from 'react';

const TaskList = ({ tasks, onDelete, onUpdate }) => {
  return (
    <div>
      <h2>Task List</h2>
      <table>
        <thead>
          <tr>
            <th>Task</th>
            <th>Status</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={index}>
              <td>{task.task}</td>
              <td>{task.status}</td>
              <td>{task.startTime}</td>
              <td>{task.endTime}</td>
              <td>{task.name}</td>
              <td>
                <button onClick={() => onUpdate(index)}>Update</button>
                <button onClick={() => onDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
