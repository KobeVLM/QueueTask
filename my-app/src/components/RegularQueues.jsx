import React from "react";
import SetTimeOutExample from './SetTimeOutExample';

export default function RegularQueues({ queues, onComplete, displayQueue }) {
  return (
    <>
      {queues.map((queue, index) => (
        <div key={`regular-${index}`} style={{ height: "20%", borderBottom: index < queues.length - 1 ? "4px solid #000000ff" : "none", display: "flex", flexDirection: "column" }}>
          <h3>Regular Queue {index + 1}</h3>
          <div>
            {queue.length === 0 ? (
              <span style={{fontStyle: "italic"}}>Empty</span>
            ) : (
              displayQueue(queue, "")
            )}
          </div>
          <div>
            <h4>Duration</h4>
            <div>
              {queue.length > 0 ? (
                <SetTimeOutExample onComplete={() => onComplete(index)} />
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
