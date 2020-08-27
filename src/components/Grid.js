import React, { useState, useRef, useCallback } from 'react';
import produce from 'immer';

const numCols = 5;
const numRows = 5;
let genCount = 0;
const empty = 'empty';
const random = 'random';

// list of neighbor positions
// [x, y] => [col, row]
const locations = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1]
];

// creates 2d array to fill grid
const starterArray = type => {
  const cols = [];
  for (let i = 0; i < numCols; i++) {
    if (type == empty) {
      cols.push(Array.from(Array(numRows), () => 0));
    }
    if (type == random) {
      cols.push(
        Array.from(Array(numRows), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }
  }
  genCount = 0;
  console.log(cols);
  return cols;
};

const clone = items => {
  items.map(item => (Array.isArray(item) ? clone(item) : item));
};

const Grid = () => {
  const [gen0, setGen0] = useState(() => starterArray(empty));
  const [gen1, setGen1] = useState(gen0);
  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  /*
  const displayGrid = () => {
    return gen0.map((cols, i) =>
      cols.map((cols, j) => (
        <div
          key={`${i}-${j}`}
          onClick={() => {
            if (running) {
              console.log('cannot click');
              return;
            }
            const newGrid = produce(gen0, gen1 => {
              gen1[i][j] = gen0[i][j] ? 0 : 1;
            });
            setGen0(newGrid);
          }}
          style={{
            width: 20,
            height: 20,
            backgroundColor: gen0[i][j] ? 'pink' : undefined,
            border: 'solid 1px black'
          }}
        ></div>
      ))
    );
  };
  */

  const runCycle = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    setGen0(arr => {
      // ================
      return produce(arr, arrCopy => {
        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
            let neighbors = 0;
            console.log(`BEFORE (${i},${j}) neighbors -> ${neighbors}`);
            locations.forEach(([x, y]) => {
              const neighborI = (i + x + numCols) % numCols;
              const neighborJ = (j + y + numRows) % numRows;
              console.log(
                `(${neighborI},${neighborJ})-> ${arr[neighborI][neighborJ]}`
              );
              neighbors += arr[neighborI][neighborJ];
              // If an organisim has 2 or 3 neighbors, then it remains alive in the next generation. Else it dies.
              if (arr[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                arrCopy[i][j] = 0;
              }
              // If an organisim is dead and has exactly 3 neigbors, then it comes back to life in the next generation. Else it stays dead
              else if (arr[i][j] === 0 && neighbors === 3) {
                arrCopy[i][j] = 1;
              } else {
                arrCopy[i][j] = arr[i][j];
              }
            });
            setGen1(clone(arrCopy));
            console.log(`(${i},${j}) neighbors -> ${neighbors}`);
            console.log('gen0(arr) ->', arr);
            console.log('gen1(arrCopy) ->', gen1);
          }
        }
      });
    });
    console.log('at Timeout');
    // setTimeout(runCycle, 400);
  }, []);

  return (
    <div>
      <div className='stats'>
        <h4>Generation: {genCount}</h4>
        {/* {() => aliveCount()} */}
        <button
          onClick={() => {
            setRunning(!running);
            if (running == false) {
              runningRef.current = true;
              //   runSim();
              runCycle();
            }
          }}
        >
          {`running? -> ${running} ==== runningRef -> ${runningRef.current}`}
          {/* {running ? 'Stop' : 'Start'} */}
        </button>
        <button
          onClick={() => {
            setGen0(starterArray(random));
            console.log(`random-> ${gen0}`);
          }}
        >
          random
        </button>
        <button
          onClick={() => {
            setGen0(starterArray(empty));
            console.log(`clear-> ${gen0}`);
          }}
        >
          clear
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {gen0.map((cols, i) =>
          cols.map((rows, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                if (running) {
                  console.log('cannot click');
                  return;
                }
                const newGrid = produce(gen0, gen1 => {
                  gen1[i][j] = gen0[i][j] ? 0 : 1;
                });
                setGen0(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: gen0[i][j] ? 'pink' : undefined,
                border: 'solid 1px black'
              }}
            ></div>
          ))
        )}
      </div>
    </div>
  );
};

export default Grid;
