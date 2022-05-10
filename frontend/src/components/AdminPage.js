import React, { useState, useEffect, useRef } from 'react'
const CONFIG = require("../config.json")
const axios = require('axios')
const AdminPage = ({ updateNeeded, setUpdateNeeded }) => {
    //setState({ sodas: null })
    const [curState, setState] = useState(new Map())
    const [restockSet, setNewSet] = useState(new Map())
    const url = "http://" + CONFIG.backendHost + ':' + CONFIG.backendPort + '/colas'
    const updateRef = useRef(updateNeeded)
    const restockItems = () => {
        if (restockSet.size === 0) {
            alert("No selected Items")
            return;
        }
        restockSet.forEach(async item => {
            const { status } = await axios.put(url, { item })
            if (status !== 200) {
                alert("Oh Dear")
            }
        }
        )
        setUpdateNeeded(updateNeeded |= 1)
    }
    const setNewPrices = (event) => {
        event.preventDefault();
        if (restockSet instanceof Array) {
            setNewSet(new Map())
        }
        const key = event.target.id;
        const amount = parseFloat(event.target[0].value)
        var item;
        if (restockSet.has(key)) {
            item = restockSet.get(key)
        }
        else {
            item = curState.get(key)
        }
        if (item === undefined) {
            return
        }
        item.Cost = amount;
        restockSet.set(key, item)
    }

    const setRestockAmount = (event) => {
        event.preventDefault();
        if (restockSet instanceof Array) {
            setNewSet(new Map())
        }
        const key = event.target.id;
        const amount = parseInt(event.target[0].value)
        var item;
        if (restockSet.has(key)) {
            item = restockSet.get(key)
        }
        else {
            item = curState.get(key)
        }
        item.CurrentQuantity += amount;
        if (item.CurrentQuantity > item.MaxQuantity) {
            alert("Too Many Items resetting to current max")
            item.CurrentQuantity = item.MaxQuantity
        }
        restockSet.set(key, item)
    }
    const getSodaState = async () => {
        const { data } = await axios.get(url)
        if (data !== undefined) {
            console.log(data)
            const arrAsMap = new Map(
                data.map(object => {
                    return [object["Product Name"], object];
                }),
            );
            setState(arrAsMap)
        }
    }
    useEffect(() => { getSodaState() }, [])
    useEffect(() => {
        async function x() {
            if (updateNeeded & 2) {
                setUpdateNeeded(updateNeeded = updateNeeded & ~2)
                setState(await getSodaState());
            }
        }
    }, [updateNeeded]);

    const listItems = Array.from(curState.entries()).map((item) =>
        <div style={{ display: 'flow' }}>
            <p>Item {item[0]} Current Price: {item[1].Cost}</p>
            <p>Item {item[0]} Quantity: {item[1].MaxQuantity} MaximumQuantity: {item[1].CurrentQuantity}</p>

            <form key={item[0]} id={item[0]} onSubmit={setRestockAmount}>

                <label >Enter restock amount {item[0]}:
                    <input type="number"
                    />
                </label>
            </form>

            <form key={item[0] + "Price"} id={item[0]} onSubmit={setNewPrices}>
                <label >Enter new price amount {item[0]}:
                    <input type="float"
                    />
                </label>
            </form>
            <p></p>
        </div>
    )
    return (
        <div>
            <p>Special Admin Page</p>
            {listItems}

            <button onClick={() => restockItems()}>Update/Restock Items</button>

        </div>
    )
}

export default AdminPage