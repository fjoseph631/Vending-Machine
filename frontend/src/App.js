import logo from './logo.svg';
import './App.css';
import VendingMachine from './components/VendingMachine'
import AdminPage from './components/AdminPage';
import React, { useState } from 'react'

function App() {
  const [updateNeeded, setUpdateNeeded] = useState(0);
  return (
    <div className="App">
      <VendingMachine updateNeeded={updateNeeded} setUpdateNeeded={setUpdateNeeded} ></VendingMachine>
      <AdminPage updateNeeded={updateNeeded} setUpdateNeeded={setUpdateNeeded} ></AdminPage>
    </div>
  );
}
/*
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
*/
export default App;
