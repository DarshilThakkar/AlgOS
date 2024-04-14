// GanttChart.js
import React from 'react';
import './GanttChart.css';

const GanttChart = ({ data }) => {
  return (
    <div className="gantt-chart">
      <h2>Gantt Chart</h2>
      <div className="chart">
        {data.map((process, index) => (
          <div
            key={index}
            className="process"
            style={{ width: `${(process.finishTime - process.startTime) * 2}%`, backgroundColor: process.color }}
          >
            {process.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GanttChart;
