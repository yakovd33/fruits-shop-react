import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from 'react-icons/ai';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import Image from 'next/image';
import { BsInfoCircleFill } from 'react-icons/bs'
import LazyLoad from 'react-lazyload';
import { addToCartAnimation } from '../helpers/CartHelper';

const ProductShowcase = ({ id, name, price, salePrice, description, minAmount, badge, image, unit, cartItems, setCartItems, bottomAddToCart }) => {
    const [ amount, setAmount ] = useState(minAmount);
    const [ discount, setDiscount ] = useState(0);

    useEffect(() => {
        setAmount(minAmount);
    }, [ minAmount ])

    const handleAddToCart = (e) => {
        let left = e.clientX + 80;
        let top = e.clientY - 170;
        let imageTag = `<img src="${image}" alt="">`;
        addToCartAnimation(imageTag, top, left);

        setTimeout(() => {
            document.getElementById("header-cart-icon").setAttribute('class', 'grow');

            setTimeout(() => {
                document.getElementById("header-cart-icon").setAttribute('class', '');
            }, 500);
        }, 1000);

        let found = false;

        cartItems.map((item) => {
            if (item.name == name) {
                found = true;
            }
        });

        if (!found) {
            let finalPrice = (salePrice) ? salePrice : price;
            setCartItems(cartItems => [ ...cartItems, { id, name, amount, minAmount, originalPrice: price, price: finalPrice, image } ]);
        } else {
            let newCart = cartItems.map((item, i) => {
                if (item.name == name) return { ...item, amount: item.amount + 1 };
                else return item
            });
    
            setCartItems(newCart);
        }

        // Update discounts
        setDiscount(0);

        cartItems.map((item) => {
            axios.get(`${process.env.API_URL}/discounts/product_discount/${ item.id }/${ item.amount }`).then(discount => {
                setDiscount((prevDis) => prevDis + parseInt(discount.data))
            })
        });
        // CartHelper.getCartDiscount(cartItems, setDiscount);
    }

    useEffect(() => {
        localStorage.setItem('discount', discount);
    }, [ discount ]);

    return (
        <div className="product-showcase">
            { badge && <span className="discount-badge">{ badge }</span> }
            {/* { description && <div className="product-description">{ description }</div> } */}
            <ReactTooltip effect="solid"/>
            { description && <div className="product-description-badge" data-tip={description}><BsInfoCircleFill/></div> }
            
            { <span className={ `sale-badge ${salePrice && salePrice != 0 ? 'vis' : ''}` }>במבצע</span> }

            <LazyLoad once>
            <div className="product-showcase-image">
                <Image
                    src={image}
                    alt="פרי וירק ארצנו"
                    height="100%"
                    width="100%"
                    blurDataURL="URL"
                    placeholder="blur"
                    layout="responsive"
                />
            </div>
            </LazyLoad>

            <div className="product-showcase-name">{ name }</div>
            <div className="product-showcase-price">
                <span className={ `showcase-price ${!salePrice ? 'db' : 'dn'} `}>
                    {`${!salePrice ? `${price}₪` : ''}`}
                </span>
                
                <span className={ `showcase-price ${salePrice ? 'db' : 'dn'} `}>
                    <span className="new-price">{salePrice}₪</span>
                    <span className="old-price">{price}₪</span>
                </span>

                / { unit }
            </div>

            <div className="product-showcase-add-to-cart-form">
                <div className="cart-item-amount-wrap">
                    <div className="cart-item-amount">
                        <div className="cart-item-form-amount">
                            <div className="cart-item-form-amount-content">
                                <button className="cart-item-form-plus" onClick={ () => { if (amount > minAmount) setAmount(amount - 1) } }><AiOutlineMinus/></button>
                                <input type="number" className="cart-item-form-amount-field" value={ amount } onChange={ (e) => setAmount(e.target.value) } data-np-checked="1"/>
                                <button className="cart-item-form-minus" onClick={ () => setAmount(amount + 1) }><AiOutlinePlus/></button>
                            </div>

                            <div className="cute-btn product-showcase-add-to-cart" onClick={ (e) => handleAddToCart(e) }>הוספה לעגלה</div>
                            
                        </div>

                        
                    </div>
                </div>

                { bottomAddToCart &&  <div className="cute-btn product-showcase-add-to-cart bottom" onClick={ (e) => handleAddToCart(e) }><AiOutlineShoppingCart/> הוספה לעגלה</div> }
            </div>
        </div>
    );
}
 
export default ProductShowcase;