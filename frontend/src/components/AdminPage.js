import React, { useState, useEffect} from 'react'
const CONFIG = require("../config.json")
const axios = require('axios')
const AdminPage = ({ updateNeeded, setUpdateNeeded }) => {
    //setState({ sodas: null })
    const [curState, setState] = useState(new Map())
    const [restockSet, setRestockSet] = useState(new Map())
    const url = "http://" + CONFIG.backendHost + ':' + CONFIG.backendPort + '/colas'
    const restockItems = () => {
        if (restockSet.size === 0) {
            alert("No selected Items")
            return
        }
        restockSet.forEach(async item => {
            const { status } = await axios.put(url, { item })
            if (status !== 200) {
                alert("Oh Dear")
            }
            var newState = curState
            newState.set(item["Product Name"], item)
            setState(newState)
        }
        )
        restockSet.clear()
        setUpdateNeeded(updateNeeded |= 1)
    }
    const setNewPrices = (event) => {
        event.preventDefault()
        if (restockSet instanceof Array) {
            setRestockSet(new Map())
        }
        const key = event.target.id
        const amount = parseFloat(event.target[0].value)
        var item
        if (restockSet.has(key)) {
            item = restockSet.get(key)
        }
        else {
            item = curState.get(key)
        }
        if (item === undefined) {
            return
        }
        item.Cost = amount
        restockSet.set(key, item)
    }

    const setRestockAmount = async (event) => {
        event.preventDefault()
        if (restockSet instanceof Array) {
            setRestockSet(new Map())
        }
        const key = event.target.id
        const amount = parseInt(event.target[0].value)
        var item
        if (restockSet.has(key)) {
            item = restockSet.get(key)
        }
        else {
            item = await (axios.get(url + '/' + key))
            if (item.data !== undefined) {
                item = item.data
            }
            else {
                item = curState.get(key)
            }
        }
        item.CurrentQuantity += amount
        if (item.CurrentQuantity > item.MaxQuantity) {
            alert("Too Many Items resetting to current max")
            item.CurrentQuantity = item.MaxQuantity
        }
        restockSet.set(key, item)
    }
    const getSodaState = async () => {
        const { data } = await axios.get(url)
        if (data !== undefined) {
            const arrAsMap = new Map(
                data.map(object => {
                    return [object["Product Name"], object]
                }),
            )
            setState(arrAsMap)
        }
    }
    const clearTransaction = () => {
        setRestockSet(new Map())
    }
    useEffect(() => { getSodaState() }, [])

    const listItems = Array.from(curState.entries()).map((item) =>
        <div style={{ display: 'flow' }}>
            <h3>{item[0]}</h3>
            <p>Current Price: {item[1].Cost}</p>
            <p>Max Quantity: {item[1].MaxQuantity} </p>
            <p>Current Quantity: {item[1].CurrentQuantity}</p>

            <form key={item[0] + "Amount"} id={item[0]} onSubmit={setRestockAmount}>
                <label >Enter restock amount for {item[0]}:
                    <input type="number"
                    />
                </label>
            </form>

            <form key={item[0] + "Price"} id={item[0]} onSubmit={setNewPrices}>
                <label >Enter new price amount for {item[0]}:
                    <input type="float"
                    />
                </label>
            </form>
        </div>
    )
    return (
        <div>
            <h1>Special Admin Page</h1>
            {listItems}
            <button onClick={clearTransaction}>Reset</button>
            <button onClick={() => restockItems()}>Update/Restock Items</button>

        </div>
    )
}

export default AdminPage