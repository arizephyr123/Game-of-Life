import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  createRef
} from 'react';

const numRows = 7;
const numCols = 7;

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

  //gen1, buffer in background
  const [gen1, setGen1] = useState(() => {
    return buildGrid(empty);
  });

  //   const bufferBlankRef = useRef(gen1);
  //   bufferBlankRef.current = gen1;
  //   console.log(bufferBlankRef);

  //   const nextRef = createRef(gen1);
  //   nextRef.current = gen1;
  //   console.log(nextRef);
  //   useEffect(() => {
  //     if (!nextRef.current) {
  //       nextRef.current = gen1;
  //     }
  //     return () => {
  //       //   cleanup;
  //     };
  //   }, [input]);

  const [running, setRunning] = useState(false);
  const runRef = useRef(running);
  runRef.current = running;

  // For Testing -- to delete =======================
  const BufferGrid = msg => {
    // console.log(`In BufferGrid gen1 => ${gen1}\n**from ${msg}`);
    return gen0.map((rows, i) =>
      rows.map((col, j) => (
        <div
          style={{
            width: 20,
            height: 20,
            backgroundColor: gen1[i][j] == 1 ? 'black' : 'white',
            border: 'solid 1px black'
          }}
          key={`${i}-${j}`}
          //   onClick={() => {
          //     if (running) {
          //       console.log('**cant click**');
          //       return;
          //     } else {
          //       const temp = gen1;
          //       temp[i][j] = temp[i][j] === 1 ? 0 : 1;
          //       setGen1(temp);
          //       console.log(`(${i},${j})==> ${gen1[i][j]}\n`, gen1 == temp);
          //       return fillGrid('fillGrid onClick');
          //     }
          //   }}
        />
      ))
    );
  };

  // ========================

  const clearGrid = () => {
    setGen0(() => {
      return buildGrid(empty);
    });
    genCount = 0;
    return fillGrid('clear');
  };

  const randomGrid = () => {
    setGen0(() => {
      return buildGrid(random);
    });
    return fillGrid('random');
  };

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
            if (running) {
              console.log('**cant click**');
              return;
            } else {
              gen0[i][j] = gen0[i][j] === 1 ? 0 : 1;
              setGen0(gen0);
              console.log(`(${i},${j})==> ${gen0[i][j]}\n`, gen0);
              //   console.log(`(${i},${j})==> ${gen0[i][j]}\n`, gen0);
              return fillGrid('fillGrid onClick');
            }
          }}
        />
      ))
    );
  });

  useEffect(() => {
    fillGrid('useEffect');
  }, [gen0, fillGrid]);

  const countLiveNeighbors = (ri, ci) => {
    console.log(`in  neighborCount - gen0(${ri},${ci})=> ${gen0[ri][ci]}`);
    let sum = 0;
    // for row of index -1 to 1
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let row = (i + ri + numRows) % numRows;
        let col = (j + ci + numCols) % numCols;
        // console.log(
        //   `sum + gen0[col][row] = (sum + gen0[col][row]})\n${sum} + ${
        //     gen0[col][row]
        //   } = ${sum + gen0[col][row]}`
        // );
        sum += gen0[col][row];
      }
    }
    // subtract out self which was counted at (0, 0)
    sum -= gen0[ri][ci];
    // console.log(`neighborCount: ${sum}\n (${ri}, ${ci}) => ${gen0[ri][ci]}`);
    return sum;
  };

  const runSim = useCallback(() => {
    let sum = 0;

    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        let neighbors = countLiveNeighbors(i, j);
        if (gen0[i][j] === 1 && neighbors === 3) {
          gen1[i][j] = 0;
        } else if (gen0[i][j] === 0 && (neighbors === 2 || neighbors === 3)) {
          gen1[i][j] = 1;
        } else {
          gen1[i][j] = gen0[i][j];
        }
      }
    }

    genCount += 1;
    setGen0(gen1);

    // console.log(
    //   `run Sim after  gen0 => ${gen0}\ngen1 => ${gen1}\n gen0=gen1? ${gen0 ==
    //     gen1}`
    // );

    //   setTimeout(runSim, 200);
    fillGrid('runSim');
    BufferGrid('');
    return (genCount += 1), setGen0(gen1), setGen1();
  }, [countLiveNeighbors, fillGrid, gen0, gen1, buildGrid]);

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

  return (
    <>
      <div>{`Generation: ${genCount}`}</div>
      {aliveCount()}
      <div className='controls'>
        <button
          onClick={() => {
            runSim();
          }}
        >
          Next
        </button>
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
