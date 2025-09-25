import React, { useState } from "react";
import { Button } from '@mui/material';
import SetTimeOutExample from './components/SetTimeOutExample';
import HighPriorityQueues from './components/HighPriorityQueues';
import RegularQueues from './components/RegularQueues';

export default function App() {
  const [mainQueue, setMainQueue] = useState([]);
  const [highPriorityQueues, setHighPriorityQueues] = useState([[], []]); // high priority queues
  const [regularQueues, setRegularQueues] = useState([[], [], []]); // regular queues

  const HIGH_PRIORITY_NUMBERS = [
    3, 7, 12, 16, 21, 25, 30, 34, 39, 43,
    48, 52, 57, 61, 66, 70, 75, 79, 84, 88
  ];

  function isHighPriorityNumber(number) {
    for (let i = 0; i < HIGH_PRIORITY_NUMBERS.length; i++) {
      if (HIGH_PRIORITY_NUMBERS[i] === number) {
        return true;
      }
    }
    return false;
  }

  function displayQueue(queue, queueName) {
    if (queue.length === 0) {
      return queueName + "";
    }
    
    const numbersDisplay = [];
    for (let i = 0; i < queue.length; i++) {
      const number = queue[i];
      if (isHighPriorityNumber(number)) {
        numbersDisplay.push(
          <span style={{ color: "red", fontWeight: "bold" }}>
            {number}
          </span> 
        );
      } else {
        numbersDisplay.push(<span>{number}</span>);
      }
      if (i < queue.length - 1) {
        numbersDisplay.push(<span>, </span>);
      }
    }

    return (
      <span>
        {queueName} {numbersDisplay}
      </span>
    );
  }

  function handleRandom() {
    const rand = Math.floor(Math.random() * 100) + 1;
    const newQueue = mainQueue.slice();
    newQueue.push(rand);
    setMainQueue(newQueue);
  }

  function handleAddTask() {
    if (mainQueue.length === 0) return;

    const firstNumber = mainQueue[0];
    const newMainQueue = mainQueue.slice(1);
    setMainQueue(newMainQueue);

    if (isHighPriorityNumber(firstNumber)) {
      // Find the shortest high priority queue
      let shortestHighIndex = 0;
      let shortestHighLength = highPriorityQueues[0].length;
      
      for (let i = 1; i < highPriorityQueues.length; i++) {
        if (highPriorityQueues[i].length < shortestHighLength) {
          shortestHighIndex = i;
          shortestHighLength = highPriorityQueues[i].length;
        }
      }
      
      // Add to the shortest high priority queue
      const newHighQueues = [...highPriorityQueues];
      newHighQueues[shortestHighIndex] = [...newHighQueues[shortestHighIndex], firstNumber];
      setHighPriorityQueues(newHighQueues);
    } else {
      // Find the shortest regular queue
      let shortestRegularIndex = 0;
      let shortestRegularLength = regularQueues[0].length;
      
      for (let i = 1; i < regularQueues.length; i++) {
        if (regularQueues[i].length < shortestRegularLength) {
          shortestRegularIndex = i;
          shortestRegularLength = regularQueues[i].length;
        }
      }
      
      // Add to the shortest regular queue
      const newRegularQueues = [...regularQueues];
      newRegularQueues[shortestRegularIndex] = [...newRegularQueues[shortestRegularIndex], firstNumber];
      setRegularQueues(newRegularQueues);
    }
  }

  // Complete Handler for High Priority Queues
  const handleHighComplete = (queueIndex) => {
    setHighPriorityQueues(prev => {
      const newQueues = [...prev];
      newQueues[queueIndex] = newQueues[queueIndex].slice(1);
      return newQueues;
    });
  };

  // Complete Handler for Regular Queues
  const handleRegularComplete = (queueIndex) => {
    setRegularQueues(prev => {
      const newQueues = [...prev];
      newQueues[queueIndex] = newQueues[queueIndex].slice(1);
      return newQueues;
    });
  };

  return (
    <div style={{
      fontFamily: "sans-serif",
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      backgroundColor: "#f8f9fa"
    }}>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{
          width: "400px",
          backgroundColor: "#ffffff",
          borderRight: "3px solid #dee2e6",
          padding: "20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          height: "100vh"
        }}>
          {/* High Priority Queues */}
          <HighPriorityQueues 
            queues={highPriorityQueues}
            onComplete={handleHighComplete}
            displayQueue={displayQueue}
          />

          {/* Regular Queues */}
          <RegularQueues 
            queues={regularQueues}
            onComplete={handleRegularComplete}
            displayQueue={displayQueue}
          />
        </div>

        <div style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#ffffff"
        }}>
          <div>
            <h1>Queue System Demo</h1>
            <div>
              <Button
                variant="contained"
                color="success"
                onClick={handleRandom}
                sx={{ marginRight: "15px", padding: "12px 24px", fontSize: "16px" }}
              >
                Add Random Task
              </Button>
            </div>
            <div>
              <h2>Task Queue</h2>
            </div>
            <div>
              {displayQueue(mainQueue, "")}
            </div>
            <div style={{ marginTop: "20px" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleAddTask}
                sx={{ padding: "12px 24px", fontSize: "16px" }}
              >
                Admit Task
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
