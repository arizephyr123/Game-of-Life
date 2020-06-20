import React, { useState } from 'react';
const numRows = 50;
const numCols = 50;

const Grid = () => {
    // initiallizing with anon fn so it will only run once
    const [grid, setGrid] = useState(() => {
        const rows = [];
        // for numRows, push array of numCols with anon fn setting vals as 0s
        for (let i = 0; i < numRows; i++){
            rows.push(Array.from(Array(numCols), () => 0))
        }
        return rows;
    });
    
    return (
      <div style={{display: 'grid', gridTemplateColumns: `repeat(${numCols}, 20px)`}}>
        {grid.map((rows, ri) => rows.map((col, ci) => (<div style={{ width: 20, height: 20, backgroundColor: grid[ri][ci] ? 'green' : 'grey', border: "solid 1px black"}}/>)))}
      </div>
    );
}

export default Grid;