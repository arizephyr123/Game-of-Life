import React, { useState, useRef, createRef, useCallback } from 'react';
import produce from 'immer';
import Rules from './Rules';
import About from './About';

const numCols = 50;
const numRows = 50;
let genCount = 0;
const empty = 'empty';
const random = 'random';
const pulsar = 'pulsar';

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

const pulsarCoords = [
  [-4, -6],
  [-3, -6],
  [-2, -6],
  [-1, -4],
  [-1, -3],
  [-1, -2],
  [-4, -1],
  [-3, -1],
  [-2, -1],
  [-6, -4],
  [-6, -3],
  [-6, -2],

  [-4, 6],
  [-3, 6],
  [-2, 6],
  [-1, 4],
  [-1, 3],
  [-1, 2],
  [-4, 1],
  [-3, 1],
  [-2, 1],
  [-6, 4],
  [-6, 3],
  [-6, 2],

  [4, 6],
  [3, 6],
  [2, 6],
  [1, 4],
  [1, 3],
  [1, 2],
  [4, 1],
  [3, 1],
  [2, 1],
  [6, 4],
  [6, 3],
  [6, 2],

  [4, -6],
  [3, -6],
  [2, -6],
  [1, -4],
  [1, -3],
  [1, -2],
  [4, -1],
  [3, -1],
  [2, -1],
  [6, -4],
  [6, -3],
  [6, -2]
];

// creates 2d array to fill grid
const starterArray = type => {
  let cols = [];
  for (let i = 0; i < numCols; i++) {
    if (type === empty) {
      cols.push(Array.from(Array(numRows), () => 0));
    }
    if (type === random) {
      cols.push(
        Array.from(Array(numRows), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }
    // if (type === pulsar) {
    //   cols.push(Array.from(Array(numRows), () => 0));
    //   console.log('cols before', cols);

    //   //   const baseX = Math.floor(numCols * 0.55);
    //   //   const baseY = Math.floor(numRows * 0.55);
    //   //   pulsarCoords.forEach(([x, y]) => {
    //   //     cols[baseX + x][baseY + y] = 1;
    //   //     console.log(
    //   //       `cols[${baseX + x}][${baseY + y}]${cols[baseX + x][baseY + y]}`
    //   //     );
    //   //     console.log('cols after', cols);
    //   //   });
    // }
  }
  genCount = 0;
  //   console.log(cols);
  return cols;
};

const clone = items => {
  items.map(item => (Array.isArray(item) ? clone(item) : item));
};

const Grid = () => {
  const [gen0, setGen0] = useState(() => starterArray(empty));

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const [speed, setSpeed] = useState(400);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const buildPulsar = useCallback(() => {
    const baseX = Math.floor(numCols * 0.55);
    const baseY = Math.floor(numRows * 0.55);
    let temp = gen0;
    for (let i = 0; i < numCols; i++) {
      for (let j = 0; j < numRows; j++) {
        pulsarCoords.forEach(([x, y]) => {
          //   temp[0][0] = 1;
          temp[baseX + x][baseY + y] = 1;
          //   console.log(
          //     `temp[${baseX + x}][${baseY + y}]${temp[baseX + x][baseY + y]}`
          //   );
        });
        // console.log('temp', temp);
        // setGen0(clone(temp));
        setGen0(clone(temp));
        // console.log('gen0', gen0);
        // console.log(`${temp == gen0 ? 'yes' : 'no'}`);
      }
    }
    return gen0;
  }, []);

  const slower = curr_speed => {
    if (curr_speed < 100) {
      setSpeed(curr_speed + 20);
    }
    if (curr_speed >= 100 && curr_speed <= 1000) {
      setSpeed(curr_speed + 100);
    } else {
      return;
    }
  };

  const faster = curr_speed => {
    if (curr_speed > 21 && curr_speed <= 100) {
      setSpeed(curr_speed - 20);
    }
    if (curr_speed > 101) {
      setSpeed(curr_speed - 100);
    } else {
      return;
    }
  };

  const aliveCount = () => {
    let count = 0;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        count += gen0[i][j];
      }
    }
    return `Alive: ${count}  Dead: ${numCols * numRows - count}`;
  };

  //    run Cycle rate is speed for setTimeout
  const runCycle = useCallback(() => {
    setGen0(arr => {
      return produce(arr, arrCopy => {
        for (let i = 0; i < numCols; i++) {
          for (let j = 0; j < numRows; j++) {
            let neighbors = 0;
            // console.log(`BEFORE (${i},${j}) neighbors -> ${neighbors}`);
            locations.forEach(([x, y]) => {
              const neighborI = (i + x + numCols) % numCols;
              const neighborJ = (j + y + numRows) % numRows;
              //   console.log(
              //     `(${neighborI},${neighborJ})-> ${arr[neighborI][neighborJ]}`
              //   );
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
          }
        }
      });
    });
    genCount += 1;
    if (!runningRef.current) {
      return;
    }
    // console.log('at Timeout speedRef.current', speedRef.current);
    return setTimeout(runCycle, speedRef.current);
  }, []);

  return (
    <div>
      <div className='stats'>
        <h4>Generation: {genCount}</h4>
        <h4>{aliveCount()}</h4>
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
          {running ? 'Stop' : 'Start'}
        </button>
        <button
          onClick={() => {
            runCycle();
          }}
        >
          Next
        </button>
        <button
          onClick={() => {
            setGen0(starterArray(random));
            // console.log(`random-> ${gen0}`);
          }}
        >
          Random
        </button>
        <button onClick={() => setGen0(buildPulsar())}>Pulsar</button>
        {/* <button onClick={() => setGen0(starterArray(pulsar))}>Pulsar</button> */}
        <button
          onClick={() => {
            setGen0(starterArray(empty));
            // console.log(`clear-> ${gen0}`);
          }}
        >
          Clear
        </button>
        <div>
          <h5>Speed</h5>
          <button onClick={() => slower(speedRef.current)}>-</button>
          <button onClick={() => faster(speedRef.current)}>+</button>
        </div>
      </div>
      <Rules />
      <About />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 10px)`
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
                width: 10,
                height: 10,
                backgroundColor: gen0[i][j] ? '#42BF0F' : '#890409',
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
