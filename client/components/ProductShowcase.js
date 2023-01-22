import React, { useState, useEffect } from 'react';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShoppingCart } from 'react-icons/ai';
import { TbTrash } from 'react-icons/tb';
import ReactTooltip from 'react-tooltip';
import axios from 'axios';
import Image from 'next/image';
import { BsInfoCircleFill } from 'react-icons/bs'
import { addToCartAnimation, handleRemoveFromCart, productHandleMinus, productHandlePlus } from '../helpers/CartHelper';

const ProductShowcase = ({ id, name, price, salePrice, description, minAmount, badge, image, unit, cartItems, setCartItems, bottomAddToCart, type="product" }) => {
    const [ amount, setAmount ] = useState(minAmount);
    const [ discount, setDiscount ] = useState(0);
    const [ cartAmount, setCartAmount ] = useState(0);

    useEffect(() => {
        // Find product in card
        let found = false;

        cartItems.map((cartItem, i) => {
            let cartid = cartItem.id;
            if (cartid == id) {
                setCartAmount(cartItem.amount);
                found = true;
            }
        })

        if (!found) setCartAmount(0)
    }, [cartItems]);

    useEffect(() => {
        setAmount(minAmount);
    }, [ minAmount ])

    const handleAddToCart = (e, justAnimation = false) => {
        let left = e.clientX - 80;
        let top = e.clientY - 170;
        if (type == 'search') {
            left = e.clientX + 100;
            top = e.clientY - 5;
        }
        let imageTag = `<img src="${image}" alt="">`;
        addToCartAnimation(imageTag, top, left);

        setTimeout(() => {
            document.getElementById("header-cart-icon").setAttribute('class', 'grow');

            setTimeout(() => {
                document.getElementById("header-cart-icon").setAttribute('class', '');
            }, 500);
        }, 1000);

        if (!justAnimation) {
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
        }
    }

    useEffect(() => {
        localStorage.setItem('discount', discount);
    }, [ discount ]);

    return (
        <div className="product-showcase">
            {/* { description && <div className="product-description">{ description }</div> } */}
            <ReactTooltip effect="solid"/>
            { description && <div className="product-description-badge" data-tip={description}><BsInfoCircleFill/></div> }
            
            { <span className={ `sale-badge ${salePrice && salePrice != 0 ? 'vis' : ''}` }>במבצע</span> }

            <div className="product-showcase-image">
                { badge && <span className="discount-badge">{ badge }</span> }
                <Image
                    src={image}
                    alt="פרי וירק ארצנו"
                    height="100%"
                    width="100%"
                    blurDataURL="URL"
                    placeholder="blur"
                    layout="responsive"
                    loading="lazy"
                />
            </div>

            <div className="product-showcase-textuals">
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

                { badge && <span className="discount-badge-mobile">{ badge }</span> }
            </div>

            <div className="product-showcase-add-to-cart-form">
                { bottomAddToCart &&  <div className="cute-btn product-showcase-add-to-cart bottom" onClick={ (e) => handleAddToCart(e) }><AiOutlineShoppingCart/> הוספה לעגלה</div> }
            </div>

            { cartAmount == 0 &&
                <>
                    <div className={`mobile-add-to-cart-btn ${type != 'search' ? 'show-mobile' : ''}`} onClick={ (e) => handleAddToCart(e) }>
                        <div className="icon"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path></svg>
                        </div>
                        <div className="text">הוסיפו</div>
                    </div>


                    { type != 'search' &&
                        <div className="add-to-cart-btn hide-mobile" onClick={ (e) => handleAddToCart(e) }>
                            <span className="icon"><svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M922.9 701.9H327.4l29.9-60.9 496.8-.9c16.8 0 31.2-12 34.2-28.6l68.8-385.1c1.8-10.1-.9-20.5-7.5-28.4a34.99 34.99 0 0 0-26.6-12.5l-632-2.1-5.4-25.4c-3.4-16.2-18-28-34.6-28H96.5a35.3 35.3 0 1 0 0 70.6h125.9L246 312.8l58.1 281.3-74.8 122.1a34.96 34.96 0 0 0-3 36.8c6 11.9 18.1 19.4 31.5 19.4h62.8a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7h161.1a102.43 102.43 0 0 0-20.6 61.7c0 56.6 46 102.6 102.6 102.6s102.6-46 102.6-102.6c0-22.3-7.4-44-20.6-61.7H923c19.4 0 35.3-15.8 35.3-35.3a35.42 35.42 0 0 0-35.4-35.2zM305.7 253l575.8 1.9-56.4 315.8-452.3.8L305.7 253zm96.9 612.7c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6zm325.1 0c-17.4 0-31.6-14.2-31.6-31.6 0-17.4 14.2-31.6 31.6-31.6s31.6 14.2 31.6 31.6a31.6 31.6 0 0 1-31.6 31.6z"></path></svg></span>
                            <span className="text">הוספה לעגלה</span>
                        </div>
                    }
                </>
            }

            { cartAmount > 0 &&
                <>
                    <div className={`cart-item-amount mobile-card-amount ${type != 'search' ? 'show-mobile' : ''}`}>
                        <div className="cart-item-amount-btn plus" onClick={ (e) => { productHandlePlus(id, cartItems, setCartItems, cartAmount, setCartAmount); handleAddToCart(e, true) } }>+</div>
                        <input type="text" className="cart-item-amount-number" readOnly="" value={cartAmount}/>
                        <div className="cart-item-amount-btn minus" onClick={ (e) => productHandleMinus(id, cartItems, setCartItems, cartAmount, setCartAmount) }>
                            { cartAmount != 1 && '-' }
                            { cartAmount == 1 && <TbTrash/> }
                        </div>
                    </div>

                    { type != 'search' &&
                        <div className={`cart-item-amount desktop-card-amount hide-mobile`}>
                            <div className="cart-item-amount-btn plus" onClick={ (e) => { productHandlePlus(id, cartItems, setCartItems, cartAmount, setCartAmount); handleAddToCart(e, true) } }>+</div>
                            <input type="text" className="cart-item-amount-number" readOnly="" value={cartAmount}/>
                            <div className="cart-item-amount-btn minus" onClick={ (e) => productHandleMinus(id, cartItems, setCartItems, cartAmount, setCartAmount) }>
                                { cartAmount != 1 && '-' }
                                { cartAmount == 1 && <TbTrash/> }
                            </div>
                        </div>
                    }
                </>
            }
        </div>
    );
}

export default ProductShowcase;