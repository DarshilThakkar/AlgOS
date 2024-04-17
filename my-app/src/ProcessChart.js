// ProcessChart.js
import React from 'react';
import './ProcessChart.css';

const ProcessChart = ({ processes }) => {
  const maxTime = Math.max(...processes.map(process => process.finishTime));
  const maxProcessIndex = processes.length;

  const xScale = (time) => (time / maxTime) * 800; // Assuming 800px width for the chart
  const yScale = (index) => (index / maxProcessIndex) * 400; // Assuming 400px height for the chart

  return (
    <div className="process-chart">
      <svg width="1000" height="500">
        {/* X Axis */}
        <line x1="100" y1="450" x2="900" y2="450" />
        {processes.map((process, index) => (
          <text
            key={`xLabel-${process.name}`}
            x={xScale(process.finishTime) + 100}
            y="470"
            textAnchor="middle"
          >
            {process.finishTime}
          </text>
        ))}
        <text x="500" y="495" textAnchor="middle">Time</text>
        
        {/* Y Axis */}
        <line x1="100" y1="50" x2="100" y2="450" />
        <text x="20" y="250" textAnchor="middle">Process</text>
        {processes.map((process, index) => (
          <text
            key={`yLabel-${process.name}`}
            x="90"
            y={yScale(index + 1)}
            alignmentBaseline="middle"
            textAnchor="end"
          >
            {process.name}
          </text>
        ))}

        {/* Processes */}
        {processes.map((process, index) => (
          <rect
            key={process.name}
            x={xScale(process.startTime) + 100}
            y={yScale(index + 1) - 5}
            width={xScale(process.finishTime - process.startTime)}
            height="15"
            fill="#007bff"
          />
        ))}
      </svg>
    </div>
  );
};

export default ProcessChart;
