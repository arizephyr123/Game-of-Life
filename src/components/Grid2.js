import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef
} from 'react';

const numRows = 25;
const numCols = 25;

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
  //   console.log(`building ${type} grid...`);
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
  const beforeRefUse = useRef(gen0);
  beforeRefUse.current = gen0;

  const beforeRefCreate = useRef(gen0);
  beforeRefCreate.current = gen0;

  //gen1, buffer in background
  const [gen1, setGen1] = useState(() => {
    return buildGrid(empty);
  });

  //   const bufferBlankRef = useRef(gen1);
  //   bufferBlankRef.current = gen1;
  //   console.log(bufferBlankRef);

  //   const nextRef = createRef(gen1);
  //   nextRef.current = gen1;
  //   console.log(`gen1 => nextRef', ${nextRef.current}`);
  //   useEffect(() => {
  //     if (nextRef.current != gen1) {
  //       nextRef.current = gen1;
  //     }
  //   }, [gen1, setGen1]);

  const [running, setRunning] = useState(false);
  const runRef = useRef(running);
  runRef.current = running;

  // For Testing -- to delete =======================

  const BufferGrid = useCallback(msg => {
    console.log(`In BufferGrid gen1 => ${gen1}`);
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
    return fillGrid('random'), BufferGrid('');
  };

  const clone = items =>
    items.map(item => (Array.isArray(item) ? clone(item) : item));

  // fillGrid will always display gen0, gen1 hidden in background
  const fillGrid = useCallback(msg => {
    // console.log(`In fillGrid gen0 => ${gen0}\n**from ${msg}`);

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
            console.log(`(${i},${j})==> ${gen0[i][j]}`);
            if (running) {
              console.log('**cant click**');
              return;
            } else {
              gen0[i][j] = gen0[i][j] === 1 ? 0 : 1;
              //   console.log(`(${i},${j})==> ${gen0[i][j]}\n${gen0}`);

              const gridCopy = clone(gen0);
              setGen0(gridCopy);
              //   console.log(`(${i},${j})==> ${gridCopy[i][j]}\n`, gridCopy);
              return fillGrid('fillGrid onClick'), BufferGrid('');
            }
          }}
        />
      ))
    );
  });

  //   const countLiveNeighbors = (ri, ci) => {
  //     console.log(`countLiveNeighbors`);
  //     let sum = 0;

  //     // for row of index -1 to 1
  //     for (let i = -1; i < 2; i++) {
  //       for (let j = -1; j < 2; j++) {
  //         let row = (i + ri + numRows) % numRows;
  //         let col = (j + ci + numCols) % numCols;
  //         // console.log(
  //         //   `alives + gen0(${col},${row})val = new sum alives\n${sum} + ${
  //         //     gen0[col][row]
  //         //   } = ${sum + gen0[col][row]}`
  //         // );
  //         sum += gen0[col][row];
  //       }
  //     }

  //     // subtract out self which was counted at (0, 0)
  //     sum -= gen0[ri][ci];
  //     // console.log(`neighborCount: ${sum}\n (${ri}, ${ci}) => ${gen0[ri][ci]}`);
  //     // console.log(
  //     //   `in  neighborCount - gen0(${ri},${ci})=> ${gen0[ri][ci]}\nsum -> ${sum}`
  //     // );
  //     return sum;
  //   };

  const runCycle = () => {
    console.log(
      `runCycle start\n    gen0 => ${gen0}\nbeforeRefUse => ${beforeRefUse.current}\nbeforeRefCreate => ${beforeRefCreate.current}`
    );
    let copyGen0 = clone(gen0);
    console.log(`runCycle 2\ncopyGen0 => ${copyGen0}`);

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = 0;
        operations.forEach(([x, y]) => {
          const neighborI = (i + x + numRows) % numRows;
          const neighborJ = (j + y + numCols) % numCols;
          console.log(
            `i + x + numRows\n (${i} + ${x} + ${numRows}\ngen0(${neighborI},${neighborJ}) has ${neighbors} live neigbors`
          );
          neighbors += gen0[neighborI][neighborJ];
        });
        // If an organisim is dead and has exactly 3 neigbors, then it comes back to life in the next generation. Else it stays dead
        if (gen0[i][j] === 0 && neighbors === 3) {
          console.log(
            `in runCycle rules 1\n gen0${i}${j} === 0 ? => ${gen0[i][j]}\n neighbors === 3 ? => ${neighbors}`
          );
          copyGen0[i][j] = 1;
        }
        // If an organisim is alive and has 2 or 3 neighbors, then it remains alive in the next generation. Else it dies.
        else if (gen0[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
          console.log(
            `in runCycle rules 2\n gen0${i}${j} === 1 ? => ${gen0[i][j]}\n neighbors = 2 or 3 ? => ${neighbors}`
          );
          copyGen0[i][j] = 0;
        }
      }
    }

    // copyGen0.map((rows, i) => {
    //   console.log(`runCycle 3`);
    //   rows.map((col, j) => {
    //     // let neighbors = countLiveNeighbors(i, j);

    //     // If an organisim is dead and has exactly 3 neigbors, then it comes back to life in the next generation. Else it stays dead
    //     if (gen0[i][j] === 0 && neighbors === 3) {
    //       console.log(
    //         `in runCycle rules 1\n gen0${i}${j} === 0 ? => ${gen0[i][j]}\n neighbors === 3 ? => ${neighbors}`
    //       );
    //       copyGen0[i][j] = 1;
    //     }
    //     // If an organisim is alive and has 2 or 3 neighbors, then it remains alive in the next generation. Else it dies.
    //     else if (gen0[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
    //       console.log(
    //         `in runCycle rules 2\n gen0${i}${j} === 1 ? => ${gen0[i][j]}\n neighbors = 2 or 3 ? => ${neighbors}`
    //       );
    //       copyGen0[i][j] = 0;
    //     }
    //   });
    //   console.log(
    //     `runCycle 4 rules done\n New gen1 => ${copyGen0}\n     gen0 => ${gen0}\nbeforeRefUse => ${beforeRefUse.current}\nbeforeRefCreate => ${beforeRefCreate.current}\ngen0 =>`
    //   );
    // });

    setGen1(copyGen0);
    console.log(`runCycle 5 - ${copyGen0 == gen1 ? 'pass' : 'fail'}`);
    setGen0(() => clone(gen1));
    console.log(`runCycle 6- ${gen0 == gen1 ? 'pass' : 'fail'}`);
    genCount += 1;
    console.log(
      `runCycle 7 - genCount & done\nbeforeRefUse => ${beforeRefUse.current}\nbeforeRefCreate => ${beforeRefCreate.current}`
    );

    return fillGrid('runCycle'), BufferGrid('');
  };

  const runSim = useCallback(() => {
    // console.log(
    //   `in runSim \n nextRef.current != gen0 -> ${nextRef.current !=
    //     gen0}\n runRef.current == true -> ${runRef.current == true}`
    // );
    while (true) {
      if (runRef.current == true) {
        //   if (nextRef.current != gen0 || runRef.current == true) {
        setTimeout(runCycle, 200);
        //   return runCycle();
      }
    }
  });

  const aliveCount = () => {
    // var sum = (r, a) => {
    //   console.log(`${r}`);
    //   r.map((b, i) => a[i] + b);
    // };
    // const sum = (rows, i) => rows.map((col, j) => rows[i] + col[j]);
    // let alive = gen0.reduce(function(rows, col) {
    //   return rows.map(function(value, index) {
    //     return value + col[index];
    //   });
    // });
    // const alive = gen0.reduce(sum(gen0.rows, gen0.));
    // console.log(`alive -> ${alive}`);
    // let sum = 0;
    // let alive = gen0.map((rows, i) =>
    //   // console.log(row.map((val, i) => sum += val));
    //   console.log(`alive--> sum: ${sum}, rows:${rows}, i: ${i}`)
    // );
    // console.log(alive.rows);
    return `TBD... Alive: ???  Dead: ${numCols * numRows} - ???`;
  };

  useEffect(() => {
    fillGrid('useEffect');
    BufferGrid('');
  }, [gen0, gen1, fillGrid, BufferGrid, runCycle]);

  return (
    <>
      <div>{`Generation: ${genCount}`}</div>
      {aliveCount()}
      <div className='controls'>
        <button onClick={runCycle}>Next</button>
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
        {BufferGrid('render')}
      </div>
    </>
  );
};

export default Grid2;
