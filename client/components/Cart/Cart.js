import React, { useState, useEffect } from 'react';
import CartItem from "./CartItem";
import { AiOutlineClose } from 'react-icons/ai';
import OrderForm from '../OrderForm';
import axios from 'axios';
import CartSuggestions from './CartSuggestions';
import { useRouter } from 'next/router';

const Cart = ({ cartTog = false, setCartTog, cartItems, setCartItems, variant = 'panel' }) => {
    const router = useRouter();
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
                }
            } else {
                setAppliedCoupon(null);
                setCouponDiscount(0);

                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('cart-coupon');
                }

                if (!silent) {
                    setCouponMessage(data.message || 'קוד הקופון אינו תקף להזמנה זו');
                    setCouponMessageType('error');
                }
            }
        } catch (error) {
            if (!silent) {
                setCouponMessage('אירעה שגיאה בעת בדיקת הקופון. נסו שוב בעוד רגע.');
                setCouponMessageType('error');
            }
        } finally {
            setCouponLoading(false);
        }
    };

    const handleApplyCoupon = async (event) => {
        event.preventDefault();
        await validateCoupon(couponCodeInput);
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponDiscount(0);
        setCouponMessage('הקופון הוסר מהעגלה');
        setCouponMessageType('info');
        setCouponCodeInput('');

        if (typeof window !== 'undefined') {
            window.localStorage.removeItem('cart-coupon');
        }
    };

    const hasOriginalDiscount = Math.abs(cartSumBeforeDiscounts - saleSubtotal) >= 0.01;
    const hasProductDiscount = Math.abs(saleSubtotal - subtotalAfterDiscounts) >= 0.01;
    const hasCouponDiscount = appliedCoupon?.code && Math.abs(Number(couponDiscount)) >= 0.01;
    const cartCount = cartItems.length;

    const isPageVariant = variant === 'page';

    const toggleCartPanel = () => {
        if (typeof setCartTog === 'function') {
            setCartTog(!cartTog);
        }
    };

    const closeCartPanel = () => {
        if (typeof setCartTog === 'function') {
            setCartTog(false);
        }
    };

    const handleCheckoutClick = () => {
        if (!cartItems.length) {
            return;
        }

        setOrderFormTog(false);
        closeCartPanel();
        router.push('/order');
    };

    const cartInner = (
        <>
            <header className="cart-header">
                <div>
                    <h3>סל הקניות שלכם</h3>
                </div>
                <div className="cart-header-actions">
                    <span className="cart-pill">{ cartCount } פריטים</span>
                    { !isPageVariant && (
                        <button
                            type="button"
                            className="cart-close"
                            onClick={ toggleCartPanel }
                            aria-label="סגירת סל הקניות"
                        >
                            <AiOutlineClose />
                        </button>
                    ) }
                </div>
            </header>

            <div className="cart-items-list">
                { cartItems.length ? (
                    cartItems.map((item) => (
                        <CartItem
                            key={ item.id }
                            name={ item.name }
                            minAmount={ item.minAmount }
                            price={ item.price }
                            image={ item.image }
                            amount={ item.amount }
                            cartItems={ cartItems }
                            setCartItems={ setCartItems }
                        />
                    ))
                ) : (
                    <div className="cart-empty-state">
                        <p>סל הקניות ממתין למשהו טעים. התחילו להוסיף ירקות, פירות ומעדנים טריים.</p>
                    </div>
                ) }
            </div>

            { isPageVariant && (
                <section id="cart-coupon" className="cart-card">
                    <div className="cart-card-heading">
                        <div>
                            <span className="cart-card-eyebrow">יש לכם קוד?</span>
                            <h4>הוספת קופון</h4>
                        </div>
                        { appliedCoupon?.code && <span className="cart-pill subtle">{ appliedCoupon.code }</span> }
                    </div>
                    <form id="cart-coupon-form" onSubmit={ handleApplyCoupon }>
                        <input
                            type="text"
                            placeholder="קוד קופון"
                            value={ couponCodeInput }
                            onChange={ (event) => setCouponCodeInput(event.target.value.toUpperCase()) }
                            disabled={ couponLoading }
                        />
                        <button type="submit" disabled={ couponLoading }>החלת קופון</button>
                        { appliedCoupon?.code && (
                            <button type="button" className="remove" onClick={ handleRemoveCoupon } disabled={ couponLoading }>
                                הסרת קופון
                            </button>
                        ) }
                    </form>
                    { couponMessage && <div className={ `cart-coupon-message ${ couponMessageType || '' }` }>{ couponMessage }</div> }
                    { appliedCoupon?.code && <div className="cart-coupon-applied">קופון פעיל: { appliedCoupon.code }</div> }
                </section>
            ) }

            <section className="cart-card cart-summary-card">
                <div className="cart-card-heading">
                    <div>
                        <span className="cart-card-eyebrow">סיכום</span>
                        <h4>פרטי הסל</h4>
                    </div>
                </div>
                <div id="cart-sum">
                    { hasOriginalDiscount && (
                        <div className="cart-summary-row">
                            <span>סכום לפני הנחות</span>
                            <span className="value">{ formatMoney(cartSumBeforeDiscounts) }₪</span>
                        </div>
                    ) }
                    { hasProductDiscount && (
                        <div className="cart-summary-row discount">
                            <span>מבצעים והנחות כמות</span>
                            <span className="value">-{ formatMoney(saleSubtotal - subtotalAfterDiscounts) }₪</span>
                        </div>
                    ) }
                    { hasCouponDiscount && (
                        <div className="cart-summary-row discount">
                            <span>קופון { appliedCoupon.code }</span>
                            <span className="value">-{ formatMoney(couponDiscount) }₪</span>
                        </div>
                    ) }
                    <div className="cart-summary-row cart-summary-total">
                        <span>סיכום הזמנה</span>
                        <span className="value">{ formatMoney(cartSum) }₪</span>
                    </div>
                </div>
            </section>

            <button
                type="button"
                className="cart-checkout-button"
                onClick={ handleCheckoutClick }
                disabled={ !cartItems.length }
            >
                להמשך הזמנה
            </button>
            <p className="cart-delivery-note">זמני אספקה מתעדכנים מדי יום בהתאם לביקוש ולמסלולי החלוקה.</p>
        </>
    );

    if (isPageVariant) {
        return (
            <section className="cart-page-shell">
                <div className="cart-page-panel">
                    { cartInner }
                </div>
                <CartSuggestions cartTog={ cartTog } orderFormTog={ orderFormTog } cartItems={ cartItems } setCartItems={ setCartItems } />
                { orderFormTog && <OrderForm setOrderFormTog={ setOrderFormTog } /> }
            </section>
        );
    }

    return (
        <div id="cart-wrap">
            <div
                id="cart-bg"
                className={ `${ (cartTog || orderFormTog) ? 'active' : '' }` }
                onClick={ () => {
                    toggleCartPanel();
                    setOrderFormTog(false);
                } }
            ></div>

            <aside id="cart" className={ `${ (cartTog && !orderFormTog) ? 'active' : '' }`}>
                { cartInner }
            </aside>

            <CartSuggestions cartTog={ cartTog } orderFormTog={ orderFormTog } cartItems={ cartItems } setCartItems={ setCartItems } />

            { orderFormTog && <OrderForm setOrderFormTog={ setOrderFormTog } /> }
        </div>
    );
};

export default Cart;