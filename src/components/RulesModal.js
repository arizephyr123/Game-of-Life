import React from 'react';
import { Button, Modal, Container } from 'react-bootstrap';

const RulesModal = props => {
  //   const [visible, setVisible] = useState(false);
  //   const handleClick = () => {
  //     setVisible(!visible);
  //   };

  return (
    <Modal {...props} aria-labelledby='contained-modal-title-vcenter'>
      {console.log(props)}
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>The Rules:</Modal.Title>
      </Modal.Header>
      <Modal.Body className='show-grid'>
        <Container>
          <h5 className='info-text'>
            1. If an organisim is alive and has 2 or 3 neighbors, then it
            remains alive in the next generation. Else it dies.
          </h5>
          <h5 className='info-text'>
            2. If an organisim is dead and has exactly 3 neigbors, then it comes
            back to life in the next generation. Else it remains dead.
          </h5>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RulesModal;
