import React, { useMemo } from 'react';

const QuickSearchItem = ({ product, cartItems = [], setCartItems }) => {
    const hasProduct = Boolean(product);

    const thumbSrc = useMemo(() => {
        if (product?.id && process.env.NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET) {
            return `https://${process.env.NEXT_PUBLIC_PRODUCT_THUMBS_PUBLIC_BUCKET}/${product.id}.jpg`;
        }

        return product?.image || '';
    }, [product]);

    const unitLabel = product.unitType === 'both' ? 'יחידה' : (product.unitType || 'יחידה');
    const minAmount = product.minAmount || 1;
    const hasSalePrice = product.salePrice && product.salePrice !== 0;
    const displayPrice = hasSalePrice ? product.salePrice : product.price;

    const existingCartItem = cartItems.find((item) => item.id === product._id);

    const handleAddToCart = (event) => {
        event?.stopPropagation?.();
        event?.preventDefault?.();

        if (!setCartItems) {
            return;
        }

        setCartItems((prev) => {
            const matchIndex = prev.findIndex((item) => item.id === product._id);
            if (matchIndex > -1) {
                return prev.map((item, index) => index === matchIndex ? { ...item, amount: item.amount + 1 } : item);
            }

            const newEntry = {
                id: product._id,
                name: product.name,
                amount: minAmount,
                minAmount,
                originalPrice: product.price,
                price: displayPrice,
                image: thumbSrc,
                unit: unitLabel
            };

            return [ ...prev, newEntry ];
        });
    };

    if (!hasProduct) {
        return null;
    }

    return (
        <div className="quick-search-item">
            <div className="quick-search-thumb">
                { thumbSrc ? (
                    <img src={thumbSrc} alt={product.name} loading="lazy" />
                ) : (
                    <div className="quick-search-thumb-fallback">{product?.name?.charAt(0) || '?'}</div>
                ) }
            </div>

            <div className="quick-search-details">
                <div className="quick-search-title">{ product.name }</div>
                <div className="quick-search-price">
                    { hasSalePrice && <span className="old-price">{product.price}₪</span> }
                    <span className="current-price">{ displayPrice }₪</span>
                    <span className="unit">/ { unitLabel }</span>
                </div>
                { product.badge && <span className="quick-search-badge">{ product.badge }</span> }
            </div>

            <div className="quick-search-actions">
                { existingCartItem && <span className="quick-search-in-cart">בעגלה: { existingCartItem.amount }</span> }
                <button type="button" className="quick-search-add" onClick={handleAddToCart}>
                    הוספה לעגלה
                </button>
            </div>
        </div>
    );
};

export default QuickSearchItem;
