import React, { useState, useEffect, useCallback, useRef } from 'react';

const numRows = 3;
const numCols = 3;
const neighborDirections = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, -1]
];

let genCount = 0;
const empty = 'empty';
const random = 'random';

const buildGrid = type => {
  console.log(`building ${type} grid...`);
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    if (type == empty) {
      rows.push(Array.from(Array(numCols), () => 0));
    }
    if (type == random) {
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
    // return buildEmptyGrid();
    return buildGrid(empty);
  });

  //gen1, buffer in background
  const [gen1, setGen1] = useState(gen0);
  const nextRef = useRef(gen1);
  nextRef.current = gen1;

  const [running, setRunning] = useState(false);
  const runRef = useRef(running);
  runRef.current = running;

  const clearGrid = () => {
    setGen0(() => {
      return buildGrid(empty);
    });
    return fillGrid('clear');
  };

  const randomGrid = () => {
    setGen0(() => {
      return buildGrid(random);
    });
    return fillGrid('random');
  };

  //   const handleClick = (i, j) => {
  //     console.log(
  //       `In HandleClick before \n (${i}, ${j}) - ${gen0[i][j]}\n`,
  //       gen0 === gen1
  //     );
  //     gen0[i][j] = gen0[i][j] === 1 ? 0 : 1;
  //     console.log(
  //       `In HandleClick after \n (${i}, ${j}) - ${gen0[i][j]}\n`,
  //       gen0 === gen1
  //     );
  //     return fillGrid('handleClick');
  //   };

  //   const fillGrid = msg => {
  //     console.log(`fillGrid gen0 => ${gen0}\n**In ${msg}`);
  //     return gen0.map((rows, i) =>
  //       rows.map((col, j) => (
  //         <div
  //           style={{
  //             width: 20,
  //             height: 20,
  //             backgroundColor: gen0[i][j] == 1 ? 'green' : 'red',
  //             border: 'solid 1px black'
  //           }}
  //           key={`${i}-${j}`}
  //           //   onClick={() => handleClick(i, j)}
  //           onClick={() => {
  //             gen0[i][j] = gen0[i][j] ? 0 : 1;
  //             console.log(`(${i},${j})==> ${gen0[i][j]}\n`, gen0 == gen1);
  //             // return fillGrid('fillGrid?');
  //             return buildGrid(gen0);
  //           }}
  //         />
  //       ))
  //     );
  //   };

  useEffect(() => {
    fillGrid('useEffect');
  }, [gen0]);

  // fillGrid will always display gen0, gen1 hidden in background
  const fillGrid = msg => {
    console.log(`In fillGrid gen0 => ${gen0}\n**from ${msg}`);
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
          //   onClick={() => handleClick(i, j)}
          onClick={() => {
            if (running) {
              console.log('**cant click**');
              return;
            } else {
              const temp = gen0;
              temp[i][j] = temp[i][j] === 1 ? 0 : 1;
              setGen0(temp);
              console.log(`(${i},${j})==> ${gen0[i][j]}\n`, gen0 == temp);
              return fillGrid('fillGrid onClick');
            }
          }}
        />
      ))
    );
  };

  const runSim = () => {
    if (runRef.current === false) {
      return;
    } else {
      const temp = gen0;
      console.log(temp);
    }
  };

  //   const fillCallback = useCallback(() => {
  //     setGen0(gen0);
  //     fillGrid('useCallback');
  //   }, [gen0]);

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {fillGrid('render')}
      </div>
      <div className='controls'>
        <button
          onClick={() => {
            setRunning(!running);
            if (!running) {
              runRef.current = true;
              runSim();
            }
          }}
        >
          {!running ? 'Start' : 'Stop'}
        </button>
        <button onClick={randomGrid}>Random</button>
        <button onClick={clearGrid}>Clear</button>
      </div>
    </>
  );
};

export default Grid2;
