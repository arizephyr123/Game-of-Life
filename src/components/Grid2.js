import React, { useState, useRef, useCallback } from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
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
const wrap = 'wrap';
const closed = 'closed';
const open = 'open';

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
      console.log(type);
      cols.push(Array.from(Array(numRows), () => 0));
      const baseX = Math.floor(numCols * 0.47);
      const baseY = Math.floor(numRows * 0.47);
      const newCoords = [];
      pulsarCoords.forEach(([x, y]) => {
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

const Grid2 = () => {
  const [gen0, setGen0] = useState(() => starterArray(empty));

  const [running, setRunning] = useState(false);
  const runningRef = useRef(running);
  runningRef.current = running;

  const [speed, setSpeed] = useState(400);
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const [boundries, setBoundries] = useState(wrap);
  const boundriesRef = useRef(boundries);
  boundriesRef.current = boundries;

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
    return (
      <div className='counts'>
        <div className='alive-count'>
          <h5>{`Alive: ${count}`}</h5>
        </div>
        <div className='dead-count'>
          <h5>{`Dead: ${numCols * numRows - count}`}</h5>
        </div>
      </div>
    );
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
    <div className='container'>
      <div className='grid-container'>
        <div
          className='grid'
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${numCols}, 15px)`
          }}
        >
          {gen0.map((cols, i) =>
            cols.map((rows, j) => (
              <div
                className={gen0[i][j] ? 'cell alive' : 'cell'}
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
              ></div>
            ))
          )}
        </div>
      </div>
      <div className='non-grid'>
        <div className='stats'>
          <h4>Generations: {genCount}</h4>
          <h5>{aliveCount()}</h5>
        </div>
        <div className='controls'>
          <Button
            onClick={() => {
              setRunning(!running);
              if (running == false) {
                runningRef.current = true;
                runCycle();
              }
            }}
          >
            {running ? 'Stop' : 'Start'}
          </Button>
          <Button
            disabled={running}
            onClick={() => {
              runCycle();
            }}
          >
            Next
          </Button>

          <Button
            disabled={running}
            onClick={() => {
              setGen0(starterArray(empty));
            }}
          >
            Clear
          </Button>
        </div>
        <div className='speed-box'>
          <h5>Speed</h5>
          <div className='speed-btns'>
            <Button
              className='speed-btn'
              onClick={() => slower(speedRef.current)}
            >
              -
            </Button>
            <Button
              diabled={speedRef.current >= 100}
              className='speed-btn'
              onClick={() => faster(speedRef.current)}
            >
              +
            </Button>
          </div>
        </div>

        <div className='boundries-box'>
          <h5>Grid Boundries</h5>
          <div className='boundry-btns'>
            {/* <ButtonGroup> */}
            <Button
              className='boundry-btn'
              block={true}
              active={boundriesRef.current === wrap}
              onClick={() => {
                setBoundries(wrap);
                if (boundries != wrap) {
                  boundriesRef.current = wrap;
                }
                console.log('Wrap selected', boundriesRef.current);
              }}
            >
              Wrap
            </Button>
            <Button
              block={true}
              active={boundriesRef.current === closed}
              className='boundry-btn'
              onClick={() => {
                setBoundries(closed);
                if (boundries != closed) {
                  boundriesRef.current = closed;
                }
                console.log('closed selected', boundriesRef.current);
              }}
            >
              Closed
            </Button>
            <Button
              block={false}
              active={boundriesRef.current === open}
              className='boundry-btn'
              onClick={() => {
                setBoundries(open);
                if (boundries != open) {
                  boundriesRef.current = open;
                }
                console.log('open selected', boundriesRef.current);
              }}
            >
              Open
            </Button>
            {/* </ButtonGroup> */}
          </div>
        </div>

        <div className='presets'>
          <h5>Preset Patterns</h5>
          <div className='preset-btns'>
            <Button
              onClick={() => {
                setGen0(starterArray(random));
              }}
            >
              Random
            </Button>
            <Button onClick={() => setGen0(starterArray(pulsar))}>
              Pulsar
            </Button>
            <Button onClick={() => setGen0(starterArray(hearts))}>
              Hearts
            </Button>
            <Button onClick={() => setGen0(starterArray(moth))}>Moth</Button>
            <Button onClick={() => setGen0(starterArray(sixXtwo))}>
              6 x 2
            </Button>
          </div>
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
      </div>
    </div>
  );
};

export default Grid2;
