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
        },
        {
            id: 8,
            name: 'דף הבית'
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
    const [ isRecommended, setIsRecommended ] = useState(false);
    const [ isHomepage, setIsHomepage ] = useState(false);
    const [ subCategories, setSubCategories ] = useState([]);
    const [ subCategory, setSubCategory ] = useState(null);

    useEffect(() => {
        // Get subcategories
        axios.get(`${process.env.API_URL}/subcategories`).then((res) => {
            setSubCategories(res.data)
        }).catch((e) => {
            console.log(e);
        });
    }, []);

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
        fd.append('isRecommended', isRecommended);
        fd.append('isHomepage', isHomepage);
        fd.append('subCategory', subCategory);
        fd.append('file', image);

        axios.post(`${process.env.API_URL}/products/`, fd, {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }).then((res) => {
            setFeedback(res.data.msg);
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
                <label htmlFor="">תת קטגוריה</label>
                <select value={ subCategory } onChange={ (e) => setSubCategory(e.target.value) }>
                    <option>בחר תת קטגוריה</option>
                    { subCategories.map((sub) => (
                        sub.category == cat ?
                            <option value={ sub.name }>{ sub.name }</option>
                        : null
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


            <div className="input-group">
                <div className="checkbox-wrap">
                    <input type="checkbox" checked={isRecommended} onChange={(e) => setIsRecommended(e.target.checked)}/> מומלצי השבוע
                </div>
            </div>

            <div className="input-group">
                <div className="checkbox-wrap">
                    <input type="checkbox" checked={isHomepage} onChange={(e) => setIsHomepage(e.target.checked)}/> דף הבית
                </div>
            </div>

            { feedback && <p id="new-product-feedback">{ feedback }</p> }

            <input type="submit" onClick={ (e) => handleSubmit(e) } value="הוספה" />
        </form>
     );
}
 
export default NewProduct;