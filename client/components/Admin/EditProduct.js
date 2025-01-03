import React, { useState, useEffect } from 'react';
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
        },
        {
            id: 25,
            name: 'המיוחדים'
        },
        {
            id: 28,
            name: 'מארזים'
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
    const [ priceKg, setPriceKg ] = useState(product.priceKg);
    const [ salePriceKg, setSalePriceKg ] = useState(product.salePriceKg);
    const [ description, setDescription ] = useState(product.description);
    const [ badge, setBadge ] = useState(product.badge);
    const [ image, setImage ] = useState(null);
    const [ isRecommended, setIsRecommended ] = useState(product.isRecommended);
    const [ isHomepage, setIsHomepage ] = useState(product.isHomepage);
    const [ subCategories, setSubCategories ] = useState([]);
    const [ subCategory, setSubCategory ] = useState(product.subCategory);

    useEffect(() => {
        // Get subcategories
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subcategories`).then((res) => {
            setSubCategories(res.data)
        }).catch((e) => {
            console.log(e);
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/update/${id}`, {
            name,
            minAmount: min,
            availability: stock,
            category: cat,
            unitType: unit,
            price,
            description: description,
            salePrice,
            badge,
            isRecommended,
            isHomepage,
            subCategory,
            priceKg,
            salePriceKg
        }).then((res) => {
            setFeedback(res.data);

            // Upload image
            let file_fd = new FormData();
            file_fd.append('file', image);
            file_fd.append('product_id', id);

            axios.post(`${process.env.NEXT_PUBLIC_API_URL}/products/update_thumb/${id}`, file_fd).then((res) => {
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
                    <select name="" id="" onChange={ (e) => setUnit(e.target.value) }>
                        <option value={`ק"ג`}>ק"ג</option>
                        <option value={`יחידה`}>יחידה</option>
                        <option value={`both`}>ק״ג ויחידה</option>
                        <option value={`חבילה`}>חבילה</option>
                    </select>
                </div>
                
                <>
                    <div className="input-group">
                        <input type="number" placeholder="מחיר" value={ price } onChange={ (e) => setPrice(e.target.value) } className="input-box" />
                    </div>

                    <div className="input-group">
                        <input type="number" placeholder="מחיר מבצע" value={ salePrice } onChange={ (e) => setSalePrice(e.target.value) } className="input-box" />
                    </div>
                </>

                <>
                    <div className="input-group">
                        <input type="number" placeholder="מחיר קילו" value={ priceKg } onChange={ (e) => setPriceKg(e.target.value) } className="input-box" />
                    </div>

                    <div className="input-group">
                        <input type="number" placeholder="מחיר מבצע קילו" value={ salePriceKg } onChange={ (e) => setSalePriceKg(e.target.value) } className="input-box" />
                    </div>
                </>

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

                <div className="input-group">
                    <div className="checkbox-wrap">
                        <input type="checkbox" defaultChecked={isRecommended} onChange={(e) => setIsRecommended(e.target.checked)}/> מומלצי השבוע
                    </div>
                </div>

                <div className="input-group">
                    <div className="checkbox-wrap">
                        <input type="checkbox" defaultChecked={isHomepage} onChange={(e) => setIsHomepage(e.target.checked)}/> דף הבית
                    </div>
                </div>

                { feedback && <p id="new-product-feedback">{ feedback }</p> }

                <input type="submit" onClick={ (e) => handleSubmit(e) } value="שמירה" />
            </form>
        </div>
     );
}
 
export default EditProduct;