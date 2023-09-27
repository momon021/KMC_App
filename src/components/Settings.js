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
         
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
