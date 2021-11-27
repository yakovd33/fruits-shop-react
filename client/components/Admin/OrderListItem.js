const OrderListItem = ({ order }) => {
    const format_time = (s) => {
        var date = new Date(+s);
        return date.toLocaleString()
    }
      
	return (
		<div className="order-list-item">
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
		</div>
	);
};

export default OrderListItem;
