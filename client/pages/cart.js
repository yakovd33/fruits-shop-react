import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import CartItem from '../components/Cart/CartItem';
import ProductShowcase from '../components/ProductShowcase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const CartPage = ({ cartItems, setCartItems }) => {
    const router = useRouter();
    const [ cartSumBeforeDiscounts, setCartSumBeforeDiscounts ] = useState(0);
    const [ saleSubtotal, setSaleSubtotal ] = useState(0);
    const [ subtotalAfterDiscounts, setSubtotalAfterDiscounts ] = useState(0);
    const [ couponDiscount, setCouponDiscount ] = useState(0);
    const [ couponLoading, setCouponLoading ] = useState(false);
    const [ appliedCoupon, setAppliedCoupon ] = useState(null);
    const [ cartSum, setCartSum ] = useState(0);
    const [ suggestedProducts, setSuggestedProducts ] = useState([]);

    const formatMoney = (value) => Math.round((Number(value) || 0) * 100) / 100;
    const persistDiscount = (value) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('discount', value);
        }
    };

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
                    setSaleSubtotal(0);
                    setCartSumBeforeDiscounts(0);
                    setSubtotalAfterDiscounts(0);
                    persistDiscount(0);

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

                setSaleSubtotal(saleSum);
                setCartSumBeforeDiscounts(originalSum);
                setSubtotalAfterDiscounts(adjustedSubtotal);
                persistDiscount(productDiscountTotal);
            } catch (error) {
                if (!isMounted) {
                    return;
                }

                setSaleSubtotal(saleSum);
                setCartSumBeforeDiscounts(originalSum);
                setSubtotalAfterDiscounts(Math.max(saleSum, 0));
                persistDiscount(0);
            }
        };

        calculateTotals();

        return () => {
            isMounted = false;
        };
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
                    setAppliedCoupon({ code: parsed.code });
                    setCouponDiscount(Number(parsed.discount) || 0);
                }
            } catch (error) {
                window.localStorage.removeItem('cart-coupon');
            }
        }
    }, []);

    useEffect(() => {
        const total = Math.max(subtotalAfterDiscounts - couponDiscount, 0);
        setCartSum(total);
    }, [ subtotalAfterDiscounts, couponDiscount ]);

    useEffect(() => {
        if (appliedCoupon?.code && subtotalAfterDiscounts > 0) {
            validateCoupon(appliedCoupon.code, { silent: true });
        }
    }, [ subtotalAfterDiscounts ]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('cart-price', cartSum);
        }
    }, [ cartSum ]);

    useEffect(() => {
        let isMounted = true;

        const fetchSuggestions = async () => {
            try {
                const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/products/?limit=9&rand=true`);
                if (isMounted) {
                    setSuggestedProducts(data?.products || []);
                }
            } catch (error) {
                if (isMounted) {
                    setSuggestedProducts([]);
                }
            }
        };

        fetchSuggestions();

        return () => {
            isMounted = false;
        };
    }, []);

    const validateCoupon = async (code, { silent = false } = {}) => {
        const normalizedCode = code?.toString().trim().toUpperCase();

        if (!normalizedCode) {
            return;
        }

        if (subtotalAfterDiscounts <= 0) {
            return;
        }

        if (couponLoading) {
            return;
        }

        setCouponLoading(true);
        try {
            const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/coupons/validate`, {
                code: normalizedCode,
                cartTotal: subtotalAfterDiscounts,
            });

            if (data.valid) {
                setAppliedCoupon({ code: data.coupon.code });
                setCouponDiscount(Number(data.discount) || 0);
                window.localStorage.setItem('cart-coupon', JSON.stringify({ code: data.coupon.code, discount: data.discount }));

            } else {
                setAppliedCoupon(null);
                setCouponDiscount(0);

                if (typeof window !== 'undefined') {
                    window.localStorage.removeItem('cart-coupon');
                }
            }
        } catch (error) {
        } finally {
            setCouponLoading(false);
        }
    };

    const handleCheckoutClick = () => {
        if (!cartItems.length) {
            return;
        }

        router.push('/order');
    };

    const cartCount = cartItems.length;
    const isEmpty = cartCount === 0;
    const hasOriginalDiscount = Math.abs(cartSumBeforeDiscounts - saleSubtotal) >= 0.01;
    const productDiscountValue = Math.max(saleSubtotal - subtotalAfterDiscounts, 0);
    const hasProductDiscount = productDiscountValue >= 0.01;
    const hasCouponDiscount = appliedCoupon?.code && Math.abs(Number(couponDiscount)) >= 0.01;
    const hasSuggestions = suggestedProducts.length > 0;
    const hasMultipleSuggestions = suggestedProducts.length > 1;
    const baseSlidesPerView = Math.min(1.05, Math.max(suggestedProducts.length, 1));
    const swiperBreakpoints = useMemo(() => ({
        1200: {
            slidesPerView: Math.min(2.2, Math.max(suggestedProducts.length, 1)),
            spaceBetween: 12,
        },
        768: {
            slidesPerView: Math.min(1.4, Math.max(suggestedProducts.length, 1)),
            spaceBetween: 10,
        },
    }), [ suggestedProducts.length ]);
    const shouldAutoPlay = hasMultipleSuggestions;
    const shouldLoop = suggestedProducts.length > 2;

    return (
        <section className="cart-page-shell cart-page-full">
            <div className="cart-page-grid">
                <div className="cart-page-main">
                    <div className="cart-page-card cart-page-items-card">
                        <div className="cart-page-card-head">
                            <div>
                                <h3>{ isEmpty ? 'העגלה עדיין ריקה' : `יש לכם ${ cartCount } מוצרים שמחכים לאישור` }</h3>
                            </div>
                        </div>

                        { isEmpty ? (
                            <div className="cart-page-empty">
                                <h4>רוצים למלא את המקרר?</h4>
                                <p>התחילו בגלריית הפירות והירקות שלנו, תוסיפו מאפים ביתיים וקינוחים מוכנים, ואנחנו נארוז הכל בזהירות.</p>
                                <Link href="/" className="cart-page-empty-link">לחזרה לקטלוג</Link>
                            </div>
                        ) : (
                            <div className="cart-items-list cart-page-items-list">
                                { cartItems.map((item) => (
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
                                )) }
                            </div>
                        ) }
                    </div>

                </div>

                <aside className="cart-page-card cart-page-summary-card">
                    <div className="cart-summary-header">
                        <span className="cart-card-eyebrow">סיכום ההזמנה</span>
                        <h3>נשאר רק לאשר</h3>
                    </div>
                    <div className="cart-summary-breakdown">
                        { hasOriginalDiscount && (
                            <div className="cart-summary-row">
                                <span>סכום לפני הנחות</span>
                                <span className="value">{ formatMoney(cartSumBeforeDiscounts) }₪</span>
                            </div>
                        ) }
                        { hasProductDiscount && (
                            <div className="cart-summary-row discount">
                                <span>מבצעים והנחות כמות</span>
                                <span className="value">-{ formatMoney(productDiscountValue) }₪</span>
                            </div>
                        ) }
                        { hasCouponDiscount && (
                            <div className="cart-summary-row discount">
                                <span>קופון { appliedCoupon.code }</span>
                                <span className="value">-{ formatMoney(couponDiscount) }₪</span>
                            </div>
                        ) }
                        <div className="cart-summary-row cart-summary-total">
                            <span>סה"כ לתשלום</span>
                            <span className="value">{ formatMoney(cartSum) }₪</span>
                        </div>
                    </div>
                    { !isEmpty && (
                        <div className="cart-page-suggestions-slider">
                            <div className="cart-page-suggestions-head">
                                <h3>אולי תוסיפו גם</h3>
                            </div>
                            { hasSuggestions ? (
                                <div className="cart-suggestions-inline" aria-label="מוצרים מומלצים להוספה לעגלה">
                                    <Swiper
                                        modules={[ Navigation, Autoplay ]}
                                        slidesPerView={ baseSlidesPerView }
                                        spaceBetween={ 10 }
                                        loop={ shouldLoop }
                                        autoplay={ shouldAutoPlay ? {
                                            delay: 4200,
                                            disableOnInteraction: false,
                                            pauseOnMouseEnter: true,
                                        } : false }
                                        navigation={ hasMultipleSuggestions ? { enabled: true } : { enabled: false } }
                                        allowTouchMove
                                        grabCursor
                                        dir="rtl"
                                        speed={ 450 }
                                        breakpoints={ swiperBreakpoints }
                                        className="cart-suggestions-swiper"
                                    >
                                        { suggestedProducts.map((product) => (
                                            <SwiperSlide className="cart-suggestions-swiper-slide" key={ product._id || product.id }>
                                                <div className="cart-suggestions-card">
                                                    <ProductShowcase
                                                        id={ product._id }
                                                        product={ product }
                                                        cartItems={ cartItems }
                                                        minAmount={ product.minAmount }
                                                        setCartItems={ setCartItems }
                                                        description={ product.description }
                                                        name={ product.name }
                                                        price={ product.price }
                                                        salePrice={ product.salePrice }
                                                        priceKg={ product.priceKg }
                                                        salePriceKg={ product.salePriceKg }
                                                        unit={ product.unitType }
                                                        badge={ product.badge }
                                                        bottomAddToCart={ true }
                                                        numberId={ product.id }
                                                        instantCartControls
                                                        relatedProductsPool={ suggestedProducts }
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        )) }
                                    </Swiper>
                                </div>
                            ) : (
                                <p className="cart-suggestions-empty">אנחנו טוענים מוצרים שמומלץ להוסיף לעגלה…</p>
                            ) }
                        </div>
                    ) }
                    <button
                        type="button"
                        className="cart-checkout-button"
                        onClick={ handleCheckoutClick }
                        disabled={ isEmpty }
                    >
                        המשך להזמנה
                    </button>
                    <p className="cart-page-summary-note">המשלוחים יוצאים מדי בוקר. מיד לאחר אישור התשלום נתחיל לארוז עבורכם.</p>
                </aside>
            </div>

        </section>
    );
};

export default CartPage;
