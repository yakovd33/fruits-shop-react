import React, { useState, useEffect } from 'react'
import axios from 'axios';
import CategoryItem from './CategoryItem';

const CategoriesList = ({ tab }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const [ mainCategory, setMainCategory ] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (mainCategory == null) {
            axios.post(`${process.env.API_URL}/categories`, { name: newCategoryName }).then((newCategory) => {
                setCategories([...categories, newCategory.data]);
                setNewCategoryName('');
            });
        } else {
            axios.post(`${process.env.API_URL}/subcategories`, { name: newCategoryName, category: mainCategory }).then((newCategory) => {
                getCategories();
                setNewCategoryName('');
            });
        }
    }

    useEffect(() => {
        // Get all categories
        getCategories();
    }, [ tab ]);

    const getCategories = () => {
        axios.get(`${process.env.API_URL}/categories`).then((res) => {
            setCategories(res.data || []);
        });
    }

  return (
    <div>
        <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
            <h3>הוסף קטגוריה חדשה</h3>
            <div>
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
            </div>

            <div>
                <select onChange={(e) => setMainCategory(e.target.value)}>
                    <option value="null">בחר קטגוריה ראשית</option>
                    { categories.map(item => (
                        <option value={item.id}>{item.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <input type="submit" value="הוסף" />
            </div>
        </form>

        <div id="gifts-list">
            { categories.map(item => (
                <CategoryItem category={ item } categories={ categories } setCategories={ setCategories } deleteCallback={getCategories}/>
            )) }
        </div>
    </div>
  )
}

export default CategoriesList