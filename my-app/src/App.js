// App.js
import React, { useState, useRef, useEffect } from 'react';
import GanttChart from './GanttChart';
import './App.css';

const App = () => {
  const [processes, setProcesses] = useState([]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [scheduleResult, setScheduleResult] = useState([]);
  const [timeQuantum, setTimeQuantum] = useState(2); // Default time quantum for Round Robin
  const [darkMode, setDarkMode] = useState(true);
  const inputBurstRef = useRef(null);
  const inputArrivalRef = useRef(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    updateTable(processes);
  }, [processes, selectedAlgorithm, timeQuantum]);

  const addProcess = () => {
    const burstTime = parseInt(inputBurstRef.current.value);
    const arrivalTime = parseInt(inputArrivalRef.current.value);
  
    if (isNaN(burstTime) || burstTime <= 0 || isNaN(arrivalTime) || arrivalTime < 0) {
      alert('Please enter valid burst and arrival times.');
      return;
    }
  
    const newProcess = {
      name: `P${processes.length + 1}`,
      burstTime: burstTime,
      remainingTime: burstTime, // Added remaining time for STRF
      arrivalTime: arrivalTime,
    };
  
    // Update the entire table data by combining the new process with the existing processes
    const updatedProcesses = [...processes, newProcess];
  
    // Update the state to trigger re-rendering and running the algorithm again
    setProcesses(updatedProcesses);
    updateTable(updatedProcesses); // Run the algorithm with the updated table data
  };

  const updateTable = (processes) => {
    if (selectedAlgorithm === 'FCFS') {
      setScheduleResult(runFCFS(processes));
    } else if (selectedAlgorithm === 'SJF') {
      setScheduleResult(runSJF(processes));
    } else if (selectedAlgorithm === 'RR') {
      setScheduleResult(runRoundRobin(processes, timeQuantum));
    } else if (selectedAlgorithm === 'STRF') {
      setScheduleResult(runSTRF(processes));
    }
  };

  const handleAlgorithmSelect = (e) => {
    setSelectedAlgorithm(e.target.value);
  };

  const handleTimeQuantumChange = (e) => {
    setTimeQuantum(parseInt(e.target.value));
  };

  const handleButtonClick = () => {
    setTimeout(() => {
      setShowSuccess(true);
      // Hide the success message after a certain period
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000); // 3000 milliseconds = 3 seconds
    }, 100); // 1000 milliseconds = 1 second
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const runFCFS = (processes) => {
    let currentTime = 0;
    const schedule = [];

    processes.forEach((process, index) => {
      const startTime = Math.max(currentTime, process.arrivalTime);
      const finishTime = startTime + process.burstTime;
      schedule.push({
        name: process.name,
        startTime: startTime,
        finishTime: finishTime,
        turnaroundTime: finishTime - process.arrivalTime,
        waitingTime: startTime - process.arrivalTime,
        burstTime: process.burstTime,
        arrivalTime: process.arrivalTime,
        color: '#017BFE',
      });
      currentTime = finishTime;
    });

    return schedule;
  };

  const runSJF = (processes) => {
    let currentTime = 0;
    const schedule = [];
    const remainingProcesses = processes.slice();

    while (remainingProcesses.length > 0) {
      const arrivedProcesses = remainingProcesses.filter(process => process.arrivalTime <= currentTime);

      if (arrivedProcesses.length === 0) {
        const nextArrivalTime = Math.min(...remainingProcesses.map(process => process.arrivalTime));
        currentTime = nextArrivalTime;
        continue;
      }

      arrivedProcesses.sort((a, b) => a.burstTime - b.burstTime);

      const shortestProcess = arrivedProcesses[0];

      const startTime = currentTime;
      const finishTime = startTime + shortestProcess.burstTime;
      schedule.push({
        name: shortestProcess.name,
        startTime: startTime,
        finishTime: finishTime,
        turnaroundTime: finishTime - shortestProcess.arrivalTime,
        waitingTime: startTime - shortestProcess.arrivalTime,
        burstTime: shortestProcess.burstTime,
        arrivalTime: shortestProcess.arrivalTime,
        color: '#017BFE',
      });

      currentTime = finishTime;
      remainingProcesses.splice(remainingProcesses.indexOf(shortestProcess), 1);
    }

    return schedule;
  };

  const runRoundRobin = (processes, quantum) => {
    const queue = processes.map((process, index) => ({ ...process }));
    let currentTime = 0;
    const schedule = [];

    while (queue.length > 0) {
      const process = queue.shift();
      const remainingTime = Math.max(0, process.burstTime - quantum);
      const startTime = Math.max(currentTime, process.arrivalTime);
      const finishTime = startTime + Math.min(process.burstTime, quantum);
      schedule.push({
        name: process.name,
        startTime: startTime,
        finishTime: finishTime,
        turnaroundTime: finishTime - process.arrivalTime,
        waitingTime: startTime - process.arrivalTime,
        burstTime: process.burstTime,
        arrivalTime: process.arrivalTime,
        color: '#017BFE',
      });
      currentTime = finishTime;

      if (remainingTime > 0) {
        queue.push({ ...process, burstTime: remainingTime });
      }
    }

    return schedule;
  };

  const runSTRF = (processes) => {
    let currentTime = 0;
    const schedule = [];
    const remainingProcesses = processes.slice();

    while (remainingProcesses.length > 0) {
      const arrivedProcesses = remainingProcesses.filter(process => process.arrivalTime <= currentTime);

      if (arrivedProcesses.length === 0) {
        const nextArrivalTime = Math.min(...remainingProcesses.map(process => process.arrivalTime));
        currentTime = nextArrivalTime;
        continue;
      }

      arrivedProcesses.sort((a, b) => a.remainingTime - b.remainingTime);

      const shortestProcess = arrivedProcesses[0];

      const startTime = currentTime;
      const finishTime = startTime + 1; // For STRF, each process executes for 1 unit of time
      shortestProcess.remainingTime--;

      schedule.push({
        name: shortestProcess.name,
        startTime: startTime,
        finishTime: finishTime,
        turnaroundTime: finishTime - shortestProcess.arrivalTime,
        waitingTime: startTime - shortestProcess.arrivalTime,
        burstTime: shortestProcess.burstTime,
        arrivalTime: shortestProcess.arrivalTime,
        color: '#017BFE',
      });

      currentTime = finishTime;

      if (shortestProcess.remainingTime === 0) {
        remainingProcesses.splice(remainingProcesses.indexOf(shortestProcess), 1);
      }
    }

    return schedule;
  };

  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : ''}`}>
      <div className="content">
        <h1><u>AlgOS : Scheduling Algorithm Simulator</u></h1>
        <div className="action-buttons">
          <button onClick={toggleDarkMode}>{darkMode ? 'Light Mode' : 'Dark Mode'}</button>
        </div>
        <div className="dropdown-section">
        <select onChange={handleAlgorithmSelect} style={{ marginRight: '10px' }}>
          <option value="">Select Scheduling Algorithm</option>
          <option value="FCFS">First Come First Serve</option>
          <option value="SJF">Shortest Job First</option>
          <option value="RR">Round Robin</option>
          <option value="STRF">Shortest Time Remaining First</option>
        </select>
        {selectedAlgorithm === 'RR' && (
          <input
            type="number"
            placeholder="Time Quantum"
            value={timeQuantum}
            onChange={handleTimeQuantumChange}  
          />
        )}
      </div>

        <div className="input-section">
          <input type="text" placeholder="Enter arrival time" ref={inputArrivalRef} />
          <input type="text" placeholder="Enter burst time" ref={inputBurstRef} />
          <button onClick={() => { addProcess(); handleButtonClick(); }}>Add Process</button>
        </div>
        {showSuccess && (
          <div style={{ backgroundColor: 'green', color: 'white', padding: '10px', marginTop: '10px' }}>
            Success! Process Added Successfully!!
          </div>
        )}
        {scheduleResult.length > 0 && (
          <div className="table-section">
            <h2>Process Details</h2>
            <table>
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
                {scheduleResult.map((process, index) => (
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
                <tr>
                  <td colSpan={5}><b>Average</b></td>
                  <td><b>{calculateAverage(scheduleResult, 'turnaroundTime')}</b></td>
                  <td><b>{calculateAverage(scheduleResult, 'waitingTime')}</b></td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
        <div className="gantt-chart-section">
          {scheduleResult.length > 0 && <GanttChart data={scheduleResult} />}
        </div>
      </div>
    </div>
  );
};

export default App;

// Helper function to calculate average
const calculateAverage = (schedule, property) => {
  const sum = schedule.reduce((acc, curr) => acc + curr[property], 0);
  return (sum / schedule.length).toFixed(2);
};
