import React, { useDebugValue } from "react";
import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import ResultsModal from "./ResultsModal";
import Form from "react-bootstrap/Form";
import { Icon } from "./Utils";
import { FiTrash2 } from 'react-icons/fi';

function List({ users, setUsers, round }) {
  const [total, setTotal] = useState(0);
  const [usersId, setUsersId] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [transactionUsers, setTransactionUsers] = useState(null);
  const [perPerson, setPerPerson] = useState(0);

  const calculate = () => {
    const total = users.reduce((acc, user) => acc + user.amount, 0);
    const perPerson = total / users.length;
    const balancedUsers = users.map((user) => {
      return { ...user, balance: user.amount - perPerson, transactions: [] };
    });
    const { debtors, creditors } = distribute(balancedUsers);
    setPerPerson(perPerson);
    setTotal(total);
    retribute(debtors, creditors, balancedUsers);
    setOpenModal(!openModal);
  };

  const distribute = (usersList) => {
    const debtors = [];
    const creditors = [];

    usersList.forEach(({ id, balance }) => {
      if (balance < 0) {
        debtors.push(id);
      }

      if (balance > 0) {
        creditors.push(id);
      }
    });

    return {
      debtors: debtors,
      creditors: creditors,
    };
  };

  // this is a simple way to do the job
  // should be improved
  const retribute = (debtorsList, creditorsList, usersList) => {
    const usersUpdated = [];
    debtorsList.forEach((debtorId) => {
      const debtor = usersList.find(user => user.id == debtorId);
      creditorsList.forEach((id) => {
        const creditorPos = usersId.indexOf(id);
        const creditor = usersList[creditorPos];
        const debtorName = `${debtor.name}`.toUpperCase();
        const creditorName = `${creditor.name}`.toUpperCase();
        if (debtor.balance < 0 && creditor.balance > 0) {
          if (creditor.balance >= debtor.balance * -1) {
            creditor.balance -= debtor.balance * -1;
            debtor.transactions.push(
              `${debtorName} paga a ${creditorName}: ${(
                debtor.balance * -1
              ).round(round)}$`
            );
            debtor.balance = 0;
          }
          if (creditor.balance < debtor.balance * -1) {
            debtor.balance += creditor.balance;
            debtor.transactions.push(
              `${debtorName} paga a ${creditorName}: ${creditor.balance.round(
                round
              )}$`
            );
            creditor.balance = 0;
          }
        }
      });
      usersUpdated.push(debtor);
    });
    setTransactionUsers(usersUpdated);
  };

  const cleanUsers = () => {
    setUsersId([]);
    setUsers([]);
  };

  const handleDelete = (e) => {
    const id = Number(e.target.id);
    setUsers((users) =>
      users.filter((user) => user.id != id)
    );
  };

  const handleChange = (e) => {
    const target = e.target;
    const id = Number(target.id);
    const user = users.find(user => user.id == id);
    const index = users.indexOf(user);
    const newUsers = users;
    typeof user[target.name] == "number"
      ? (user[target.name] = Number(target.value))
      : (user[target.name] = target.value);
    newUsers[index] = user;
    setUsers(newUsers);
    localStorage.setItem('users', JSON.stringify(newUsers));
  };

  useEffect(() => {
    setUsersId(users.map((user) => user.id));
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  return (
    <React.Fragment>
      <Card className="d-flex mx-auto my-2 flex-column h-20 card-list">
        <Card.Title className="mx-auto my-2">Integrantes</Card.Title>
        <Card.Body className="d-flex align-items-center flex-column">
          <div className="d-flex flex-column align-items-center">
            {users.map((user) => (
              <InputGroup className="mb-3 w-75">
                <InputGroup.Text className="user-name" name="name">
                  {user.name}
                </InputGroup.Text>
                <Form.Control
                  className="user-amount"
                  type="number"
                  name="amount"
                  placeholder={user.amount}
                  id={user.id}
                  onChange={handleChange}
                />
                <InputGroup.Text className="d-flex justify-content-center user-delete" name="name">
                  <Icon>
                    <FiTrash2 title="Delete" id={user.id} onClick={handleDelete} />
                  </Icon>
                </InputGroup.Text>
              </InputGroup>
            ))}
          </div>
          <div className="d-flex my-2">
            <Button variant="danger" className="mx-2" onClick={cleanUsers}>
              Limpiar
            </Button>
            <Button variant="primary" onClick={calculate}>
              Calcular
            </Button>
          </div>
        </Card.Body>
      </Card>
      {openModal && (
        <ResultsModal
          users={transactionUsers}
          participants={users.length}
          setOpenModal={setOpenModal}
          show={openModal}
          total={total}
          perPerson={perPerson}
          round={round}
        />
      )}
    </React.Fragment>
  );
}

export default List;
