import axios from 'axios';
import React, { useState, useEffect } from 'react'

const OrderItemProductItem = ({ item }) => {
    const [ finalPrice, setFinalPrice ] = useState(item.price * item.amount);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/orders/product_discount/?productId=${ item.id }&amount=${item.amount}`).then((res) => {
            setFinalPrice(finalPrice - parseInt(res.data));
        });
    }, [item])

  return (
    <div className="order-cart-item">
        { item.name } * { item.amount } - { finalPrice }₪
        <br/>
    </div>
  )
}

export default OrderItemProductItem