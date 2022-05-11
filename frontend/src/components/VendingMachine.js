import React, { useState, useEffect } from 'react'
const CONFIG = require("../config.json")
const axios = require('axios')
const image = require('../VendingMachine.png')
const VendingMachine = ({ updateNeeded, setUpdateNeeded }) => {
  const [curState, setState] = useState(new Map())
  const [moneyInMachine, setMoneyInMachine] = useState(0.0)
  const [purchaseSet, setPurchaseSet] = useState(new Map())
  const url = "http://" + CONFIG.backendHost + ':' + CONFIG.backendPort + '/colas'
  const getSodaState = async () => {
    const { data } = await axios.get(url)
    if (data !== undefined) {
      const arrAsMap = new Map(
        data.map(object => {
          return [object["Product Name"], object]
        }),
      )
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
    purchaseSet.set(input["Product Name"], input)
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
      return
    }
    let remainingMoney = moneyInMachine
    purchaseSet.forEach(item => {
      if (item.CurrentQuantity <= 0) {
        alert("Needs More", item["Product Name"])
        return
      }
      remainingMoney -= item.Cost
      if (remainingMoney < 0.0) {
        alert("Needs More Money")
        purchaseSet.delete(item)
        remainingMoney += item.Cost

      }
      else {
        item.CurrentQuantity -= 1
      }
    })
    console.log(purchaseSet)
    if (remainingMoney < 0.0) {
      alert("Needs More Money")
      return
    }
    var newState = curState
    console.log(purchaseSet.size)
    purchaseSet.forEach(async (item) => {
      const res = await axios.put(url, { item })
      if (res.status !== 200) {
        alert("Oh well")
      }
      newState.set(item["Product Name"], item)
      const jsonString = `data:text/jsonchatset=utf-8,${encodeURIComponent(
        JSON.stringify({ "Soda": item["Product Name"], "Flavor": item.description })
      )}`
      const link = document.createElement("a")
      link.href = jsonString
      link.download = item["Product Name"] + ".json"

      link.click()
    })
    setMoneyInMachine(remainingMoney)
    setUpdateNeeded(updateNeeded = updateNeeded |= 2)
    purchaseSet.clear()
    setState(newState)
  }

  useEffect(() => { getSodaState() }, [])
  // useEffect(() => {
  //   async function x() {
  //     if (updateNeeded & 1) {
  //       setUpdateNeeded(updateNeeded = updateNeeded & ~1)
  //       setState(await getSodaState())
  //       window.performance.reload(false)
  //     }
  //   }
  // }, [updateNeeded])
  const inputAmounts = [0.01, 0.05, 0.10, 0.25, 1, 5, 10, 20, 50, 100]
  const inputItems = (inputAmounts).map((item) =>
    <button key={item} onClick={() => handleMoney(item)}>{item}</button>
  )
  const listItems = Array.from(curState.entries()).map((item) =>
    <button key={item[0]} style={{ display: 'block', justifyItems: 'center' }} onClick={() => handleClick(item[1])}>{item[0]} {item[1].Cost}</button>
  )
  return (
    <div className='Vending' style={{
      borderStyle: 'solid',
      backgroundColor: "black", minWidth: 400, width: 600, maxWidth: 600, minHeight: 500, maxHeight: 800
      , alignItems: 'left', color: 'white', flex: 'flexShrink', flexDirection: 'row',
      display: 'flex',
      justifyContent: 'left',
      flexWrap: 'wrap',
      flexFlow: 'row wrap',
      alignContent: 'flex - end',
    }}>
      <h1>Vending Machine</h1>
      <div style={{
        position: 'relative',
        top: 0,
        left: 0,
        fontSize: 18,
        alignItems: 'left',
        height: 600,
        width: 400,
        maxHeight: 1200,
        maxWidth: 800,
        objectFit: 'scale-down'

      }}>
        <img src={image} alt='vending machine' height={600} width={400} />
      </div>
      <div style={{
        position: 'relative',
        top: 0,
        left: 50,
        fontSize: 18,
        alignItems: 'center',
        height: 150,
        width: 100
      }}>
        {listItems}
      </div>
      <div className='money' style={{
        position: 'relative',
        top: 50,
        left: -75,
        fontSize: 18,
        alignItems: 'center',
        height: 100,
        width: 100,
        marginTop: 50
      }}>
        <p>Current Change In Machine {moneyInMachine}</p>

        {inputItems}
        <form onSubmit={handleSubmit}>
          <label>Enter your money in USD:
            <input type="float"
            />

          </label>
        </form>
      </div>
      <div className='transaction endpoints' style={{
        position: 'relative',
        top: -150,
        left: 400,
        fontSize: 18,
        alignItems: 'center',
        display: 'block',
        height: 150,
        width: 150
      }}>
        <button onClick={clearTransaction}>Reset</button>
        <button onClick={purchaseItems}>Purchase Items</button>
      </div>
    </div >
  )
}

export default VendingMachine