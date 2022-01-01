import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NewProduct = ({ tab }) => {
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
    const [ name, setName ] = useState('');
    const [ min, setMin ] = useState('');
    const [ stock, setStock ] = useState(true);
    const [ cat, setCat ] = useState(1);
    const [ unit, setUnit ] = useState('ק"ג');
    const [ price, setPrice ] = useState('');
    const [ salePrice, setSalePrice ] = useState('');
    const [ description, setDescription ] = useState('');
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
        fd.append('salePrice', salePrice);
        fd.append('description', description);
        // fd.append('file', image);

        axios.post(`${process.env.API_URL}/products/`, fd, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((res) => {
            setFeedback(res.data.msg);

            let product_id = res.data.id;

            let file_fd = new FormData();
            file_fd.append('file', image);
            file_fd.append('product_id', product_id);

            axios.post(`https://eropa.co.il/fruits/upload.php`, file_fd).then((res) => {
                console.log(res);
            })
        });
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
                <select name="" id="" onClick={ (e) => setUnit(e.target.value) }>
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