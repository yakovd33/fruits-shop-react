import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import CartHelper from '../helpers/CartHelper';
import OrderGiftItem from './OrderGiftItem';
import Select from 'react-select';

const OrderForm = ({ setOrderFormTog }) => {
    const [ fullname, setFullname ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ city, setCity ] = useState('');
    const [ cityObject, setCityObject    ] = useState(0);
    const [ street, setStreet ] = useState('');
    const [ apartment, setApartment ] = useState('');
    const [ notes, setNotes ] = useState('');
    const [ feedback, setFeedback ] = useState('');
    const [ isEmptyFields, setIsEmptyFields ] = useState(false);
    const [ paymentUrl, setPaymentUrl ] = useState(null);
    const [ termsAgreed, setTermsAgreed ] = useState(false);

    const [ cartAmount, setCartAmount ] = useState(0);
    const [ gifts, setGifts ] = useState([]);
    const [ chosenGift, setChosenGift ] = useState(null);
    const [ cities, setCities ] = useState([]);

    useEffect(() => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }

        // Get city list
        axios.get(`${process.env.API_URL}/cities`).then((res) => {
            setCities(res.data);
        });
    }, [ paymentUrl ]);

    useEffect(() => {
        // setCartAmount(CartHelper.getAmountFromLocalStorage(localStorage.getItem('cart')));
        setCartAmount(localStorage.getItem('cart-price'));
    }, []);

    useEffect(() => {
        // Get all gifts

        if (cartAmount >= 250) {
            axios.get(`${process.env.API_URL}/gifts`).then(res => {
                setGifts(res.data)
            })
        }
    }, [ cartAmount ])

    const handleSubmit = (method) => {
        if (termsAgreed) {
            if (fullname && email && phone && city && street && apartment) {
                axios.post(`${process.env.API_URL}/orders`, {
                    fullname: fullname,
                    email: email,
                    phone: phone,
                    city: city,
                    street: street,
                    apartment: apartment,
                    notes: notes,
                    cart: localStorage.getItem('cart'),
                    gift: chosenGift,
                    method
                }).then((res) => {
                    console.log(res.data);

                    if (res.data.data.url) {
                        setPaymentUrl(res.data.data.url);
                    }
                });

                setFeedback('הנך מועבר/ת לתשלום.');
                setIsEmptyFields(false);
            } else {
                setIsEmptyFields(true);
                setFeedback('עלייך למלא את כל שדות החובה.');
            }
        }
    }

    const handleCityChange = (city_id) => {
        cities.map((item) => {
            if (item._id == city_id) {
                setCityObject(item);
            }
        });

        setCity(city_id);
    }

    return (
        <div>
            <div id="order-form" className={ `${ paymentUrl ? 'hidden' : '' }` }>
                {/* Show gift selection if amount is more than 250 */}
                { cartAmount >= 250 && <div>
                    <div><strong>מאחר וקנית מעל 250 ש"ח מגיע לך לבחור מתנה:</strong></div>

                    <div id="order-choices">
                        { gifts.map((item) => (
                            <OrderGiftItem item={ item } chosenGift={ chosenGift } setChosenGift={ setChosenGift }/>
                        )) }
                    </div>
                </div>}
                
                <div id="order-fields-msg"><strong>חובה להזין שם ושם משפחה ומספר טלפון בפורמט תקין (לדוגמא 0509876543)</strong></div>
                <div className="input-group">
                    <input type="text" className={ `${ isEmptyFields && !fullname ? 'empty' : '' }` } value={ fullname } onChange={ (e) => setFullname(e.target.value) } placeholder="שם מלא" name="fullname" />
                </div>

                <div className="input-group">
                    <input type="email" className={ `${ isEmptyFields && !email ? 'empty' : '' }` } value={ email } onChange={ (e) => setEmail(e.target.value) } placeholder="אימייל" name="email" />
                </div>

                <div className="input-group">
                    <input type="text" className={ `${ isEmptyFields && !phone ? 'empty' : '' }` } value={ phone } onChange={ (e) => setPhone(e.target.value) } placeholder="מספר טלפון" name="phone" />
                </div>

                {/* <div className="input-group">
                    <input type="text" className={ `${ isEmptyFields && !city ? 'empty' : '' }` } value={ city } onChange={ (e) => setCity(e.target.value) } placeholder="עיר" name="city" />
                </div> */}

                <div className="input-group">
                    <Select placeholder="בחר/י עיר עבור משלוח" onChange={(selection, action) => handleCityChange(selection.value)} options={ cities.map((city) => ({
                        value: city._id,
                        label: city.name
                    }))}  />
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

                <div className="input-group">
                    <label htmlFor=""><input type="checkbox" onChange={ () => setTermsAgreed(!termsAgreed) } checked={ termsAgreed }/> אני מאשר/ת את <Link href="/legal">תקנון האתר.</Link></label>
                </div>

                { feedback && <p id="order-form-feedback">{ feedback }</p> }

                <div id="arrival-msg-order">
                    המשלוח  אמור להגיע אליכם בין 1 יום עסקים לשלושה ימי עסקים עקב קטיפים  רבים  שמתבצעים ומשתנים כול העת  כך שאין יום הגעה קבוע,לאחר ההזמנה נצור אתכם קשר לתיאום הגעה  ,בנוסף ניתן לצור קשר בוואטספ או מס' נייד המצורף בבועות שבצדדים
                </div>

                <div id="shipping-msg">
                    { city && <p>עלות משלוח עבור { cityObject.name } היא { cityObject.price }₪</p> } 
                </div>

                <div className="input-group" id="order-form-submits">
                    <input type="submit" onClick={ () => handleSubmit('credit') } className="cute-btn" value="תשלום באשראי" disabled={ !termsAgreed } />
                    <input type="submit" onClick={ () => handleSubmit('bit') } className="cute-btn bit" value="תשלום בביט" disabled={ !termsAgreed } />
                </div>
            </div>

            {/* <div id="payment-form" className={ `${ !paymentUrl ? 'hidden' : '' }` }>
                <iframe src={ paymentUrl } frameborder="0"></iframe>
            </div> */}
        </div>
    );
}
 
export default OrderForm;