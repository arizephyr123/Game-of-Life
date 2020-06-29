import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef
} from 'react';

const numRows = 5;
const numCols = 5;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0]
];

let genCount = 0;
const empty = 'empty';
const random = 'random';

const buildGrid = type => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    if (type === empty) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    if (type === random) {
      rows.push(
        Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
      );
    }
  }
  return rows;
};

const Grid2 = () => {
  // gen0, displayed
  const [gen0, setGen0] = useState(() => {
    return buildGrid(empty);
  });

  //gen1, buffer in background
  const [gen1, setGen1] = useState(() => {
    return buildGrid(empty);
  });

  const [running, setRunning] = useState(false);
  const runRef = useRef(running);
  runRef.current = running;
  //   const runRefC = createRef(running);
  //   runRefC.current = running;

  // For Testing -- to delete =======================

  const BufferGrid = useCallback(msg => {
    return gen1.map((rows, i) =>
      rows.map((col, j) => (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: gen1[i][j] == 1 ? 'black' : 'white',
            border: 'solid 1px black'
          }}
          key={`${i}-${j}`}
        />
      ))
    );
  });

  // ========================

  const clearGrid = () => {
    setGen0(() => {
      return buildGrid(empty);
    });
    setGen1(() => {
      return buildGrid(empty);
    });
    genCount = 0;
    return fillGrid('clear'), BufferGrid('');
  };

  const randomGrid = () => {
    setGen0(() => {
      return buildGrid(random);
    });
    genCount = 0;
    return fillGrid('random'), BufferGrid('');
  };

  const clone = items =>
    items.map(item => (Array.isArray(item) ? clone(item) : item));

  // fillGrid will always display gen0, gen1 hidden in background
  const fillGrid = useCallback(msg => {
    return gen0.map((rows, i) =>
      rows.map((col, j) => (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: gen0[i][j] == 1 ? 'green' : 'red',
            border: 'solid 1px black'
          }}
          key={`${i}-${j}`}
          onClick={() => {
            // console.log(`(${i},${j})==> ${gen0[i][j]}`);
            if (running) {
              // if (!runRef) {
              console.log('**cant click**');
              return;
            } else {
              gen0[i][j] = gen0[i][j] === 1 ? 0 : 1;

              const gridCopy = clone(gen0);
              setGen0(gridCopy);
              return fillGrid('fillGrid onClick'), BufferGrid('');
            }
          }}
        />
      ))
    );
  });

  const runCycle = () => {
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;
        operations.forEach(([x, y]) => {
          const neighborI = (i + x + numRows) % numRows;
          const neighborJ = (j + y + numCols) % numCols;

          neighbors += gen0[neighborI][neighborJ];
        });
        // If an organisim is dead and has exactly 3 neigbors, then it comes back to life in the next generation. Else it stays dead
        if (gen0[i][j] === 0 && neighbors === 3) {
          gen1[i][j] = 1;
        }
        // If an organisim is alive and has 2 or 3 neighbors, then it remains alive in the next generation. Else it dies.
        else if (gen0[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
          gen1[i][j] = 0;
        } else {
          gen1[i][j] = gen0[i][j];
        }
      }
    }

    setGen1(() => clone(gen1));
    setGen0(gen1);
    genCount += 1;

    return fillGrid('runCycle'), BufferGrid('');
  };

  const aliveCount = () => {
    let sum = 0;
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        sum += gen0[i][j];
      }
    }
    return `Alive: ${sum}  Dead: ${numCols * numRows - sum}`;
  };

  const runSim = () => {
    console.log(`after = running ${running}, runRef.current ${runRef.current}`);
    if (running === true) {
      console.log('in while running');
      console.log(`running ${running}, runRef.current ${runRef.current}`);
      setTimeout(runCycle, 600);
    } else {
      console.log(
        `out of running=> running ${running}, runRef.current ${runRef.current}`
      );
    }
    //
    return;
  };

  //   const runSim = useCallback(ms => {
  //     console.log(
  //       `before state= running ${running}, runRef.current ${runRef.current}`
  //     );
  //     setRunning(!running);
  //     console.log(`after = running ${running}, runRef.current ${runRef.current}`);
  //     if (!running) {
  //       console.log(`A = running ${running}, runRef.current ${runRef.current}`);
  //       return;
  //     } else {
  //       if (!ms) {
  //         ms = 600;
  //       }
  //       console.log(`running ${running}, runRef.current ${runRef.current}`);
  //       // console.log(
  //       //   `running ${running}\nrunRef ${runRef.current}\nrunRefCreate ${runRefC.current}`
  //       // );}

  //       setTimeout(runCycle, ms);
  //     }
  //   });

  //   useEffect(() => {
  //     runSim();
  //   }, [running]);

  useEffect(() => {
    fillGrid('useEffect');
  }, [gen0, fillGrid]);

  return (
    <>
      <div>{`Generation: ${genCount}`}</div>
      {aliveCount()}
      <div className='controls'>
        <button onClick={runCycle}>Next</button>
        <button
          //   onClick={runSim}
          onClick={() => {
            setRunning(!running);
            if (running === true) {
              runSim();
            }
          }}
        >
          {/* {!running ? 'Start' : 'Stop'} */}
          {!running ? `${running}` : `${running}`}
        </button>
        <button
          onClick={randomGrid}
          style={{ display: running ? 'none' : 'inline' }}
        >
          Random
        </button>
        <button
          onClick={clearGrid}
          style={{ display: running ? 'none' : 'inline' }}
        >
          Clear
        </button>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {fillGrid('render')}
        {/* {BufferGrid('render')} */}
      </div>
    </>
  );
};

export default Grid2;
