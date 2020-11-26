import React from 'react';
import './less/index.less';
import Grid from './components/Grid';
import '../src/styles/App.css';

function App() {
  return (
    <div className='container'>
      <h1 className='header-title'>Conway's Game of Life</h1>
      <Grid />
    </div>
  );
}

export default App;
