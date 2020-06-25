import React, { useState, useEffect } from 'react';

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

const buildEmptyGrid = () => {
  console.log('building blank grid...');
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const buildGrid = type => {
  console.log('building grid...');
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
  //gen1 , in background
  const [gen1, setGen1] = useState(gen0);

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

  const handleClick = (i, j) => {
    gen0[i][j] = gen0[i][j] ? 0 : 1;
    // setGen0(gen0);
    console.log(
      `In HandleClick after \n (${i}, ${j}) - ${gen0[i][j]}\n`,
      gen0 === gen1
    );
    fillGrid('handleClick');
  };

  const fillGrid = msg => {
    console.log(`fillGrid gen0 => ${gen0}\n**In ${msg}`);
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
          onClick={() => handleClick(i, j)}
          //   onClick={() => {
          // gen0[i][j] = gen0[i][j] ? 0 : 1;
          // console.log(`(${i},${j})==> ${gen0[i][j]}\n`, gen0 == gen1);
          //   }}
        />
      ))
    );
  };

  useEffect(() => {
    fillGrid('useEffect');
  }, [gen0]);

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${numCols}, 20px)`
        }}
      >
        {() => setGen0(gen0)}
        {fillGrid('render')}
      </div>
      <div className='controls'>
        <button>Run</button>
        {/* <button>{running ? "Stop" : "Stop"}</button> */}
        <button onClick={randomGrid}>Random</button>
        <button onClick={clearGrid}>Clear</button>
      </div>
    </>
  );
};

export default Grid2;
