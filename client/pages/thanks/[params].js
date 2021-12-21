import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const thanks = () => {
    const router = useRouter();
    const {id} = router.query;

	useEffect(() => {
		if (id) {
			axios.post('${process.env.API_URL}/orders/pay', { id }).then((res) => {
				console.log(res)
			})
		}
	}, [ id ]);

    return (
        <div>
            <img src="/images/vegetables.jpg" height="100px" alt="" />
        </div>
    )
}

export default thanks
