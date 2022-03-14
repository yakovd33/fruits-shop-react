import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';

const Cities = ({ tab }) => {
    const [ cities, setCities ] = useState([]);
    const [ city, setCity ] = useState('');
    const [ price, setPrice ] = useState(0);

    useEffect(() => {
        axios.get(`${process.env.API_URL}/cities`).then((res) => {
            setCities(res.data);
        });
    }, [ tab ]);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.API_URL}/cities`, {
            name: city, price
        }).then((res) => {
            console.log(res);
            setCity('');
            setPrice('');
        })
    }

    const deleteCity = (city_id) => {
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.API_URL}/cities/${ city_id }`).then(res => {
                console.log(res)
                setCities(cities.filter((dis) => dis._id !== city_id))
            });
        }
    }
    
    return (
        <div>
            <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
                <h3>הוסף עיר חדשה</h3>
                <div>
                    <input type="text" placeholder="עיר" value={ city } onChange={ (e) => setCity(e.target.value) }/>
                </div>

                <div>
                    <input type="number" onChange={ (e) => setPrice(e.target.value) } placeholder="עלות  משלוח" />
                </div>

                <div>
                    <input type="submit" value="הוסף" />
                </div>
            </form>

            <div id="cities-list">
                { cities.map(item => (
                    <div className="discount-list-item">
                        <div className="discount-delete-btn" onClick={ () => deleteCity(item._id) }><BiTrash/></div>

                        <div><strong>עיר:</strong> { item.name }</div>
                        <div><strong>מחיר:</strong> { item.price }</div>
                    </div>
                )) }
            </div>
        </div>
    )
}

export default Cities