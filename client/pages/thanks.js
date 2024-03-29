import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const Thanks = () => {
    const router = useRouter();
    const { cField1 } = router.query;

	useEffect(() => {
		if (cField1) {
			axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders/pay/`, { customFields: {
				cField1: router.query.cField1,
				cField2: router.query.cField2
			} }).then((res) => {
				console.log(res)
			})
		}
	}, [ cField1 ]);

    return (
        <div id="thanks-page">
			<br />
            <img src="/images/vegetables.jpg" height="100px" alt="" />

			<h1>תודה על ההזמנה!</h1>
			<h3>מספר הזמנה - { cField1 }</h3>
        </div>
    )
}

export default Thanks
