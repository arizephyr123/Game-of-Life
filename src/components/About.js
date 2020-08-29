import React, { useState } from 'react';
import { Button, Fade } from 'react-bootstrap';

const About = props => {
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(!visible);
  };

  return (
    <>
      <div onClick={handleClick}>
        <Button
          onClick={() => setVisible(!visible)}
          aria-controls='conway-about'
          aria-expanded={visible}
        >
          About
        </Button>
        {visible && (
          <div>
            <Fade in={visible}>
              <div id='conway-about'>
                Cellular Automata(CA) programs are used in research setings to
                model ecological, epidemiological and chemical simulations as
                well as CA-based computer processors. In software engineering,
                Turing Complete describes a computational system that has
                equivilent processing power as a Turing Machine.
              </div>
            </Fade>
          </div>
        )}
      </div>
    </>
  );
};

export default About;
