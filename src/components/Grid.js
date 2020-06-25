import React, { useState, useEffect, useRef, useCallback } from 'react';
import { produce } from 'immer';

const numRows = 3;
const numCols = 3;

const buildGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    //   initiallizing with anon fn so it will only run once
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

const Grid = () => {
  // useEffect(() => {
  //   const rows = buildGrid();
  //   setTempGrid(rows);
  //   return tempGrid;
  // }, [tempGrid]);

  const [tempGrid, setTempGrid] = useState(() => {
    return buildGrid();
  });

  const [gen0, setGen0] = useState(tempGrid);
  const [gen1, setGen1] = useState(gen0);

  useEffect(() => {
    setGen0(tempGrid);
    // return fillGrid(tempGrid);
  }, [tempGrid]);

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSim = useCallback(() => {
    console.log(`running => ${running}`);
    if (!running) {
      return;
    }
    setTimeout(runSim, 500);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 20px)`
      }}
    >
      {tempGrid.map((rows, i) =>
        rows.map((col, j) => (
          <div
            key={`${i}-${j}`}
            onClick={() => {
              tempGrid[i][j] = tempGrid[i][j] ? 0 : 1;
              console.log(
                `(${i},${j})==> ${tempGrid[i][j]}\n${tempGrid}-${gen0}`
              );
              // console.log(`(${i},${j})\n${tempGrid[i][j]}-${gen0[i][j]}`);
            }}
            style={{
              width: 20,
              height: 20,
              backgroundColor: tempGrid[i][j] === 1 ? 'green' : 'grey',
              border: 'solid 1px black'
            }}
          />
        ))
      )}
      ;}
      <button onClick={setRunning(!running)}>Start</button>
    </div>
  );
};

export default Grid;
