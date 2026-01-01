import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FiX } from 'react-icons/fi';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';
import { TbTrash } from 'react-icons/tb';
import globalStore from '../../stores/GlobalStore';
import { addToCartAnimation } from '../../helpers/CartHelper';
import { getRelatedProducts } from '../../helpers/relatedProducts';

const unitLabels = {
    'kg': 'ק"ג',
    'ק"ג': 'ק"ג',
    'ק״ג': 'ק"ג',
    'unit': 'יחידה',
    'יחידה': 'יחידה',
};

const KG_UNIT_VALUES = [ 'ק״ג', 'ק"ג', 'kg' ];

const getDefaultUnitSelection = (item) => {
    if (!item) {
        return 'unit';
    }
    const baseUnit = item?.unitType || item?.unit || 'unit';
    return baseUnit === 'both' ? 'ק״ג' : baseUnit;
};

const isKgUnitSelection = (unit) => KG_UNIT_VALUES.includes(unit);

export const ProductPopup = ({ product, cartItems = [], setCartItems }) => {
    const initialUnit = useMemo(() => getDefaultUnitSelection(product), [ product ]);

    const [ selectedUnit, setSelectedUnit ] = useState(initialUnit);
    const popupRef = useRef(null);
    const relatedTrackRef = useRef(null);

    useEffect(() => {
        setSelectedUnit(initialUnit);
    }, [ initialUnit, product ]);

    const handleClose = useCallback(() => {
        globalStore.popupProduct = null;
    }, []);

    if (!product) return null;

    const formatMoney = (value) => {
        const numberValue = Number(value) || 0;
        return Number.isInteger(numberValue) ? numberValue.toString() : numberValue.toFixed(1);
    };

    const unitType = product?.unitType || product?.unit || '';
    const pricePerUnit = Number(product?.price) || 0;
    const salePricePerUnit = product?.salePrice && product.salePrice !== 0 ? Number(product.salePrice) : null;
    const pricePerKg = Number(product?.priceKg) || null;
    const salePricePerKg = product?.salePriceKg && product.salePriceKg !== 0 ? Number(product.salePriceKg) : null;
    const isKgSelection = isKgUnitSelection(selectedUnit);
    const actualPrice = isKgSelection ? (pricePerKg || pricePerUnit) : pricePerUnit;
    const actualSalePrice = isKgSelection ? salePricePerKg : salePricePerUnit;
    const currentPrice = actualSalePrice || actualPrice;
    const comparePrice = actualSalePrice ? actualPrice : null;
    const priceKgDisplay = salePricePerKg || pricePerKg;
    const displayUnit = unitLabels[selectedUnit] || unitLabels[unitType] || selectedUnit || 'יחידה';
    const minSelectableAmount = Number(product?.minAmount) || 1;
    const productIdentifier = product?.numberId || product?.id || product?._id;
    const headingId = productIdentifier ? `product-popup-heading-${ productIdentifier }` : undefined;
    const descriptionId = headingId ? `${ headingId }-description` : undefined;

    const normalizeImagePath = (imgPath) => {
        if (!imgPath) return null;
        if (imgPath.startsWith('http')) return imgPath;
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const cleanedPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath;
        return baseUrl ? `${baseUrl}/${cleanedPath}` : `/${cleanedPath}`;
    };

    const buildProductImage = (item) => {
        if (!item) return '/images/vegetables.jpg';
        const identifier = item?.numberId || item?.id || item?._id;
        const bucketImage = identifier && process.env.NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET
            ? `https://${process.env.NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET}/${identifier}.jpg`
            : null;
        const fallback = normalizeImagePath(item?.image);
        return bucketImage || fallback || '/images/vegetables.jpg';
    };

    const productImage = buildProductImage(product);
    const cartImage = productImage;
    const canAddToCart = typeof setCartItems === 'function';
    const findCartEntryForProduct = useCallback((targetProduct) => {
        if (!targetProduct || !Array.isArray(cartItems)) {
            return null;
        }
        const targetId = targetProduct?._id || targetProduct?.id;
        return cartItems.find((item) => {
            if (targetId && item?.id) {
                return item.id === targetId;
            }
            return item?.name === targetProduct?.name;
        }) || null;
    }, [ cartItems ]);
    const existingCartItem = useMemo(() => findCartEntryForProduct(product), [ findCartEntryForProduct, product ]);

    const buildPriceSnapshot = (targetProduct, unitChoice) => {
        const pricePerUnitValue = Number(targetProduct?.price) || 0;
        const salePerUnitValue = targetProduct?.salePrice && targetProduct.salePrice !== 0 ? Number(targetProduct.salePrice) : null;
        const pricePerKgValue = Number(targetProduct?.priceKg) || null;
        const salePerKgValue = targetProduct?.salePriceKg && targetProduct.salePriceKg !== 0 ? Number(targetProduct.salePriceKg) : null;
        const isKgUnit = isKgUnitSelection(unitChoice);
        const originalPrice = isKgUnit ? (pricePerKgValue || pricePerUnitValue) : pricePerUnitValue;
        const discountedPrice = isKgUnit ? salePerKgValue : salePerUnitValue;
        const currentPriceValue = discountedPrice || originalPrice;
        return {
            currentPriceValue,
            originalPrice,
        };
    };

    const updateCartForProduct = useCallback((targetProduct, nextAmount, unitChoice, imageOverride) => {
        if (!canAddToCart || !targetProduct) {
            return;
        }

        const resolvedUnit = unitChoice || getDefaultUnitSelection(targetProduct);
        const { currentPriceValue, originalPrice } = buildPriceSnapshot(targetProduct, resolvedUnit);
        const payload = {
            id: targetProduct?._id || targetProduct?.id,
            name: targetProduct?.name,
            minAmount: Number(targetProduct?.minAmount) || 1,
            originalPrice,
            price: currentPriceValue,
            image: imageOverride || buildProductImage(targetProduct),
            unit: resolvedUnit,
        };

        setCartItems((prevItems = []) => {
            const targetId = payload.id;
            const matchIndex = prevItems.findIndex((item) => {
                if (targetId && item?.id) {
                    return item.id === targetId;
                }
                return item?.name === payload.name;
            });

            if (nextAmount <= 0) {
                if (matchIndex === -1) {
                    return prevItems;
                }
                return prevItems.filter((_, idx) => idx !== matchIndex);
            }

            if (matchIndex === -1) {
                return [ ...prevItems, { ...payload, amount: nextAmount } ];
            }

            return prevItems.map((item, idx) => {
                if (idx !== matchIndex) {
                    return item;
                }
                return {
                    ...item,
                    amount: nextAmount,
                    price: payload.price,
                    originalPrice: payload.originalPrice,
                    unit: payload.unit,
                };
            });
        });
    }, [ canAddToCart, setCartItems ]);
    const existingCartAmount = existingCartItem?.amount || 0;
    const quantityDisplay = existingCartAmount || 0;
    const subtotalDisplay = formatMoney(quantityDisplay * currentPrice);
    const perUnitDisplay = formatMoney(currentPrice);

    const tags = [
        product?.badge,
        displayUnit ? `נמכר לפי ${displayUnit}` : null,
        product?.minAmount ? `מינימום ${product.minAmount} ${displayUnit}` : null,
        'קטיף יומי מהשדה'
    ].filter(Boolean);

    const description = product?.description || 'אנחנו בוחרים רק את התוצרת המובחרת ביותר, ממיינים ידנית ושולחים אליכם כשהיא מלאה בטעם, צבע ובשיא הרעננות.';
    const relatedSource = Array.isArray(product?.popupRelatedSource) ? product.popupRelatedSource : [];
    const relatedProducts = useMemo(() => {
        const explicitList = Array.isArray(product?.relatedProducts) ? product.relatedProducts : [];
        const source = explicitList.length ? explicitList : relatedSource;
        return getRelatedProducts(source, product, 8);
    }, [ product, relatedSource ]);

    const getRelatedUnitLabel = (item) => {
        if (!item) return unitLabels['unit'];
        const itemUnit = item?.unitType === 'both'
            ? (item?.unit || 'unit')
            : (item?.unitType || item?.unit || 'unit');
        return unitLabels[itemUnit] || itemUnit || unitLabels['unit'];
    };

    const formatRelatedPrice = (item) => {
        const value = item?.salePrice && item.salePrice !== 0 ? item.salePrice : item?.price;
        return formatMoney(value || 0);
    };

    const handleRelatedProductClick = (nextProduct) => {
        if (!nextProduct) return;
        const sourceForNext = relatedSource.length ? relatedSource : relatedProducts;
        globalStore.popupProduct = {
            ...nextProduct,
            popupRelatedSource: sourceForNext,
        };
        if (popupRef.current) {
            popupRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const scrollRelated = (direction) => {
        if (!relatedTrackRef.current) return;
        const scrollAmount = relatedTrackRef.current.clientWidth * 0.8;
        relatedTrackRef.current.scrollBy({
            left: direction === 'prev' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    const triggerAddToCartAnimation = (sourceElement, imageSrc = productImage) => {
        if (typeof window === 'undefined' || !sourceElement) {
            return;
        }
        const rect = sourceElement.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        const left = rect.left + window.scrollX;
        const imageTag = `<img src="${imageSrc}" alt="" />`;
        addToCartAnimation(imageTag, top, left);
    };

    const updateCartQuantity = (nextAmount) => {
        updateCartForProduct(product, nextAmount, selectedUnit, cartImage);
    };

    const handleQuantityPlus = (event) => {
        const baseAmount = existingCartAmount || 0;
        const nextAmount = baseAmount > 0 ? baseAmount + 1 : Math.max(minSelectableAmount, 1);
        updateCartQuantity(nextAmount);
        if (baseAmount === 0) {
            triggerAddToCartAnimation(event?.currentTarget, productImage);
        }
    };

    const handleQuantityMinus = () => {
        const baseAmount = existingCartAmount || 0;
        if (baseAmount <= 0) {
            return;
        }
        const nextAmount = baseAmount - 1;
        if (nextAmount < minSelectableAmount) {
            updateCartQuantity(0);
        } else {
            updateCartQuantity(nextAmount);
        }
    };

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        if (!product) {
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        const handleKeydown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault();
                handleClose();
            }
        };

        document.addEventListener('keydown', handleKeydown);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [ product, handleClose ]);

    useEffect(() => {
        if (typeof document === 'undefined') {
            return;
        }

        if (!product || !popupRef.current) {
            return;
        }

        const previouslyFocused = document.activeElement;
        popupRef.current.focus({ preventScroll: true });

        return () => {
            if (previouslyFocused && previouslyFocused.focus) {
                previouslyFocused.focus();
            }
        };
    }, [ product ]);

    return (
        <>
            <div id="product-popup-bg" onClick={ handleClose }></div>
            <div
                id="product-popup"
                role="dialog"
                aria-modal="true"
                aria-label={ product.name }
                aria-labelledby={ headingId }
                aria-describedby={ descriptionId }
                tabIndex={ -1 }
                ref={ popupRef }
            >
                <button className="product-popup-close" onClick={ handleClose } aria-label="סגירת חלון">
                    <FiX />
                </button>
                <div className="product-popup-content">
                    <div className="product-popup-media">
                        { productImage && (
                            <img
                                src={ productImage }
                                alt={ product.name }
                                className="product-popup-image"
                                loading="lazy"
                            />
                        ) }
                        { product?.badge && <span className="product-popup-badge">{ product.badge }</span> }
                        <span className="product-popup-media-blur"></span>
                    </div>
                    <div className="product-popup-info">
                        <span className="product-popup-eyebrow">פרי וירק ארצנו</span>
                        <h2 id={ headingId }>{ product.name }</h2>
                        <p className="product-popup-description" id={ descriptionId }>{ description }</p>

                        <div className="product-popup-price">
                            <div className="product-popup-price-primary">
                                { currentPrice && <span className="price-current">{ currentPrice }₪</span> }
                                { comparePrice && <span className="price-compare">{ comparePrice }₪</span> }
                                <span className="price-unit">/ { displayUnit }</span>
                            </div>
                            { priceKgDisplay && (
                                <div className="product-popup-price-secondary">{ priceKgDisplay }₪ לק"ג</div>
                            ) }
                        </div>

                        { product?.unitType === 'both' && (
                            <div className="product-popup-unit-toggle" role="group" aria-label="בחירת יחידת מידה">
                                <button
                                    type="button"
                                    className={ `product-popup-unit-option ${ selectedUnit === 'יחידה' ? 'active' : '' }` }
                                    onClick={ () => setSelectedUnit('יחידה') }
                                >
                                    יחידה
                                </button>
                                <button
                                    type="button"
                                    className={ `product-popup-unit-option ${ isKgUnitSelection(selectedUnit) ? 'active' : '' }` }
                                    onClick={ () => setSelectedUnit('ק״ג') }
                                >
                                    ק"ג
                                </button>
                            </div>
                        ) }

                        { !!tags.length && (
                            <div className="product-popup-tags">
                                { tags.map((tag) => (
                                    <span className="product-popup-tag" key={ tag }>{ tag }</span>
                                )) }
                            </div>
                        ) }

                        <div className="product-popup-actions">
                            { existingCartAmount > 0 && (
                                <p className="product-popup-cart-note">כבר בעגלה { existingCartAmount } { displayUnit }</p>
                            ) }
                            <div className="product-popup-actions-row">
                                <div className="product-popup-quantity" aria-label="בחירת כמות">
                                    <button type="button" onClick={ handleQuantityMinus } disabled={ existingCartAmount <= 0 }>-</button>
                                    <span className="product-popup-quantity-value">{ quantityDisplay || 0 }</span>
                                    <button type="button" onClick={ handleQuantityPlus }>+</button>
                                    <span className="product-popup-quantity-unit">{ displayUnit }</span>
                                </div>
                                <span className="product-popup-total-chip">{ subtotalDisplay }₪</span>
                            </div>
                        </div>
                    </div>
                </div>
                { relatedProducts.length > 0 && (
                    <div className="product-popup-related">
                        <div className="product-popup-related-head">
                            <div>
                                <span className="product-popup-related-eyebrow">עוד רעיונות טעימים</span>
                                <h3>מוצרים קשורים</h3>
                            </div>
                            <div className="product-popup-related-arrows">
                                <button type="button" onClick={ () => scrollRelated('next') } aria-label="מוצרים קודמים">
                                    <AiOutlineArrowRight />
                                </button>
                                <button type="button" onClick={ () => scrollRelated('prev') } aria-label="מוצרים הבאים">
                                    <AiOutlineArrowLeft />
                                </button>
                            </div>
                        </div>
                        <div className="product-popup-related-track" ref={ relatedTrackRef }>
                            { relatedProducts.map((item) => {
                                const cardId = item?._id || item?.id || item?.numberId || item?.name;
                                const cardImage = buildProductImage(item);
                                const cardUnit = getRelatedUnitLabel(item);
                                const cardPrice = formatRelatedPrice(item);
                                const relatedMinAmount = Math.max(Number(item?.minAmount) || 1, 1);
                                const relatedCartItem = findCartEntryForProduct(item);
                                const relatedAmount = relatedCartItem?.amount || 0;
                                const relatedUnitSelection = getDefaultUnitSelection(item);
                                const { currentPriceValue: relatedPricePerUnit } = buildPriceSnapshot(item, relatedUnitSelection);
                                const disableMinus = !canAddToCart || relatedAmount <= 0;
                                const disablePlus = !canAddToCart;

                                const handleCardKeyDown = (event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        event.preventDefault();
                                        handleRelatedProductClick(item);
                                    }
                                };

                                const handleRelatedPlus = (event) => {
                                    event.stopPropagation();
                                    if (disablePlus) {
                                        return;
                                    }
                                    const baseAmount = relatedAmount || 0;
                                    const nextAmount = baseAmount > 0 ? baseAmount + 1 : Math.max(relatedMinAmount, 1);
                                    updateCartForProduct(item, nextAmount, relatedUnitSelection, cardImage);
                                    if (baseAmount === 0) {
                                        triggerAddToCartAnimation(event.currentTarget, cardImage);
                                    }
                                };

                                const handleRelatedMinus = (event) => {
                                    event.stopPropagation();
                                    if (disableMinus) {
                                        return;
                                    }
                                    const nextAmount = relatedAmount - 1;
                                    if (nextAmount < relatedMinAmount) {
                                        updateCartForProduct(item, 0, relatedUnitSelection, cardImage);
                                    } else {
                                        updateCartForProduct(item, nextAmount, relatedUnitSelection, cardImage);
                                    }
                                };

                                return (
                                    <div
                                        key={ cardId }
                                        className="product-popup-related-card"
                                        role="button"
                                        tabIndex={ 0 }
                                        onClick={ () => handleRelatedProductClick(item) }
                                        onKeyDown={ handleCardKeyDown }
                                    >
                                        <div className="product-popup-related-card-image">
                                            <img src={ cardImage } alt={ item?.name || 'מוצר קשור' } loading="lazy" />
                                        </div>
                                        <div className="product-popup-related-card-body">
                                            <span className="product-popup-related-card-name">{ item?.name }</span>
                                            <div className="product-popup-related-card-price-line">
                                                <span className="product-popup-related-card-price">{ cardPrice }₪</span>
                                                <span className="product-popup-related-card-unit">/ { cardUnit }</span>
                                            </div>
                                            <div className="product-popup-related-card-actions" aria-label="עדכון כמות למוצר קשור">
                                                <div className="product-popup-related-card-qty cart-item-amount desktop-card-amount">
                                                    <button
                                                        type="button"
                                                        className={ `cart-item-amount-btn plus${ disablePlus ? ' disabled' : '' }` }
                                                        onClick={ handleRelatedPlus }
                                                        disabled={ disablePlus }
                                                    >
                                                        +
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="cart-item-amount-number"
                                                        readOnly
                                                        value={ relatedAmount || 0 }
                                                        aria-live="polite"
                                                    />
                                                    <button
                                                        type="button"
                                                        className={ `cart-item-amount-btn minus${ disableMinus ? ' disabled' : '' }` }
                                                        onClick={ handleRelatedMinus }
                                                        disabled={ disableMinus }
                                                    >
                                                        { relatedAmount > 0 && relatedAmount <= relatedMinAmount ? <TbTrash /> : '-' }
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }) }
                        </div>
                    </div>
                ) }
            </div>
        </>
    );
};