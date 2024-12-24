import React from 'react';
import globalStore from '../../stores/GlobalStore';

export const ProductPopup = ({ product }) => {

    const handleClose = () => {
        globalStore.popupProduct = null;
    }

    if (!product) return null;

    return (
        <>
            <div id="product-popup-bg" onClick={handleClose}></div>
            <div id="product-popup">
                <h2>{product.name}</h2>
                <p>{product.description}</p>
                <button onClick={handleClose}>Close</button>
            </div>
        </>
    );
};