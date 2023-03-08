import React, { useState, useEffect } from 'react';
import axios from 'axios';
const { NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET } = process.env;

const OrderGiftItem = ({ item, chosenGift, setChosenGift }) => {
    const [ product, setProduct ] = useState(null);

    useEffect(() => {
        // Get product details
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/${ item.productId }`).then((res) => {
            setProduct(res.data);
        });
    }, []);

    return (
        <div>
            { product && 
                <div className={ `gift-choice ${ item.productId == chosenGift ? 'selected' : '' }` } onClick={ () => setChosenGift(item.productId) }>
                    <img src={ `https://${NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET}/${ item.productId }.jpg` } alt="" />
                    <p>{ product.name }</p>
                </div>
            }
        </div>
    )
}

export default OrderGiftItem
