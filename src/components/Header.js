import React from 'react';
import GOLVid from '../assets/video/gol_demo.mp4';
import '../styles/Header.css';

const Header = () => {
  return (
    <header>
      <div className='overlay'></div>
      <video autoPlay loop muted>
        <source src={GOLVid} type='video/mp4' />
      </video>
      <div className='header-container h-100'>
        <div className='d-flex h-100 text-center align-items-center'>
          <div className='w-100'>
            <h1 className='title display-4'>Conway's Game of Life</h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
