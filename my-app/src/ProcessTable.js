import React from 'react';
import './ProcessTable.css';

const ProcessTable = ({ processes }) => {
  return (
    <div className="process-table-container">
      <h2>Process Table</h2>
      <table className="process-table">
        <thead>
          <tr>
          <th>Process Name</th>
        <th>Arrival Time</th>
        <th>Execute Time</th>
        <th>Completion Time</th>
        <th>Burst Time</th>
        <th>Turn Around Time</th>
        <th>Waiting Time</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process, index) => (
            <tr key={index}>
              <td>{process.name}</td>
                <td>{process.arrivalTime}</td>
                <td>{process.startTime}</td>
                <td>{process.finishTime}</td>
                <td>{process.burstTime}</td>
                <td>{process.turnaroundTime}</td>
                <td>{process.waitingTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProcessTable;
