import React, { useState, useEffect } from 'react';
import CartItem from "./CartItem";
import { AiOutlineClose } from 'react-icons/ai';
import OrderForm from '../OrderForm';
import axios from 'axios';
import CartSuggestions from './CartSuggestions';

const Cart = ({ cartTog, setCartTog, cartItems, setCartItems }) => {
    const [ orderFormTog, setOrderFormTog ] = useState(false);
    const [ cartSum, setCartSum ] = useState(0);
    const [ cartSumBeforeDiscounts, setCartSumBeforeDiscounts ] = useState(0);
    const [ discount, setDiscount ] = useState(0);
    const [ saleSubtotal, setSaleSubtotal ] = useState(0);
    const [ subtotalAfterDiscounts, setSubtotalAfterDiscounts ] = useState(0);
    const [ couponCodeInput, setCouponCodeInput ] = useState('');
    const [ couponDiscount, setCouponDiscount ] = useState(0);
    const [ couponMessage, setCouponMessage ] = useState('');
    const [ couponMessageType, setCouponMessageType ] = useState(null);
    const [ couponLoading, setCouponLoading ] = useState(false);
    const [ appliedCoupon, setAppliedCoupon ] = useState(null);

    const formatMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;

    useEffect(() => {
        let isMounted = true;

        const calculateTotals = async () => {
            let saleSum = 0;
            let originalSum = 0;

            cartItems.forEach((item) => {
                saleSum += item.price * item.amount;
                originalSum += item.originalPrice * item.amount;
            });

            if (!cartItems.length) {
                if (isMounted) {
                    setDiscount(0);
                    setSaleSubtotal(0);
                    setCartSumBeforeDiscounts(0);
                    setSubtotalAfterDiscounts(0);
                    window.localStorage.setItem('discount', 0);

                    if (typeof window !== 'undefined') {
                        let storedCartItems = [];
                        try {
                            storedCartItems = JSON.parse(window.localStorage.getItem('cart')) || [];
                        } catch (error) {
                            storedCartItems = [];
                        }

                        if (!storedCartItems.length) {
                            setCouponDiscount(0);
                            setAppliedCoupon(null);
                            setCouponMessage('');
                            setCouponMessageType(null);
                            setCouponCodeInput('');
                            window.localStorage.removeItem('cart-coupon');
                        }
                    }
                }
                return;
            }

            try {
                const discountResponses = await Promise.all(cartItems.map(async (item) => {
                    try {
                        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/discounts/product_discount/${ item.id }/${ item.amount }`);
                        return Number(response.data) || 0;
                    } catch (error) {
                        return 0;
                    }
                }));

                if (!isMounted) {
                    return;
                }

                const productDiscountTotal = discountResponses.reduce((acc, value) => acc + (Number(value) || 0), 0);
                const adjustedSubtotal = Math.max(saleSum - productDiscountTotal, 0);

                setDiscount(productDiscountTotal);
                setSaleSubtotal(saleSum);
                setCartSumBeforeDiscounts(originalSum);
                setSubtotalAfterDiscounts(adjustedSubtotal);
                window.localStorage.setItem('discount', productDiscountTotal);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setDiscount(0);
                setSaleSubtotal(saleSum);
                setCartSumBeforeDiscounts(originalSum);
                setSubtotalAfterDiscounts(Math.max(saleSum, 0));
                window.localStorage.setItem('discount', 0);
            }
        };

        calculateTotals();

        return () => {
            isMounted = false;
        };
    }, [ cartItems ]);

    useEffect(() => {
        const total = Math.max(subtotalAfterDiscounts - couponDiscount, 0);
        setCartSum(total);
    }, [ subtotalAfterDiscounts, couponDiscount ]);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        const storedCoupon = window.localStorage.getItem('cart-coupon');

        if (storedCoupon) {
            try {
                const parsed = JSON.parse(storedCoupon);

                if (parsed?.code) {
                    setAppliedCoupon({ code: parsed.code });
                    setCouponDiscount(Number(parsed.discount) || 0);
                }
            } catch (error) {
                window.localStorage.removeItem('cart-coupon');
            }
        }
    }, []);

    useEffect(() => {
        if (appliedCoupon?.code && subtotalAfterDiscounts > 0) {
            validateCoupon(appliedCoupon.code, { silent: true });
        }
    }, [ subtotalAfterDiscounts ]);

    useEffect(() => {
        // Localize cart final price
        localStorage.setItem('cart-price', cartSum);
    }, [ cartSum ]);

    const validateCoupon = async (code, { silent = false } = {}) => {
        const normalizedCode = code?.toString().trim().toUpperCase();

        if (!normalizedCode) {
            setCouponMessage('אנא הזן קוד קופון');
            setCouponMessageType('error');
            return;
        }

        if (subtotalAfterDiscounts <= 0) {
            setCouponMessage('לא ניתן להחיל קופון על עגלה ריקה');
            setCouponMessageType('error');
            return;
        }

        if (couponLoading) {
            return;
        }

        setCouponLoading(true);
        setCouponMessage('');
        setCouponMessageType(null);

        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`, {
                code: normalizedCode,
                cartTotal: subtotalAfterDiscounts,
            });

            if (data.valid) {
                setAppliedCoupon({ code: data.coupon.code });
                setCouponDiscount(Number(data.discount) || 0);
                window.localStorage.setItem('cart-coupon', JSON.stringify({ code: data.coupon.code, discount: data.discount }));

                if (!silent) {
                    setCouponMessage(data.message);
                    setCouponMessageType('success');
                    setCouponCodeInput('');
                } else {
                    setCouponMessage('');
                    setCouponMessageType(null);
                }
            } else {
                setAppliedCoupon(null);
                setCouponDiscount(0);
                window.localStorage.removeItem('cart-coupon');
                setCouponMessage(data.message);
                setCouponMessageType('error');
            }
        } catch (error) {
            setCouponMessage(error?.response?.data?.message || 'שגיאה בבדיקת הקופון');
            setCouponMessageType('error');
        } finally {
            setCouponLoading(false);
        }
    };

    const handleApplyCoupon = (event) => {
        event.preventDefault();
        validateCoupon(couponCodeInput, { silent: false });
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponMessage('הקופון הוסר');
        setCouponMessageType('info');
        setCouponCodeInput('');
        window.localStorage.removeItem('cart-coupon');
    };

    const hasOriginalDiscount = Math.abs(cartSumBeforeDiscounts - saleSubtotal) >= 0.01;
    const hasProductDiscount = Math.abs(saleSubtotal - subtotalAfterDiscounts) >= 0.01;
    const hasCouponDiscount = appliedCoupon?.code && Math.abs(Number(couponDiscount)) >= 0.01;

    return ( 
        <div id="cart-wrap">
            <div id="cart-bg" className={ `${ (cartTog || orderFormTog) ? 'active' : '' }` } onClick={ () => { setCartTog(!cartTog); setOrderFormTog(false) } }></div>

            <div id="cart" className={ `${ (cartTog && !orderFormTog) ? 'active' : '' }`}>
                <h3 id="cart-title"><span id="cart-close-icon" onClick={ () => setCartTog(!cartTog) }><AiOutlineClose/></span> סל הקניות שלכם</h3>

                <div id="cart-items">
                    { cartItems.map((item) => (
                        <CartItem key={ item.id } name={ item.name } minAmount={ item.minAmount } price={ item.price } image={ item.image } amount={ item.amount } cartItems= { cartItems } setCartItems={ setCartItems }/>
                    )) }

                   <p className={ `${ cartItems.length ? 'hide' : '' }` }>העגלה ריקה, אולי תוסיפו קצת ירקות?</p>
                </div>

                <div id="cart-coupon">
                    <form id="cart-coupon-form" onSubmit={ handleApplyCoupon }>
                        <input
                            type="text"
                            placeholder="קוד קופון"
                            value={ couponCodeInput }
                            onChange={ (event) => setCouponCodeInput(event.target.value.toUpperCase()) }
                            disabled={ couponLoading }
                        />
                        <button type="submit" disabled={ couponLoading }>החלת קופון</button>
                        { appliedCoupon?.code && <button type="button" className="remove" onClick={ handleRemoveCoupon } disabled={ couponLoading }>הסרת קופון</button> }
                    </form>
                    { couponMessage && <div className={ `cart-coupon-message ${ couponMessageType || '' }` }>{ couponMessage }</div> }
                    { appliedCoupon?.code && <div className="cart-coupon-applied">קופון פעיל: { appliedCoupon.code }</div> }
                </div>

                <div id="cart-sum">
                    { hasOriginalDiscount && <div><strong>סכום לפני הנחות: </strong> { formatMoney(cartSumBeforeDiscounts) }₪</div> }
                    { hasProductDiscount && <div><strong>מחירי מבצע והנחות כמות: </strong> -{ formatMoney(saleSubtotal - subtotalAfterDiscounts) }₪</div> }
                    { hasCouponDiscount && <div><strong>קופון { appliedCoupon.code }: </strong> -{ formatMoney(couponDiscount) }₪</div> }
                    <div><strong>סיכום הזמנה: </strong> { formatMoney(cartSum) }₪</div>
                </div>

                <div id="cart-link-to-checkout" onClick={ () => setOrderFormTog(!orderFormTog) }>להמשך הזמנה</div>
            </div>

            <CartSuggestions cartTog={ cartTog } orderFormTog={ orderFormTog } cartItems={ cartItems } setCartItems={ setCartItems }/>

            { orderFormTog && <OrderForm setOrderFormTog={ setOrderFormTog }/> }
        </div>
     );
}
 
export default Cart;