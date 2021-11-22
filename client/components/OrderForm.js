import React, { useState } from 'react';
import axios from 'axios';

const OrderForm = ({ setOrderFormTog }) => {
    const [ fullname, setFullname ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ city, setCity ] = useState('');
    const [ street, setStreet ] = useState('');
    const [ apartment, setApartment ] = useState('');
    const [ notes, setNotes ] = useState('');
    const [ feedback, setFeedback ] = useState('');
    const [ isEmptyFields, setIsEmptyFields ] = useState(false);

    const handleSubmit = () => {
        if (fullname && phone && city && street && apartment) {
            axios.post(`${process.env.API_URL}/orders`, {
                fullname: fullname,
                phone: phone,
                city: city,
                street: street,
                apartment: apartment,
                notes: notes,
                cart: localStorage.getItem('cart')
            }).then((res) => {
                console.log(res)
            });

            setFeedback('ההזמנה בוצעה בהצלחה.');
            setIsEmptyFields(false);
        } else {
            setIsEmptyFields(true);
            setFeedback('עלייך למלא את כל שדות החובה.');
        }
    }

    return ( 
        <div id="order-form">
            <div className="input-group">
                <input type="text" className={ `${ isEmptyFields && !fullname ? 'empty' : '' }` } value={ fullname } onChange={ (e) => setFullname(e.target.value) } placeholder="שם מלא" name="fullname" />
            </div>

            <div className="input-group">
                <input type="text" className={ `${ isEmptyFields && !phone ? 'empty' : '' }` } value={ phone } onChange={ (e) => setPhone(e.target.value) } placeholder="מספר טלפון" name="phone" />
            </div>

            <div className="input-group">
                <input type="text" className={ `${ isEmptyFields && !city ? 'empty' : '' }` } value={ city } onChange={ (e) => setCity(e.target.value) } placeholder="עיר" name="city" />
            </div>

            <div className="input-group">
                <input type="text" className={ `${ isEmptyFields && !street ? 'empty' : '' }` } value={ street } onChange={ (e) => setStreet(e.target.value) } placeholder="רחוב" name="street" />
            </div>

            <div className="input-group">
                <input type="text" className={ `${ isEmptyFields && !apartment ? 'empty' : '' }` } value={ apartment } onChange={ (e) => setApartment(e.target.value) } placeholder="דירה" name="apartment" />
            </div>

            <div className="input-group">
                <textarea type="text" value={ notes } onChange={ (e) => setNotes(e.target.value) } placeholder="הערות" name="notes"></textarea>
            </div>

            { feedback && <p id="order-form-feedback">{ feedback }</p> }

            <div className="input-group">
                <input type="submit" onClick={ handleSubmit } className="cute-btn" value="ביצוע הזמנה" />
            </div>
        </div>
    );
}
 
export default OrderForm;