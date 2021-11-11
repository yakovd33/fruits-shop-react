import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';

const ProductShowcase = ({ name, price, image, unit }) => {
    return (
        <div className="product-showcase">
            <div className="product-showcase-image">
                <img src={ image } alt="" />
            </div>

            <div className="product-showcase-name">{ name }</div>
            <div className="product-showcase-price">{ price }₪ / { unit }</div>

            <div className="product-showcase-add-to-cart-form">
                <div className="cart-item-amount-wrap">
                    <div className="cart-item-amount">
                        <div className="cart-item-form-amount">
                            <button className="cart-item-form-plus"><AiOutlineMinus/></button>
                            <input type="number" className="cart-item-form-amount-field" value="1" data-np-checked="1"/>
                            <button className="cart-item-form-minus"><AiOutlinePlus/></button>
                        </div>
                    </div>
                </div>

                <div className="cute-btn product-showcase-add-to-cart">הוספה לעגלה</div>
            </div>
        </div>
    );
}
 
export default ProductShowcase;