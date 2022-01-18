import React, { useState } from 'react';
import axios from 'axios';

const EditProduct = ({ id, product, setShowEdit }) => {
    const [ categories, setCategoreis ] = useState([
        {
            id: 1,
            name: 'ירקות'
        },
        {
            id: 2,
            name: 'פירות'
        },
        {
            id: 3,
            name: 'מעדנייה'
        },
        {
            id: 4,
            name: 'ירק ופטריות'
        },
        {
            id: 5,
            name: 'מזווה'
        },
        {
            id: 6,
            name: 'יבשים'
        },
        {
            id: 7,
            name: 'מבצעים'
        }
    ]);

    const [ feedback, setFeedback ] = useState('');
    const [ name, setName ] = useState(product.name);
    const [ min, setMin ] = useState(product.minAmount);
    const [ stock, setStock ] = useState(product.availability);
    const [ cat, setCat ] = useState(product.category);
    const [ unit, setUnit ] = useState(product.unitType);
    const [ price, setPrice ] = useState(product.price);
    const [ salePrice, setSalePrice ] = useState(product.salePrice);
    const [ description, setDescription ] = useState(product.description);
    const [ badge, setBadge ] = useState(product.badge);
    const [ image, setImage ] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.API_URL}/products/update/${id}`, {
            name: name,
            minAmount: min,
            availability: stock,
            category: cat,
            unitType: unit,
            price: price,
            description: description,
            salePrice: salePrice,
            badge: badge
        }).then((res) => {
            console.log(res);
            setFeedback(res.data);

            // Upload image
            let file_fd = new FormData();
            file_fd.append('file', image);
            file_fd.append('product_id', id);

            axios.post(`https://eropa.co.il/fruits/upload.php`, file_fd).then((res) => {
                console.log(res);
            })
        })
    }

    const handleCuteSelect = (e) => {
        e.preventDefault();

        document.getElementById("file-select-product").click();
    }

    return ( 
        <div id="edit-product">
            <div id="edit-product-bg" onClick={ () => setShowEdit(false) }></div>
            <form id="edit-product-form">
                <div className="input-group">
                    <input type="text" placeholder="שם המוצר" value={ name } onChange={ (e) => setName(e.target.value) } className="input-box" />
                </div>
                
                <div className="input-group">
                    <input type="number" placeholder="כמות מינימום" value={ min } onChange={ (e) => setMin(e.target.value) } className="input-box" />
                </div>

                <div className="input-group">
                    <label htmlFor="">במלאי</label>
                    <select name="" id="" onChange={ (e) => setStock(e.target.value) }>
                        <option value="true">כן</option>
                        <option value="false">לא</option>
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="">קטגוריה</label>
                    <select value={ cat } onChange={ (e) => setCat(e.target.value) }>
                        { categories.map((cat) => (
                            <option value={ cat.id }>{ cat.name }</option>
                        )) }
                    </select>
                </div>

                <div className="input-group">
                    <label htmlFor="">סוג יחידה</label>
                    <select name="" id="" onChange={ (e) => setUnit(e.target.value) }>
                        <option value={`ק"ג`}>ק"ג</option>
                        <option value={`יחידה`}>יחידה</option>
                        <option value={`חבילה`}>חבילה</option>
                    </select>
                </div>

                <div className="input-group">
                    <input type="number" placeholder="מחיר" value={ price } onChange={ (e) => setPrice(e.target.value) } className="input-box" />
                </div>

                <div className="input-group">
                    <input type="number" placeholder="מחיר מבצע" value={ salePrice } onChange={ (e) => setSalePrice(e.target.value) } className="input-box" />
                </div>

                <div className="input-group">
                    <input type="text" placeholder="תיאור" value={ description } onChange={ (e) => setDescription(e.target.value) } className="input-box" />
                </div>

                <div className="input-group">
                    <input type="text" placeholder="שילוט" value={ badge } onChange={ (e) => setBadge(e.target.value) } className="input-box" />
                </div>

                <div className="input-group">
                    <div className="cute-file-select">
                        <input type="file" id="file-select-product" onChange={ (e) => setImage(e.target.files[0]) }/>
                        <button className="cute-btn" onClick={ (e) => handleCuteSelect(e) }>בחר תמונה</button>
                    </div>
                </div>

                { feedback && <p id="new-product-feedback">{ feedback }</p> }

                <input type="submit" onClick={ (e) => handleSubmit(e) } value="שמירה" />
            </form>
        </div>
     );
}
 
export default EditProduct;