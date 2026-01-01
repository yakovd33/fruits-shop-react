import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Select from 'react-select';
import { SiVisa } from 'react-icons/si';
import { FaApplePay } from 'react-icons/fa';
import OrderGiftItem from '../components/OrderGiftItem';
import BitIcon from '../components/Cart/BitIcon';
import Image from 'next/image';

const OrderPage = ({ cartItems = [] }) => {
    const [ fullname, setFullname ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ phone, setPhone ] = useState('');
    const [ city, setCity ] = useState('');
    const [ cityObject, setCityObject ] = useState(null);
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
    const [ couponCode, setCouponCode ] = useState(null);
    const [ couponDiscount, setCouponDiscount ] = useState(0);
    const [ couponInput, setCouponInput ] = useState('');
    const [ couponMessage, setCouponMessage ] = useState('');
    const [ couponMessageType, setCouponMessageType ] = useState(null);
    const [ couponLoading, setCouponLoading ] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/cities`).then((res) => {
            setCities(res.data || []);
        });
    }, []);

    useEffect(() => {
        if (paymentUrl) {
            window.location.href = paymentUrl;
        }
    }, [ paymentUrl ]);

    useEffect(() => {
        if (Array.isArray(cartItems) && cartItems.length) {
            const subtotal = cartItems.reduce((sum, item) => {
                const price = Number(item.price) || 0;
                const amount = Number(item.amount) || 0;
                return sum + price * amount;
            }, 0);
            setCartAmount(subtotal);
            return;
        }

        if (typeof window !== 'undefined') {
            const storedPrice = Number(window.localStorage.getItem('cart-price')) || 0;
            setCartAmount(storedPrice);
        }
    }, [ cartItems ]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedCoupon = window.localStorage.getItem('cart-coupon');

        if (storedCoupon) {
            try {
                const parsed = JSON.parse(storedCoupon);
                if (parsed?.code) {
                    setCouponCode(parsed.code);
                    setCouponDiscount(Number(parsed.discount) || 0);
                }
            } catch (error) {
                window.localStorage.removeItem('cart-coupon');
            }
        }
    }, []);

    useEffect(() => {
        if (cartAmount >= 250) {
            axios.get(`${process.env.NEXT_PUBLIC_API_URL}/gifts`).then((res) => {
                setGifts(res.data || []);
            });
        } else {
            setGifts([]);
            setChosenGift(null);
        }
    }, [ cartAmount ]);

    const normalizeCouponCode = (code = '') => code.trim().toUpperCase();

    const validateCoupon = async (code, { silent = false } = {}) => {
        const normalizedCode = normalizeCouponCode(code);

        if (!normalizedCode) {
            setCouponMessage('אנא הזן קוד קופון');
            setCouponMessageType('error');
            return;
        }

        if ((cartAmount || 0) <= 0) {
            setCouponMessage('לא ניתן להחיל קופון על עגלה ריקה');
            setCouponMessageType('error');
            return;
        }

        if (couponLoading) {
            return;
        }

        setCouponLoading(true);
        if (!silent) {
            setCouponMessage('');
            setCouponMessageType(null);
        }

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`, {
                code: normalizedCode,
                cartTotal: cartAmount || 0
            });

            if (data.valid) {
                setCouponCode(data.coupon.code);
                setCouponDiscount(Number(data.discount) || 0);
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('cart-coupon', JSON.stringify({ code: data.coupon.code, discount: data.discount }));
                }
                setCouponInput('');

                if (!silent) {
                    setCouponMessage(data.message);
                    setCouponMessageType('success');
                }
            } else {
                setCouponCode(null);
                setCouponDiscount(0);
                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('cart-coupon');
                }

                if (!silent) {
                    setCouponMessage(data.message);
                    setCouponMessageType('error');
                }
            }
        } catch (error) {
            const message = error?.response?.data?.message || 'שגיאה בבדיקת הקופון';
            setCouponMessage(message);
            setCouponMessageType('error');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleApplyCoupon = (event) => {
        event.preventDefault();
        validateCoupon(couponInput, { silent: false });
    };

    const handleRemoveCoupon = () => {
        setCouponCode(null);
        setCouponDiscount(0);
        setCouponInput('');
        setCouponMessage('הקופון הוסר');
        setCouponMessageType('info');
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('cart-coupon');
        }
    };

    const handleCityChange = (option) => {
        if (!option) {
            setCity('');
            setCityObject(null);
            return;
        }

        setCity(option.value);
        const selected = cities.find((item) => item._id === option.value);
        setCityObject(selected || null);
    };

    const handleSubmit = (method) => {
        if (!termsAgreed) {
            setFeedback('יש לאשר את התקנון לפני המשך התשלום.');
            return;
        }

        if (fullname && email && phone && city && street && apartment) {
            const cartPayload = cartItems?.length
                ? JSON.stringify(cartItems)
                : (typeof window !== 'undefined' ? localStorage.getItem('cart') : '[]');

            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
                fullname,
                email,
                phone,
                city,
                street,
                apartment,
                notes,
                cart: cartPayload,
                gift: chosenGift,
                method,
                couponCode,
                couponDiscount
            }).then((res) => {
                if (res?.data?.data?.url) {
                    setPaymentUrl(res.data.data.url);
                }
            }).catch((error) => {
                setFeedback(error?.response?.data?.msg || 'אירעה שגיאה בשליחת ההזמנה.');
            });

            setFeedback('מפנים אותך למסך התשלום המאובטח.');
            setIsEmptyFields(false);
        } else {
            setIsEmptyFields(true);
            setFeedback('אנא מלאו את כל שדות החובה כדי להמשיך.');
        }
    };

    const cityOptions = useMemo(() => {
        return cities.map((option) => ({
            value: option._id,
            label: `${option.name} • ${option.price}₪`
        }));
    }, [ cities ]);

    const selectedCityOption = cityOptions.find((option) => option.value === city) || null;

    const shippingMessage = city && cartAmount < 250 && cityObject
        ? `עלות משלוח עבור ${cityObject.name} היא ${cityObject.price}₪`
        : 'משלוח חינם בקנייה מעל 250₪.';

    const shippingCost = cartAmount >= 250 ? 0 : cityObject ? Number(cityObject.price) || 0 : null;
    const payableTotal = Math.max((cartAmount || 0) - couponDiscount + (shippingCost || 0), 0);

    return (
        <main className="order-page">
            <div className="container order-page-body">
                <section className="order-page-content">
                    <div className="order-main">
                        { cartAmount >= 250 && (
                            <section className="order-card order-gifts">
                                <div>
                                    <span className="order-card-eyebrow">בגלל שקניתם מעל 250₪</span>
                                    <h2>בחרו מתנה לבית</h2>
                                    <p>בחרו מתנה אחת שתצטרף למשלוח – כולן מהמגוון האהוב שלנו.</p>
                                </div>
                                <div className="order-gifts-grid">
                                    { gifts.map((gift) => (
                                        <OrderGiftItem
                                            key={ gift._id }
                                            item={ gift }
                                            chosenGift={ chosenGift }
                                            setChosenGift={ setChosenGift }
                                        />
                                    )) }
                                </div>
                            </section>
                        ) }

                        <section className="order-card order-form-card">
                            <div className="order-card-header">
                                <span className="order-card-eyebrow">פרטי לקוח</span>
                                <h2>איך נזהה אתכם?</h2>
                            </div>
                            <div className="order-form-grid">
                                <label className="order-input">
                                    <span>שם מלא*</span>
                                    <input
                                        type="text"
                                        value={ fullname }
                                        onChange={ (event) => setFullname(event.target.value) }
                                        className={ isEmptyFields && !fullname ? 'invalid' : '' }
                                        placeholder="שם פרטי ומשפחה"
                                    />
                                </label>
                                <label className="order-input">
                                    <span>אימייל*</span>
                                    <input
                                        type="email"
                                        value={ email }
                                        onChange={ (event) => setEmail(event.target.value) }
                                        className={ isEmptyFields && !email ? 'invalid' : '' }
                                        placeholder="name@email.com"
                                    />
                                </label>
                                <label className="order-input">
                                    <span>טלפון לנציג*</span>
                                    <input
                                        type="tel"
                                        value={ phone }
                                        onChange={ (event) => setPhone(event.target.value) }
                                        className={ isEmptyFields && !phone ? 'invalid' : '' }
                                        placeholder="0501234567"
                                    />
                                </label>
                                <label className="order-input full">
                                    <span>עיר משלוח*</span>
                                    <Select
                                        classNamePrefix="order-select"
                                        placeholder="בחרו עיר"
                                        value={ selectedCityOption }
                                        onChange={ handleCityChange }
                                        options={ cityOptions }
                                        isClearable
                                        isRtl
                                    />
                                </label>
                                <label className="order-input">
                                    <span>רחוב*</span>
                                    <input
                                        type="text"
                                        value={ street }
                                        onChange={ (event) => setStreet(event.target.value) }
                                        className={ isEmptyFields && !street ? 'invalid' : '' }
                                        placeholder="רחוב למשלוח"
                                    />
                                </label>
                                <label className="order-input">
                                    <span>דירה / בית*</span>
                                    <input
                                        type="text"
                                        value={ apartment }
                                        onChange={ (event) => setApartment(event.target.value) }
                                        className={ isEmptyFields && !apartment ? 'invalid' : '' }
                                        placeholder="מספר בית, דירה או שער"
                                    />
                                </label>
                                <label className="order-input full">
                                    <span>הערות למשלוח</span>
                                    <textarea
                                        value={ notes }
                                        onChange={ (event) => setNotes(event.target.value) }
                                        placeholder="כניסה אחורית, שומר בכניסה או כל בקשה מיוחדת"
                                    />
                                </label>
                            </div>

                            { feedback && <div className="order-alert">{ feedback }</div> }
                        </section>
                    </div>

                    <aside className="order-aside">
                        <section className="order-card order-coupon-card">
                            <div className="order-card-header">
                                <span className="order-card-eyebrow">יש לכם קוד?</span>
                                <h2>הוספת קופון</h2>
                            </div>
                            <form className="order-coupon-form" onSubmit={ handleApplyCoupon }>
                                <input
                                    type="text"
                                    placeholder="קוד קופון"
                                    value={ couponInput }
                                    onChange={ (event) => setCouponInput(event.target.value.toUpperCase()) }
                                    disabled={ couponLoading }
                                />
                                <button type="submit" disabled={ couponLoading }>
                                    { couponLoading ? 'בודק...' : 'החלת קופון' }
                                </button>
                                { couponCode && (
                                    <button
                                        type="button"
                                        className="secondary"
                                        onClick={ handleRemoveCoupon }
                                        disabled={ couponLoading }
                                    >
                                        הסרת קופון
                                    </button>
                                ) }
                            </form>
                            { couponMessage && (
                                <p className={ `order-coupon-message ${ couponMessageType || '' }` }>{ couponMessage }</p>
                            ) }
                            { couponCode && (
                                <div className="order-coupon-active">
                                    <span>קופון פעיל</span>
                                    <strong>{ couponCode }</strong>
                                    <span className="discount">-{ couponDiscount }₪</span>
                                </div>
                            ) }
                        </section>

                        <section className="order-card order-summary-card">
                            <span className="order-card-eyebrow">פרטי הזמנה</span>
                            <h2>תקציר מהיר</h2>
                            <ul>
                                <li>
                                    <span>סכום ביניים</span>
                                    <strong>{ cartAmount }₪</strong>
                                </li>
                                { couponDiscount > 0 && (
                                    <li>
                                        <span>קופון { couponCode }</span>
                                        <strong className="discount">-{ couponDiscount }₪</strong>
                                    </li>
                                ) }
                                <li>
                                    <span>משלוח</span>
                                    <strong>{ cartAmount >= 250 ? 'חינם' : cityObject ? `${cityObject.price}₪` : 'יחושב לאחר בחירת עיר' }</strong>
                                </li>
                            </ul>
                            <div className="order-summary-total">
                                <span>סכום לתשלום</span>
                                <strong>{ payableTotal }₪</strong>
                            </div>
                            <div className="order-summary-payment-methods">
                                <p>בחרו אמצעי תשלום</p>
                                <div className="order-summary-payment-icons">
                                    <button
                                        type="button"
                                        className="payment-icon"
                                        onClick={ () => handleSubmit('credit') }
                                        disabled={ !termsAgreed }
                                        aria-label="כרטיס אשראי"
                                    >
                                        <span className="payment-icon-media credit">
                                            <SiVisa size={42}/>
                                        </span>
                                        <span className="payment-icon-label">כרטיס אשראי</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="payment-icon"
                                        onClick={ () => handleSubmit('bit') }
                                        disabled={ !termsAgreed }
                                        aria-label="Bit"
                                    >
                                        <span className="payment-icon-media bit">
                                            <BitIcon className="bit-logo" width={68} height={32}/>
                                        </span>
                                        <span className="payment-icon-label">Bit</span>
                                    </button>
                                    <button
                                        type="button"
                                        className="payment-icon"
                                        onClick={ () => handleSubmit('apple') }
                                        disabled={ !termsAgreed }
                                        aria-label="Apple Pay"
                                    >
                                        <span className="payment-icon-media apple">
                                            <FaApplePay size={42}/>
                                        </span>
                                        <span className="payment-icon-label">Apple Pay</span>
                                    </button>
                                </div>
                                { !termsAgreed && <p className="order-summary-payment-hint">יש לאשר את התקנון כדי לשלם.</p> }
                            </div>
                            <div className="order-terms order-summary-terms">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={ termsAgreed }
                                        onChange={ () => setTermsAgreed(!termsAgreed) }
                                    />
                                    <span className="order-terms-copy">
                                        אני מאשר/ת את <Link href="/legal">תקנון האתר</Link> ומסכים/ה ליצירת קשר עבור תיאום משלוח.
                                    </span>
                                </label>
                            </div>
                        </section>

                        <section className="order-card order-info-card">
                            <span className="order-card-eyebrow">מידע שימושי</span>
                            <ul>
                                <li>משלוח חינם בקנייה מעל 250₪</li>
                                <li>המשלוחים יוצאים בלילות כדי שהירקות יגיעו אליכם כשהם בשיא הרעננות. תקבלו הודעה לתיאום לפני ההגעה</li>
                                <li>אספקה עד 2 ימי עסקים לפי מסלולי החלוקה.</li>
                                <li>שירות לקוחות זמין בווטסאפ לכל שאלה.</li>
                                <li>אפשר לאסוף את הסל גם עבור חברים ומשפחה.</li>
                            </ul>
                        </section>

                        <section className="order-card order-contact-card">
                            <span className="order-card-eyebrow">צריכים עזרה?</span>
                            <p>אנחנו זמינים בווטסאפ ובטלפון ביום ההזמנה. שלחו הודעה ונחזור אליכם במהירות.</p>
                            <a className="order-support-link" href="https://wa.me/972523207007" target="_blank" rel="noreferrer">דברו איתנו בוואטסאפ</a>
                        </section>
                    </aside>
                </section>
            </div>
        </main>
    );
};

export default OrderPage;
