import React, { useState } from 'react';
import { produce } from 'immer';

const numRows = 3;
const numCols = 3;

const Grid = () => {
    // initiallizing with anon fn so it will only run once
    const buildGrid = () => {
        const rows = []
        for(let i = 0; i < numRows; i++){
            rows.push(Array.from(Array(numCols), () => 0))
        }
        return rows;
    };
    const [tempGrid, setTempGrid] = useState(buildGrid())
    const [gen0, setGen0] = useState(tempGrid)
    const [gen1, setGen1] = useState(gen0)
    
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
              onClick={() => 
                {setGen0([tempGrid[i][j] = tempGrid[i][j] ? 0 : 1]);
                 console.log(`${tempGrid}`)
            }
            }
              key={`${i}-${j}`}
              style={{
                width: 20,
                height: 20,
                backgroundColor: tempGrid[i][j] ? 'green' : 'grey',
                border: 'solid 1px black'
              }}
            />
          ))
        )}
      </div>
    );
}

export default Grid;