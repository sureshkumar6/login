import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const ProductList = () => {
    const [products, setProducts] = useState([])

    useEffect(() => {
        getProduct()
    }, [])

    const getProduct = async () => {
        let result = await fetch("http://localhost:6060/list")
        result = await result.json()
        setProducts(result)
    }
    // console.log(products)

    const handleDelete = async (id) => {
        console.log(id)
        let result = await fetch(`http://localhost:6060/delete/${id}`, {
            method: "delete"
        })
        result = await result.json()
        if (result) {
            getProduct()
        }

    }

    const searhHandle = async (event) => {
        let key = event.target.value
        if (key) {
            let result = await fetch(`http://localhost:6060/search/${key}`)
            result = await result.json()
            if (result) {
                setProducts(result)
            }
        } else {
            getProduct()
        }
    }

    return (
        <div className="product-table">
            <h1>Product List</h1>
            <input className="search-box" type="text" placeholder="Search"
                onChange={searhHandle} />
            <ul>
                <li>S.No</li>
                <li>Company</li>
                <li>Name</li>
                <li>Price</li>
                <li>Category</li>
                <li>Operation</li>
            </ul>
            {
                products.length > 0 ? products.map((item, index) =>
                    <ul>
                        <li key="{index.sno}">{index + 1}</li>
                        <li key="{index.company}">{item.company}</li>
                        <li key="{index.name}">{item.name}</li>
                        <li key="{index.price}">${item.price}</li>
                        <li key="{index.category}">{item.category}</li>
                        <li>
                            <button onClick={() => handleDelete(item._id)}>Delete</button>
                            <button><Link to={'/update/' + item._id}>Update</Link> </button>
                        </li>
                    </ul>
                )
                    : <h5>No Record</h5>
            }
        </div>
    )
}
export default ProductList