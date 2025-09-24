import React, { useState, useEffect } from "react";

export default function App() {
  const [mainQueue, setMainQueue] = useState([]);
  const [queue1, setQueue1] = useState([]);
  const [queue2, setQueue2] = useState([]);
  const [queue3, setQueue3] = useState([]);
  const [highQueue, setHighQueue] = useState([]);

  // numbers that must always go to High Priority
  const HIGH_PRIORITY_NUMBERS = [20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

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
      return queueName + ": ";
    }
    
    const numbersDisplay = [];
    for (let i = 0; i < queue.length; i++) {
      const number = queue[i];
      if (isHighPriorityNumber(number)) {
        numbersDisplay.push(
          <span key={i} style={{ color: "red", fontWeight: "bold" }}>
            {number}
          </span>
        );
      } else {
        numbersDisplay.push(<span key={i}>{number}</span>);
      }
      
      // Add comma between numbers (but not after the last one)
      if (i < queue.length - 1) {
        numbersDisplay.push(<span key={`comma-${i}`}>, </span>);
      }
    }
    
    return (
      <span>
        {queueName}: {numbersDisplay}
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

  // --- PROCESSING ---
  useEffect(() => {
    // Process Queue 1: remove first task after N seconds
    if (queue1.length > 0) {
      const task = queue1[0]; // get first number
      const timer = setTimeout(() => {
        const newQueue1 = queue1.slice(1); // remove first item (copy from position 1 to end)
        setQueue1(newQueue1);
      }, task * 100); // wait for task number * 100 milliseconds
      return () => clearTimeout(timer);
    }
  }, [queue1]);

  useEffect(() => {
    // Process Queue 2: remove first task after N seconds
    if (queue2.length > 0) {
      const task = queue2[0]; // get first number
      const timer = setTimeout(() => {
        const newQueue2 = queue2.slice(1); // remove first item
        setQueue2(newQueue2);
      }, task * 100);
      return () => clearTimeout(timer);
    }
  }, [queue2]);

  useEffect(() => {
    // Process Queue 3: remove first task after N seconds
    if (queue3.length > 0) {
      const task = queue3[0]; // get first number
      const timer = setTimeout(() => {
        const newQueue3 = queue3.slice(1); // remove first item
        setQueue3(newQueue3);
      }, task * 100);
      return () => clearTimeout(timer);
    }
  }, [queue3]);

  useEffect(() => {
    // Process High Priority Queue: remove first task after N seconds
    if (highQueue.length > 0) {
      const task = highQueue[0]; // get first number
      const timer = setTimeout(() => {
        const newHighQueue = highQueue.slice(1); // remove first item
        setHighQueue(newHighQueue);
      }, task * 100);
      return () => clearTimeout(timer);
    }
  }, [highQueue]);

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h1>Queue System Demo</h1>

      <button onClick={handleRandom}>Click Random</button>
      <button onClick={handleAddTask}>Add Task</button>

      <h3>{displayQueue(mainQueue, "Main Queue")}</h3>

      <div>{displayQueue(queue1, "Normal Queue 1")}</div>
      <div>{displayQueue(queue2, "Normal Queue 2")}</div>
      <div>{displayQueue(queue3, "Normal Queue 3")}</div>

      <div>{displayQueue(highQueue, "High Priority Queue")}</div>
    </div>
  );
}
