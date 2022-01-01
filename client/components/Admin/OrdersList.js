import React, { useState, useEffect } from "react";
import OrderListItem from "./OrderListItem";
import axios from "axios";

const OrdersList = ({ tab }) => {
	const [orders, setOrders] = useState([]);
    const [ total, setTotal ] = useState(0);
    const [ curPage, setCurPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);

	useEffect(() => {
		axios.get(`${process.env.API_URL}/orders/?page=${ curPage }`).then((res) => {
            setOrders(res.data.orders);
            setTotalPages(Math.ceil(res.data.total / 20));
        });
	}, [ curPage, tab ]);

	return (
		<div id="orders-list">
			{orders.map((order) => (
				<OrderListItem
					order={ order }
					orders={ orders }
					setOrders={ setOrders }
				/>
			))}

            <div id="orders-pagination">
                { [...Array(totalPages)].map((_, index) => (
                    <div className={ `pagination-item ${index + 1 == curPage ? 'active' : ''} ${ index < (curPage - 4) || index > (curPage + 2) ? 'hide' : '' }` } onClick={ () => setCurPage(index + 1) }>{ index + 1 }</div>) 
                )}
            </div>
		</div>
	);
};

export default OrdersList;
