import "./App.css";
import { useState, useEffect, useRef } from "react";
import axios                           from "axios";
import constants                       from './constants/constants';

function App() {
  const [users, setUsers] = useState([]);
  const inputRefArr       = useRef([]);

  const fetchUsers        = async () => {
    const tempUsers       = await axios.get("localhost:5000/api/v1/users");
    setUsers(tempUsers.data.data);
  };

  useEffect(() => {fetchUsers();}, []);

  const depositeHandler   = async e  => {
    const userId          = e.target.getAttribute("id");
    const amountElement     = inputRefArr.current.filter(input => input.input === constants.DEPOSITE && input.id === userId)[0].element;

    if (amountElement.value.length === 0) return;

    const response        = await axios.put(`localhost:5000/api/v1/users/deposite/${userId}/${amountElement.value}`);

    amountElement.value   = '';

    fetchUsers();
  };
  const withdrawHandler   = async e  => {
    const userId          = e.target.getAttribute("id");
    const amountElement   = inputRefArr.current.filter(input => input.input === constants.WITHDRAW && input.id === userId)[0].element;

    if (amountElement.value.length === 0) return;

    const response        = await axios.put(`localhost:5000/api/v1/users/withdraw/${userId}/${amountElement.value}`);

    amountElement.value   = '';

    fetchUsers();
  };
  const transferHandler   = async e  => {
    const userIdFrom      = e.target.getAttribute("id");
    const userIdToElement = inputRefArr.current.filter(input => input.input === constants.TRANSFER_TO && input.id === userIdFrom)[0].element;
    const amountElement   = inputRefArr.current.filter(input => input.input === constants.TRANSFER_AMOUNT && input.id === userIdFrom)[0].element;

    if (userIdToElement.value.length === 0 || amountElement.value.length === 0)  return;

    const response        = await axios.put(`localhost:5000/api/v1/users/transfer/${userIdFrom}/${userIdToElement.value}/${amountElement.value}`);

    userIdToElement.value = '';
    amountElement.value   = '';

    fetchUsers();
  };
  const createUserHandler = async e  => {
    const nameElement     = inputRefArr.current.filter(input => input.input === constants.NEW_NAME)[0].element;
    const cashElement     = inputRefArr.current.filter(input => input.input === constants.NEW_CASH)[0].element;
    const creditElement   = inputRefArr.current.filter(input => input.input === constants.NEW_CREDIT)[0].element;

    if (nameElement.value.length === 0 || cashElement.value.length === 0 || creditElement.value.length === 0) return;

    const newUser         = await axios.post("localhost:5000/api/v1/users",{name: nameElement.value,cash: cashElement.value,credit: creditElement.value});

    nameElement.value     = '';
    cashElement.value     = '';
    creditElement.value   = '';

    fetchUsers();
  }
  return (
    <div className="App">
      <table>
        <thead>
          <tr><td>{constants.ADD_NEW_USER}</td><td></td><td></td><td></td></tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input ref={(e) => {
                      inputRefArr.current.push({
                        input: constants.NEW_NAME,
                        element: e,
                      })}}
                      type="text" 
                      placeholder={constants.NAME}/>
            </td>
            <td>
              <input ref={(e) => {
                      inputRefArr.current.push({
                        input: constants.NEW_CASH,
                        element: e,
                      })}}
                      type="number"
                      placeholder={constants.CASH}/>
            </td>
            <td>
              <input ref={(e) => {
                      inputRefArr.current.push({
                        input: constants.NEW_CREDIT,
                        element: e,
                      })}}
                      type="number"
                      placeholder={constants.CREDIT}/>
            </td>
            <td className="buttons-container">
              <button onClick={createUserHandler}>{constants.CREATE_USER}</button>
            </td>
          </tr>
        </tbody>
      </table>
      <table>
        <thead>
          <tr>
            <td>{constants.NAME}</td>
            <td>{constants.CASH}</td>
            <td>{constants.CREDIT}</td>
            <td>{constants.ACTIONS}</td>
          </tr>
        </thead>
        <tbody>
          {users && users.map(user =>
            <tr key={user.id}>
              <td>
                {user.name}
              </td>
              <td>
                {user.cash}
              </td>
              <td>
                {user.credit}
              </td>
              <td className="buttons-container">
                <button id={user.id} onClick={depositeHandler}>
                  {constants.DEPOSITE}
                </button>
                <input
                  ref={(e) => {
                    inputRefArr.current.push({
                      input: constants.DEPOSITE,
                      element: e,
                      id: user.id
                    })}}
                  type="number"
                  placeholder={constants.AMOUNT}
                />
                <button id={user.id} onClick={withdrawHandler}>
                {constants.WITHDRAW}
                </button>
                <input
                  ref={(e) => {
                    inputRefArr.current.push({
                      input: constants.WITHDRAW,
                      element: e,
                      id: user.id
                    })}}
                  type="number"
                  placeholder={constants.AMOUNT}
                />
                <button id={user.id} onClick={transferHandler}>
                  {constants.TRANSFER}
                </button>
                <div className="input-container">
                  <input
                    ref={(e) => {
                      inputRefArr.current.push({
                        input: constants.TRANSFER_TO,
                        element: e,
                        id: user.id
                      })}}
                    type="text"
                    placeholder={constants.TO}
                  />
                  <input
                    ref={(e) => {
                      inputRefArr.current.push({
                        input: constants.TRANSFER_AMOUNT,
                        element: e,
                        id: user.id
                      })}}
                    type="number"
                    placeholder={constants.AMOUNT}
                  />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
