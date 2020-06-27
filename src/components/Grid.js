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

const countLiveNeighbors = (ri, ci) => {
  let sum = 0;
  // for row of index -1 to 1
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {
      let row = (i + ri + numRows) % numRows;
      let col = (j + ci + numCols) % numCols;
      // console.log(
      //   `alives + gen0(${col},${row})val = new sum alives\n${sum} + ${
      //     gen0[col][row]
      //   } = ${sum + gen0[col][row]}`
      // );
      sum += gen0[col][row];
    }
  }
  // subtract out self which was counted at (0, 0)
  sum -= gen0[ri][ci];
  // console.log(`neighborCount: ${sum}\n (${ri}, ${ci}) => ${gen0[ri][ci]}`);
  // console.log(
  //   `in  neighborCount - gen0(${ri},${ci})=> ${gen0[ri][ci]}\nsum -> ${sum}`
  // );
  return sum;
};

export default Grid;
