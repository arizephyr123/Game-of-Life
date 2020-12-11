import React from 'react';
import { Button, Modal, Container } from 'react-bootstrap';
import '../styles/Modals.css';

const AboutModal = props => {
  return (
    <Modal {...props} aria-labelledby='modal-title'>
      {/* {console.log(props)} */}
      <Modal.Header closeButton>
        <Modal.Title id='modal-title'>About Conway's Game of Life</Modal.Title>
      </Modal.Header>
      <Modal.Body className='show-grid'>
        <Container>
          <h5 className='info-text'>
            <a
              target='_blank'
              href='https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life'
            >
              Conway's Game of Life{' '}
            </a>{' '}
            is a visualization of how generations of 'organizims' will survive
            and spread through a given space.
          </h5>
          <h5 className='info-text'>
            <a
              target='_blank'
              href='https://en.wikipedia.org/wiki/Cellular_automaton'
            >
              Cellular automation{' '}
            </a>
            programs are used in research settings to model ecological,
            epidemiological and chemical simulations as well as
            cellular-automation-based computer processors. A cellular automation
            is a grid of cells that have a finite number of states and
            dimensions. Each cell's state is determined by the state of it's
            neighbors in the previous generation as dictated by the rules of the
            automation. here
          </h5>
          <h5 className='info-text'>
            In software engineering, Turing Complete describes a computational
            system that has equivilent processing power as a Turing Machine.
          </h5>
        </Container>
      </Modal.Body>
      <Modal.Footer id='modal-footer'>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AboutModal;
