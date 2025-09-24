import React, { useState } from "react";
import { Button } from '@mui/material';
import SetTimeOutExample from './components/SetTimeOutExample';

export default function App() {
  // State arrays to store tasks for each queue
  const [mainQueue, setMainQueue] = useState([]);  // Holds new tasks before distribution
  const [queue1, setQueue1] = useState([]);        // Regular priority queue 1
  const [queue2, setQueue2] = useState([]);        // Regular priority queue 2
  const [queue3, setQueue3] = useState([]);        // Regular priority queue 3
  const [highQueue, setHighQueue] = useState([]);  // High priority queue
  
  // Array of numbers that should be treated as high priority
  const HIGH_PRIORITY_NUMBERS = [
    3, 7, 12, 16, 21, 25, 30, 34, 39, 43,
    48, 52, 57, 61, 66, 70, 75, 79, 84, 88
  ];

  // Check if a number should go to high priority queue
  function isHighPriorityNumber(number) {
    for (let i = 0; i < HIGH_PRIORITY_NUMBERS.length; i++) {
      if (HIGH_PRIORITY_NUMBERS[i] === number) {
        return true;
      }
    }
    return false;
  }

  // Display queue contents with red styling for high priority numbers
  function displayQueue(queue, queueName) {
    if (queue.length === 0) {
      return queueName + "";
    }
    
    const numbersDisplay = [];
    for (let i = 0; i < queue.length; i++) {
      const number = queue[i];
      if (isHighPriorityNumber(number)) {
        // High priority numbers are displayed in red and bold
        numbersDisplay.push(
          <span style={{ color: "red", fontWeight: "bold" }}>
            {number}
          </span>
        );
      } else {
        numbersDisplay.push(<span>{number}</span>);
      }
      
      // Add comma between numbers (but not after the last one)
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

  // Button handler: Add Random Task
  // Generates a random number (1-100) and adds it to the main queue
  function handleRandom() {
    const rand = Math.floor(Math.random() * 100) + 1;  // Generate random number 1-100
    const newQueue = mainQueue.slice();  // Create a copy of current main queue
    newQueue.push(rand);  // Add new random number to end of queue
    setMainQueue(newQueue);  // Update state with new queue
  }

  // Button handler: Admit Task 
  // Takes first task from main queue and distributes it to appropriate processing queue
  function handleAddTask() {
    if (mainQueue.length === 0) return;  // Exit if no tasks to process

    const firstNumber = mainQueue[0];  // Get the first task (FIFO - First In, First Out)
    
    // Remove the first task from main queue
    const newMainQueue = mainQueue.slice(1);  // Create new array starting from index 1
    setMainQueue(newMainQueue);  // Update main queue state

    // Check if task should go to high priority queue
    let isHighPriority = false;
    for (let i = 0; i < HIGH_PRIORITY_NUMBERS.length; i++) {
      if (HIGH_PRIORITY_NUMBERS[i] === firstNumber) {
        isHighPriority = true;
        break;  // Found match, exit loop early
      }
    }

    // Route task to appropriate queue based on priority
    if (isHighPriorityNumber(firstNumber)) {
      // High priority: Add to high priority queue
      const newHighQueue = highQueue.slice();  // Copy current high priority queue
      newHighQueue.push(firstNumber);  // Add task to end of queue
      setHighQueue(newHighQueue);  // Update high priority queue state
    } else {
      // Regular priority: Find shortest regular queue for load balancing
      let shortest = 1;  // Start by assuming queue1 is shortest
      if (queue2.length < queue1.length) {
        shortest = 2;  // Queue2 is shorter than queue1
      }
      if (queue3.length < queue1.length && queue3.length < queue2.length) {
        shortest = 3;  // Queue3 is shortest of all
      }

      // Add task to the shortest regular queue
      if (shortest === 1) {
        const newQueue1 = queue1.slice();  // Copy queue1
        newQueue1.push(firstNumber);  // Add task to end
        setQueue1(newQueue1);  // Update queue1 state
      } else if (shortest === 2) {
        const newQueue2 = queue2.slice();  // Copy queue2
        newQueue2.push(firstNumber);  // Add task to end
        setQueue2(newQueue2);  // Update queue2 state
      } else {
        const newQueue3 = queue3.slice();  // Copy queue3
        newQueue3.push(firstNumber);  // Add task to end
        setQueue3(newQueue3);  // Update queue3 state
      }
    }
  }

  // TASK DELETION LOGIC: These functions handle automatic task removal
  // Each function is called when the SetTimeOutExample progress bar completes
  // They remove the FIRST task (head) from each queue using slice(1)
  
  // High Priority Queue: Remove completed task (first in line)
  const handleHighComplete = () => {
    setHighQueue(prev => prev.slice(1));  // Remove index 0, keep rest of array
  };
  
  // Regular Queue 1: Remove completed task (first in line)
  const handleQ1Complete = () => {
    setQueue1(prev => prev.slice(1));  // Remove index 0, keep rest of array
  };
  
  // Regular Queue 2: Remove completed task (first in line)
  const handleQ2Complete = () => {
    setQueue2(prev => prev.slice(1));  // Remove index 0, keep rest of array
  };
  
  // Regular Queue 3: Remove completed task (first in line)
  const handleQ3Complete = () => {
    setQueue3(prev => prev.slice(1));  // Remove index 0, keep rest of array
  };

  return (
    <div style={{ 
      fontFamily: "sans-serif", 
      minHeight: "100vh",
      margin: 0,
      padding: 0,
      backgroundColor: "#f8f9fa"
    }}>
      {/* Main Content Area */}
      <div style={{ display: "flex", height: "100vh" }}>
        {/* Left Sidebar - 4 Queues */}
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
          
          <div style={{ height: "25%", borderBottom: "4px solid #000000ff", display: "flex", flexDirection: "column" }}>
            <h3>High Priority Queue 1</h3>
            <div>
              {highQueue.length === 0 ? (
                <span style={{fontStyle: "italic"}}>Empty</span>
              ) : (
                displayQueue(highQueue, "")
              )}
            </div>
            <div>
              <h4>Duration</h4>
              <div>
                {highQueue.length > 0 ? (
                  <SetTimeOutExample onComplete={handleHighComplete} />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>

          <div style={{ height: "25%", borderBottom: "4px solid #000000ff", display: "flex", flexDirection: "column" }}>
            <h3>Regular Queue 2</h3>
            <div>
              {queue1.length === 0 ? (
                <span style={{fontStyle: "italic"}}>Empty</span>
              ) : (
                displayQueue(queue1, "")
              )}
            </div>
            <div>
              <h4>Duration</h4>
              <div>
                {queue1.length > 0 ? (
                  <SetTimeOutExample onComplete={handleQ1Complete} />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>

          <div style={{ height: "25%", borderBottom: "4px solid #000000ff", display: "flex", flexDirection: "column" }}>
            <h3>Regular Queue 3</h3>
            <div>
              {queue2.length === 0 ? (
                <span style={{fontStyle: "italic"}}>Empty</span>
              ) : (
                displayQueue(queue2, "")
              )}
            </div>
            <div>
              <h4>Duration</h4>
              <div>
                {queue2.length > 0 ? (
                  <SetTimeOutExample onComplete={handleQ2Complete} />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>

          <div style={{ height: "25%", display: "flex", flexDirection: "column" }}>
            <h3>Regular Queue 4</h3>
            <div>
              {queue3.length === 0 ? (
                <span style={{fontStyle: "italic"}}>Empty</span>
              ) : (
                displayQueue(queue3, " ")
              )}
            </div>
            <div>
              <h4>Duration</h4>
              <div>
                {queue3.length > 0 ? (
                  <SetTimeOutExample onComplete={handleQ3Complete} />
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
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
