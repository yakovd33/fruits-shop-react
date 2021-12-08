import React, { useState } from 'react';
import axios from 'axios';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa'; 
import EditProduct from './EditProduct';

const ProductListItem = ({ id, product, products, setProducts }) => {
    const [ showEdit, setShowEdit ] = useState(false);

    const handleDelete = () => {
        if (prompt("על מנת למחוק מוצר זה, הזן סיסמא") == '123123') {
            axios.delete(`${process.env.API_URL}/products/${id}`).then((res) => {
                console.log(res);

                // Delete from the state
                setProducts(products.filter((product) => product.id !== id))
            })
        }
    }

    return ( 
        <div className="product-list-item">
            { showEdit && <EditProduct id={ id } product={ product } setShowEdit={ setShowEdit }/> }

            <div className="img">
                <img src={ `https://eropa.co.il/fruits/uploads/${id}.jpg` } alt="" />
            </div>

            <div className="name">{ product.name }</div>
            <div className="price">{ product.price }₪</div>
            <div className="actions">
                <div className="list-action edit" onClick={ () => setShowEdit(true) }><FaPencilAlt/></div>
                <div className="list-action delete" onClick={ handleDelete }><FaTrashAlt/></div>
            </div>
        </div>
     );
}
 
export default ProductListItem;