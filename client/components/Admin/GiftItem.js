import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';

const GiftItem = ({ gift, gifts, setGifts }) => {
    const [ product, setProduct ] = useState(null);

    const deleteGift = (productId) => {
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.API_URL}/gifts/${ productId }`).then(res => {
                console.log(res);
                setGifts(gifts.filter((gif) => gif.productId !== productId))
            });
        }
    }

    useEffect(() => {
        // Get product details
        axios.get(`${process.env.API_URL}/products/${ gift.productId }`).then((res) => {
            setProduct(res.data);
        });
    }, []);
    
    return (
        <div className="discount-list-item">
            <div className="discount-delete-btn" onClick={ () => deleteGift(gift.productId) }><BiTrash/></div>

            <div>מוצר: { product && product.name }</div>
        </div>
    )
}

export default GiftItem
