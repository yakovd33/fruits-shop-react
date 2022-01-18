import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';
import Select from 'react-select'

const Discounts = ({ tab }) => {
    const [ products, setProducts ] = useState([]);
    const [ product, setProduct ] = useState();
    const [ amount, setAmount ] = useState();
    const [ discount, setDiscount ] = useState();
    const [ discounts, setDiscounts ] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/products?all=true`).then((res) => {
            setProducts(res.data.products);
        });

        axios.get(`${process.env.API_URL}/discounts`).then((res) => {
            setDiscounts(res.data);
        });
    }, [ tab ]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.API_URL}/discounts`, {
            product, amount, discount
        }).then((res) => {
            console.log(res);
            setAmount(null);
            setDiscount(null);
        })
    }

    const deleteDiscount = (discount_id) => {
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.API_URL}/discounts/${ discount_id }`).then(res => {
                console.log(res)
                setDiscounts(discounts.filter((dis) => dis._id !== discount_id))
            });
        }
    }
    
    return (
        <div>
            <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
                <h3>הוסף מבצע חדש</h3>
                <div>
                    <Select placeholder="חיפוש מוצר" onChange={(selection, action) => setProduct(selection.value)} options={ products.map((product) => ({
                        value: product._id,
                        label: product.name
                    }))}  />
                </div>

                <div>
                    <input type="number" onChange={ (e) => setAmount(e.target.value) } placeholder="כמות" />
                </div>

                <div>
                    <input type="number" onChange={ (e) => setDiscount(e.target.value) } placeholder="הנחה בשקלים" />
                </div>

                <div>
                    <input type="submit" value="הוסף" />
                </div>
            </form>

            <div id="discounts-list">
                { discounts.map(item => (
                    <div className="discount-list-item">
                        <div className="discount-delete-btn" onClick={ () => deleteDiscount(item._id) }><BiTrash/></div>

                        <div>מוצר: { item.product_name }</div>
                        <div>כמות: { item.amount }</div>
                        <div>הנחה בשקלים: { item.discount }</div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default Discounts
