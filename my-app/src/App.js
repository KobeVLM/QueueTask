import React, { useState } from "react";
import SetTimeOutExample from './components/SetTimeOutExample';

export default function App() {
  const [mainQueue, setMainQueue] = useState([]);
  const [queue1, setQueue1] = useState([]);
  const [queue2, setQueue2] = useState([]);
  const [queue3, setQueue3] = useState([]);
  const [highQueue, setHighQueue] = useState([]);
  
  // State to track processing status for each queue
  // Simplified: no tokens; beginner-friendly approach.

  // numbers that must always go to High Priority
  // Fibonacci numbers up to 100 (for demo purposes)
  // To get ~20% high priority numbers from 1-100, pick about 20 numbers.
  // Choose numbers spread across the range for better distribution.
  const HIGH_PRIORITY_NUMBERS = [
    3, 7, 12, 16, 21, 25, 30, 34, 39, 43,
    48, 52, 57, 61, 66, 70, 75, 79, 84, 88
  ];

  // Helper function to check if a number is high priority
  function isHighPriorityNumber(number) {
    for (let i = 0; i < HIGH_PRIORITY_NUMBERS.length; i++) {
      if (HIGH_PRIORITY_NUMBERS[i] === number) {
        return true;
      }
    }
    return false;
  }

  // Helper function to display numbers with red color for high priority
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

  // --- BUTTON HANDLERS ---
  function handleRandom() {
    const rand = Math.floor(Math.random() * 100) + 1;
    // Create a copy of the current queue and add the new number
    const newQueue = mainQueue.slice(); // copy the array
    newQueue.push(rand); // add new number to the end
    setMainQueue(newQueue);
  }

  function handleAddTask() {
    if (mainQueue.length === 0) return; // no tasks to add

    // Get the first number from main queue
    const firstNumber = mainQueue[0];
    
    // Remove the first number from main queue
    const newMainQueue = mainQueue.slice(1); // copy from position 1 to end
    setMainQueue(newMainQueue);

    // Check if the number should go to high priority
    let isHighPriority = false;
    for (let i = 0; i < HIGH_PRIORITY_NUMBERS.length; i++) {
      if (HIGH_PRIORITY_NUMBERS[i] === firstNumber) {
        isHighPriority = true;
        break;
      }
    }

    // Use the helper function instead
    if (isHighPriorityNumber(firstNumber)) {
      // Add to high priority queue
      const newHighQueue = highQueue.slice(); // copy the array
      newHighQueue.push(firstNumber); // add to the end
      setHighQueue(newHighQueue);
    } else {
      // Find the shortest normal queue
      let shortest = 1; // assume queue 1 is shortest
      if (queue2.length < queue1.length) {
        shortest = 2;
      }
      if (queue3.length < queue1.length && queue3.length < queue2.length) {
        shortest = 3;
      }

      // Add to the shortest queue
      if (shortest === 1) {
        const newQueue1 = queue1.slice(); // copy the array
        newQueue1.push(firstNumber); // add to the end
        setQueue1(newQueue1);
      } else if (shortest === 2) {
        const newQueue2 = queue2.slice(); // copy the array
        newQueue2.push(firstNumber); // add to the end
        setQueue2(newQueue2);
      } else {
        const newQueue3 = queue3.slice(); // copy the array
        newQueue3.push(firstNumber); // add to the end
        setQueue3(newQueue3);
      }
    }
  }

  // NEW: All timed removal handled by <SetTimeOutExample /> progress component.
  // When progress completes, we remove head element and bump its token so the
  // bar restarts for the next head. Adding tasks to tail will not remount the
  // component (stable key uses token, not queue length), so progress continues.

  const handleHighComplete = () => {
    setHighQueue(prev => prev.slice(1));
  };
  const handleQ1Complete = () => {
    setQueue1(prev => prev.slice(1));
  };
  const handleQ2Complete = () => {
    setQueue2(prev => prev.slice(1));
  };
  const handleQ3Complete = () => {
    setQueue3(prev => prev.slice(1));
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
          
          
          {/* High Priority Queue */}
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

          {/* Queue 1 */}
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

          {/* Queue 2 */}
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

          {/* Queue 3 */}
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

        {/* Main Content Area */}
        <div style={{ 
          flex: 1, 
          padding: "20px",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            textAlign: "center",
            padding: "40px",
            border: "2px solid #dee2e6",
            borderRadius: "12px",
            backgroundColor: "#f8f9fa",
            maxWidth: "600px"
          }}>
            <h1 style={{ margin: "0 0 20px 0", textAlign: "center", color: "#333" }}>Queue System Demo</h1>
            
            <div style={{ textAlign: "center", marginBottom: "15px" }}>
              <button onClick={handleRandom} style={{ 
                marginRight: "15px", 
                padding: "12px 24px", 
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>Add Random Task</button>
              <button onClick={handleAddTask} style={{
                padding: "12px 24px", 
                fontSize: "16px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
              }}>Admit Task</button>
            </div>
            <div>
              <h2>Task Queue</h2>
            </div>
            <div style={{ textAlign: "center", fontSize: "18px", fontWeight: "500", color: "#333" }}>
              {displayQueue(mainQueue, "")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
