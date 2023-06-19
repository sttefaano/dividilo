import React from "react";
import { Modal, Button } from "react-bootstrap";

function ResultsModal({ show, users, setOpenModal, total, perPerson, round , participants}) {
  return (
    <Modal show={show}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <div className="d-flex gap-3">
          <p>Total: {total.round(round)}$</p>
          <p>Participantes: {participants}</p>
          <p>Por persona: {perPerson.round(round)}$</p>
        </div>
        <div>
          {users.map((user) =>
            user.transactions.map((transaction) => <p>{transaction}</p>)
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setOpenModal(!show);
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultsModal;
