import React, { useState } from 'react';
import { Button, Modal, Row, Col, Container } from 'react-bootstrap';

const AboutModal = props => {
  //   const [visible, setVisible] = useState(false);
  //   const handleClick = () => {
  //     setVisible(!visible);
  //   };

  return (
    <Modal {...props} aria-labelledby='contained-modal-title-vcenter'>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          Using Grid in Modal
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='show-grid'>
        <Container>
          <Row>
            <Col xs={12} md={8}>
              .col-xs-12 .col-md-8
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>

          <Row>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
            <Col xs={6} md={4}>
              .col-xs-6 .col-md-4
            </Col>
          </Row>
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
