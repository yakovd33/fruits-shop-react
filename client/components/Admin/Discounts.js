import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Discounts = () => {
    const [ products, setProducts ] = useState([]);
    const [ product, setProduct ] = useState();
    const [ amount, setAmount ] = useState();
    const [ discount, setDiscounts ] = useState();

    useEffect(() => {
        axios.get(`${process.env.API_URL}/products?all=true`).then((res) => {
            setProducts(res.data.products);
        });

        axios.get(`${process.env.API_URL}/discounts`).then((res) => {
            setDiscounts(res.data);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.API_URL}/discounts`).then((res) => {
            console.log(res)
        })
    }
    
    return (
        <div>
            <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
                <h3>הוסף מבצע חדש</h3>
                <div>
                    <select htmlFor="">
                        <option value="">בחר מוצר</option>
                        { products.map(product => (
                            <option value={ product._id }>{ product.name }</option>
                        )) }
                    </select>
                </div>

                <div>
                    <input type="number" placeholder="כמות" />
                </div>

                <div>
                    <input type="number" placeholder="הנחה בשקלים" />
                </div>

                <div>
                    <input type="submit" value="הוסף" />
                </div>
            </form>
        </div>
    )
}

export default Discounts
