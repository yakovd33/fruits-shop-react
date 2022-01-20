import React, { useState, useEffect } from 'react';
import { BiTrash } from 'react-icons/bi';
import axios from 'axios';

const OrderListItem = ({ order, orders, setOrders }) => {
	const [ cart, setCart ] = useState(JSON.parse(order.cart));
	const [ finalPrice, setFinalPrice ] = useState(0);
	const [ gift, setGift ] = useState(null);

	useEffect(() => {
		let sum = 0;

		cart.map((item) => {
			sum += (item.price * item.amount);
		});

		setFinalPrice(sum);
	}, [ cart ]);

	// Get the gift
	useEffect(() => {
		if (order.gift) {
			axios.get(`${process.env.API_URL}/products/${ order.gift }`).then((res) => {
				setGift(res.data);
			});
		}
	}, [ order ]);

    const format_time = (s) => {
        var date = new Date(+s);
        return date.toLocaleString()
	}

	const handleDelete = () => {
		if (prompt('על מנת למחוק הזמנה הקש סיסמא') == '123123') {
			axios.delete(`${process.env.API_URL}/orders/${order._id}`).then((res) => {
				setOrders(orders.filter((item) => item._id !== order._id));
			});
		}
	}

	return (
		<div className="order-list-item">
			<div className="order-delete-btn" onClick={ handleDelete }><BiTrash/></div>
			<div className="order-list-item-line">
				<div className="title">שם מלא</div>
				<div className="det">{order.fullname}</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">טלפון</div>
				<div className="det">{order.phone}</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">עיר</div>
				<div className="det">{order.city}</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">רחוב</div>
				<div className="det">{order.street}</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">דירה</div>
				<div className="det">{order.apartment}</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">הערות</div>
				<div className="det">{order.notes}</div>
			</div>

            <div className="order-list-item-line">
				<div className="title">תאריך</div>
				<div className="det">{format_time(order.date)}</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">מחיר סופי:</div>
				<div className="det">{ order.price }₪</div>
			</div>

			{ gift && 
				<div className="order-list-item-line">
					<div className="title">מתנה:</div>
					<div className="det">{ gift.name }</div>
				</div>
			}

			<div className="order-list-item-line">
				<div className="title">בוצע תשלום:</div>
				<div className="det">{ `${ order.payed ? 'כן' : 'לא' }` }</div>
			</div>

			<div className="order-list-item-line">
				<div className="title">מוצרים:</div>
			</div>

			<div className="order-list-item-cart">
				{ cart.map((item) => (
					<div className="order-cart-item">
						{ item.name } * { item.amount }
						<br/>
					</div>
				)) }
			</div>
		</div>
	);
};

export default OrderListItem;
