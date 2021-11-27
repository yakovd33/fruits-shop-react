import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewProduct = () => {
    const [ categories, setCategoreis ] = useState([
        {
            id: 1,
            name: 'ירקות'
        }
    ]);

    const [ feedback, setFeedback ] = useState('');
    const [ name, setName ] = useState('');
    const [ min, setMin ] = useState('');
    const [ stock, setStock ] = useState(true);
    const [ cat, setCat ] = useState(1);
    const [ unit, setUnit ] = useState('ק"ג');
    const [ price, setPrice ] = useState('');
    const [ image, setImage ] = useState(null);

    const random = (length = 8) => {
        return Math.random().toString(16).substr(2, length);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let fd = new FormData();

        fd.append('name', name);
        fd.append('minAmount', min);
        fd.append('availability', stock);
        fd.append('category', cat);
        fd.append('unitType', unit);
        fd.append('price', price);
        fd.append('file', image);

        axios.post(`${process.env.API_URL}/products/`, fd, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((res) => {
            setFeedback(res.data);
        })
    }

    const handleCuteSelect = (e) => {
        e.preventDefault();

        document.getElementById("file-select-product").click();
    }

    return ( 
        <form id="new-product-form">
            <div className="input-group">
                <input type="text" placeholder="שם המוצר" value={ name } onChange={ (e) => setName(e.target.value) } className="input-box" />
            </div>
            
            <div className="input-group">
                <input type="number" placeholder="כמות מינימום" value={ min } onChange={ (e) => setMin(e.target.value) } className="input-box" />
            </div>

            <div className="input-group">
                <label htmlFor="">במלאי</label>
                <select name="" id="">
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
                <select name="" id="">
                    <option value={`ק"ג`}>ק"ג</option>
                    <option value={`יחידה`}>יחידה</option>
                    <option value={`חבילה`}>חבילה</option>
                </select>
            </div>

            <div className="input-group">
                <input type="number" placeholder="מחיר" value={ price } onChange={ (e) => setPrice(e.target.value) } className="input-box" />
            </div>

            <div className="input-group">
                <div className="cute-file-select">
                    <input type="file" id="file-select-product" onChange={ (e) => setImage(e.target.files[0]) }/>
                    <button className="cute-btn" onClick={ (e) => handleCuteSelect(e) }>בחר תמונה</button>
                </div>
            </div>

            { feedback && <p id="new-product-feedback">{ feedback }</p> }

            <input type="submit" onClick={ (e) => handleSubmit(e) } value="הוספה" />
        </form>
     );
}
 
export default NewProduct;