import React from "react";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import List from "./components/List";

// add a round function to all values of type Number
Number.prototype.round = function (places) {
  return +(Math.round(this + "e+" + places) + "e-" + places);
};

// only used for testing
const test = [
  { id: 0, name: "micho", amount: 200 },
  { id: 1, name: "tito", amount: 140 },
  { id: 2, name: "negro", amount: 60 },
  { id: 3, name: "gordo", amount: 20 },
  { id: 4, name: "cabezon", amount: 25 },
  { id: 5, name: "peludo", amount: 175 },
  { id: 6, name: "sucio", amount: 100 },
  { id: 7, name: "tapado", amount: 80 },
];

function App() {
  const [users, setUsers] = useState(() => {
    return JSON.parse(localStorage.getItem('users')) || []
  });
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [round, setRound] = useState(1);
  const [currentId, setCurrentId] = useState(0);

  const addUser = () => {
    setUsers([...users, { id: currentId, name: name, amount: amount }]);
    setCurrentId(currentId + 1);
    setName("");
    setAmount(0);
  };

  const handleRoundCheckbox = (e) => {
    setRound(e.target.checked ? 0 : 1);
  };

  return (
    <>
      <Card className="d-flex mx-auto my-2 flex-column h-20 card-form">
        <Card.Body className="card-form-body">
          <InputGroup className="mb-3">
            <InputGroup.Text className="text-name">Nombre</InputGroup.Text>
            <Form.Control
              className="input-name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </InputGroup>
          <InputGroup className="mb-3">
            <InputGroup.Text className="text-amount">Monto</InputGroup.Text>
            <Form.Control
              className="input-amount"
              type="number"
              id="amount"
              value={amount}
              placeholder="0"
              min={0}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </InputGroup>
          <div className="d-flex justify-content-between align-items-center">
            <Form.Check
              type="switch"
              label="Redondear resultados"
              onChange={handleRoundCheckbox}
            />
            <Button variant="primary" onClick={addUser}>
              Agregar
            </Button>
          </div>
        </Card.Body>
      </Card>
      <List
        users={users}
        setUsers={setUsers}
        round={round}
      />
    </>
  );
}

export default App;
