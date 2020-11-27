import React, { useState } from 'react';
import { Button, Fade } from 'react-bootstrap';

const Rules = props => {
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div onClick={handleClick}>
        <Button
          onClick={() => setVisible(!visible)}
          aria-controls='conway-rules'
          aria-expanded={visible}
        >
          Rules
        </Button>
        {visible && (
          <div className='info-box'>
            <Fade in={visible}>
              <div className='rules' id='conway-rules'>
                <h5 className='info-text'>
                  Conway's Game of Life is a 2d visualization of how generations
                  of 'organizims' will survive and spread through a given space.
                  Ty given the following simplified rules: 1. If an organisim is
                  alive and has 2 or 3 neighbors, then it remains alive in the
                  next generation. Else it dies. 2. If an organisim is dead and
                  has exactly 3 neigbors, then it comes back to life in the next
                  generation. Else it stays dead
                </h5>
              </div>
            </Fade>
          </div>
        )}
      </div>
    </>
  );
};

export default Rules;
