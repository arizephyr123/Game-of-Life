import React, { useState, useRef, createRef, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import produce from 'immer';
import AboutModal from './AboutModal';
import RulesModal from './RulesModal';
import pulsarCoords from '../preset_cell_configs/pulsar';
import heartsCoords from '../preset_cell_configs/hearts';
import mothCoords from '../preset_cell_configs/moth';
import sixXtwoCoords from '../preset_cell_configs/sixXtwo';
import '../styles/Grid.css';

const numCols = 50;
const numRows = 50;
let genCount = 0;
const empty = 'empty';
const random = 'random';
const pulsar = 'pulsar';
const hearts = 'hearts';
const moth = 'moth';
const sixXtwo = 'sixXtwo';

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
    if (type === pulsar) {
      cols.push(Array.from(Array(numRows), () => 0));
      const baseX = Math.floor(numCols * 0.47);
      const baseY = Math.floor(numRows * 0.47);
      const newCoords = [];
      pulsarCoords.forEach(([x, y]) => {
        x = x + baseX;
        y = y + baseY;
        newCoords.push([x, y]);
      });
      //   console.log(newCoords.length);
      //   console.log(pulsarCoords.length);
      newCoords.forEach(([x, y]) => {
        if (i === x) {
          cols[i][y] = 1;
        }
      });
    }

    if (type === hearts) {
      cols.push(Array.from(Array(numRows), () => 0));
      const baseX = Math.floor(numCols * 0.5);
      const baseY = Math.floor(numRows * 0.5);
      const newCoords = [];
      heartsCoords.forEach(([x, y]) => {
        x = x + baseX;
        y = y + baseY;
        newCoords.push([x, y]);
      });
      newCoords.forEach(([x, y]) => {
        if (i === x) {
          cols[i][y] = 1;
        }
      });
    }
    if (type === moth) {
      cols.push(Array.from(Array(numRows), () => 0));
      const baseX = Math.floor(numCols * 0.5);
      const baseY = Math.floor(numRows * 0.5);
      const newCoords = [];
      mothCoords.forEach(([x, y]) => {
        x = x + baseX;
        y = y + baseY;
        newCoords.push([x, y]);
      });
      newCoords.forEach(([x, y]) => {
        if (i === x) {
          cols[i][y] = 1;
        }
      });
    }
    if (type === sixXtwo) {
      cols.push(Array.from(Array(numRows), () => 0));
      const baseX = Math.floor(numCols * 0.4);
      const baseY = Math.floor(numRows * 0.4);
      const newCoords = [];
      sixXtwoCoords.forEach(([x, y]) => {
        x = x + baseX;
        y = y + baseY;
        newCoords.push([x, y]);
      });
      newCoords.forEach(([x, y]) => {
        if (i === x) {
          cols[i][y] = 1;
        }
      });
    }
  }
  genCount = 0;
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

  const [aboutModalShow, setAboutModalShow] = useState(false);
  const [rulesModalShow, setRulesModalShow] = useState(false);

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
    <div className='grid_container'>
      <div className='stats'>
        <h4>Generation: {genCount}</h4>
        <h4>{aliveCount()}</h4>
      </div>
      <div className='controls'>
        <button
          onClick={() => {
            setRunning(!running);
            if (running == false) {
              runningRef.current = true;
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
            setGen0(starterArray(empty));
            // console.log(`clear-> ${gen0}`);
          }}
        >
          Clear
        </button>
      </div>
      <div className='presets'>
        <button
          onClick={() => {
            setGen0(starterArray(random));
            // console.log(`random-> ${gen0}`);
          }}
        >
          Random
        </button>
        <button onClick={() => setGen0(starterArray(pulsar))}>Pulsar</button>
        <button onClick={() => setGen0(starterArray(hearts))}>Hearts</button>
        <button onClick={() => setGen0(starterArray(moth))}>Moth</button>
        <button onClick={() => setGen0(starterArray(sixXtwo))}>6 x 2</button>
      </div>

      <div className='speed'>
        <h5>Speed</h5>
        <button onClick={() => slower(speedRef.current)}>-</button>
        <button onClick={() => faster(speedRef.current)}>+</button>
      </div>
      <div className='info'>
        <div className='about'>
          <Button
            variant='primary'
            onClick={() => {
              setAboutModalShow(true);
            }}
          >
            About
          </Button>

          <AboutModal
            show={aboutModalShow}
            onHide={() => setAboutModalShow(false)}
          />
        </div>
        <div className='rules'>
          <Button
            variant='primary'
            onClick={() => {
              setRulesModalShow(true);
            }}
          >
            Rules
          </Button>

          <RulesModal
            show={rulesModalShow}
            onHide={() => setRulesModalShow(false)}
          />
        </div>
      </div>
      <div
        className='grid'
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 10px)`
        }}
      >
        {gen0.map((cols, i) =>
          cols.map((rows, j) => (
            <div
              className='cell'
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
