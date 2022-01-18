import React, { useState, useEffect } from 'react';
import Select from 'react-select'
import axios from 'axios';
import giftItem from './GiftItem';
import GiftItem from './GiftItem';

const Gifts = ({ tab }) => {
    const [ products, setProducts ] = useState([]);
    const [ productId, setProductId ] = useState();
    const [ gifts, setGifts ] = useState([]);

    useEffect(() => {
        // Get all products
        axios.get(`${process.env.API_URL}/products?all=true`).then((res) => {
            setProducts(res.data.products);
        });

        // Get all gifts from DB
        axios.get(`${process.env.API_URL}/gifts`).then((res) => {
            setGifts(res.data);
        });
    }, [ tab ]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.API_URL}/gifts`, {
            productId
        }).then((res) => {
            console.log(res);
        })
    }

    return (
        <div>
            <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
                <h3>הוסף מתנה חדשה</h3>
                <div>
                    <Select placeholder="חיפוש מוצר" onChange={(selection, action) => setProductId(selection.value)} options={ products.map((product) => ({
                        value: product.id,
                        label: product.name
                    }))}  />
                </div>

                <div>
                    <input type="submit" value="הוסף" />
                </div>
            </form>

            <div id="gifts-list">
                { gifts.map(item => (
                    <GiftItem gift={ item } gifts={ gifts } setGifts={ setGifts }/>
                )) }
            </div>
        </div>
    )
}

export default Gifts
