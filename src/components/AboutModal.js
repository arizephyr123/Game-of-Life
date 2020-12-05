import React from 'react';
import { Button, Modal, Container } from 'react-bootstrap';

const AboutModal = props => {
  return (
    <Modal {...props} aria-labelledby='contained-modal-title-vcenter'>
      {console.log(props)}
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          About Conway's Game of Life
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='show-grid'>
        <Container>
          <h5 className='info-text'>
            Conway's Game of Life is a visualization of how generations of
            'organizims' will survive and spread through a given space.
          </h5>
          <h5 className='info-text'>
            Cellular automation programs are used in research settings to model
            ecological, epidemiological and chemical simulations as well as
            cellular-automation-based computer processors. A cellular automation
            is a grid of cells that have a finite number of states and
            dimensions. Each cell's state is determined by the state of it's
            neighbors in the previous generation as dictated by the rules of the
            automation.
          </h5>
          <h5 className='info-text'>
            In software engineering, Turing Complete describes a computational
            system that has equivilent processing power as a Turing Machine.
          </h5>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
    // <>
    //   <div onClick={handleClick}>
    //     <Button
    //       onClick={() => setVisible(!visible)}
    //       //   aria-controls='conway-about'
    //       //   aria-expanded={visible}
    //     >
    //       About
    //     </Button>
    //     {visible && (
    //       <Modal className='info-box'>
    //         <div className='about' id='conway-about'>
    //           <h5 className='info-text'>
    //             Cellular Automata(CA) programs are used in research setings to
    //             model ecological, epidemiological and chemical simulations as
    //             well as CA-based computer processors. In software engineering,
    //             Turing Complete describes a computational system that has
    //             equivilent processing power as a Turing Machine.
    //           </h5>
    //         </div>
    //       </Modal>
    //     )}
    //   </div>
    // </>
  );
};

export default AboutModal;
