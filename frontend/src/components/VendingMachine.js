import React, { useState, useEffect } from 'react'
const CONFIG = require("../config.json")
const axios = require('axios')
const VendingMachine = ({ updateNeeded, setUpdateNeeded }) => {
  //setState({ sodas: null })
  const [curState, setState] = useState(new Map())
  const [moneyInMachine, setMoneyInMachine] = useState(0.0)
  const [purchaseSet, setPurchaseSet] = useState(new Map())
  const url = "http://" + CONFIG.backendHost + ':' + CONFIG.backendPort + '/colas'
  const getSodaState = async () => {
    const { data } = await axios.get(url)
    if (data !== undefined) {
      const arrAsMap = new Map(
        data.map(object => {
          return [object["Product Name"], object];
        }),
      );
      setState(arrAsMap)
      return arrAsMap
    }
  }
  // const listItems = Array.from(curState).map((item) =>
  //   <button key={item["Product Name"]} onClick={this.handleClick}>
  //   </button>)
  // adding to purchase set
  const handleClick = (input) => {
    if (purchaseSet instanceof Array) {
      setPurchaseSet(new Map())
    }
    purchaseSet.set([input["Product Name"]], input)
    console.log(purchaseSet)
  }

  const handleMoney = (input) => {
    setMoneyInMachine(moneyInMachine + parseFloat(input))
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    setMoneyInMachine(parseFloat(event.target[0].value) + moneyInMachine)
    console.log('current Money Stolen:', event.target[0].value)
  }
  const clearTransaction = () => {
    setPurchaseSet(new Map())
    setMoneyInMachine(0)
  }

  const purchaseItems = () => {
    if (purchaseSet.size === 0) {
      alert("No selected Items")
      return;
    }
    let remainingMoney = moneyInMachine
    purchaseSet.forEach(item => {
      if (item.CurrentQuantity <= 0) {
        alert("Needs Moar", item["Product Name"])
        return
      }
      remainingMoney -= item.Cost
      console.log(item)
      console.log(item["Product Name"])
      if (remainingMoney < 0.0) {
        alert("Needs Moar Money")
        return
      }
      item.CurrentQuantity -= 1
    })
    var newState = curState
    purchaseSet.forEach(async (item) => {
      console.log(item.CurrentQuantity)
      const res = await axios.put(url, { item })
      if (res.status !== 200) {
        alert("Oh well")
      }
      newState.set(item["Product Name"], item);
      const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
        JSON.stringify({ "Soda": item["Product Name"] })
      )}`;
      const link = document.createElement("a");
      link.href = jsonString;
      link.download = item["Product Name"] + ".json";

      link.click();
    })
    setMoneyInMachine(remainingMoney)
    setUpdateNeeded(updateNeeded = updateNeeded |= 2)
    purchaseSet.clear()
    setState(newState)
  }

  useEffect(() => { getSodaState() }, [])
  useEffect(() => {
    async function x() {
      if (updateNeeded & 1) {
        setUpdateNeeded(updateNeeded = updateNeeded & ~1)
        setState(await getSodaState());
      }
    }
  }, [updateNeeded]);
  const inputAmounts = [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 50, 100]
  const inputItems = (inputAmounts).map((item) =>
    <button key={item} onClick={() => handleMoney(item)}>{item}</button>
  )
  const listItems = Array.from(curState.entries()).map((item) =>
    <button key={item[0]} onClick={() => handleClick(item[1])}>{item[0]} {item[1].Cost}</button>
  )
  return (
    <div>
      <p>Vending Machine</p>
      <p>Current Change In Machine {moneyInMachine}</p>
      {inputItems}
      <div>
        {listItems}
      </div>
      <form onSubmit={handleSubmit}>
        <label>Enter your money:
          <input type="float"
          />

        </label>
      </form>
      <button onClick={clearTransaction}>Reset</button>
      <button onClick={purchaseItems}>Purchase Items</button>
    </div>
  )
}

export default VendingMachine