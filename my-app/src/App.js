import React, { useState } from "react";
import { Button } from '@mui/material';
import SetTimeOutExample from './components/SetTimeOutExample';

export default function App() {
  const [mainQueue, setMainQueue] = useState([]);
  const [queue1, setQueue1] = useState([]);
  const [queue2, setQueue2] = useState([]);
  const [queue3, setQueue3] = useState([]);
  const [highQueue, setHighQueue] = useState([]);

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

    let isHighPriority = false;
    for (let i = 0; i < HIGH_PRIORITY_NUMBERS.length; i++) {
      if (HIGH_PRIORITY_NUMBERS[i] === firstNumber) {
        isHighPriority = true;
        break;
      }
    }

    if (isHighPriorityNumber(firstNumber)) {
      const newHighQueue = highQueue.slice();
      newHighQueue.push(firstNumber);
      setHighQueue(newHighQueue);
    } else {
      let shortest = 1;
      if (queue2.length < queue1.length) {
        shortest = 2;
      }
      if (queue3.length < queue1.length && queue3.length < queue2.length) {
        shortest = 3;
      }

      if (shortest === 1) {
        const newQueue1 = queue1.slice();
        newQueue1.push(firstNumber);
        setQueue1(newQueue1);
      } else if (shortest === 2) {
        const newQueue2 = queue2.slice();
        newQueue2.push(firstNumber);
        setQueue2(newQueue2);
      } else {
        const newQueue3 = queue3.slice();
        newQueue3.push(firstNumber);
        setQueue3(newQueue3);
      }
    }
  }

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
