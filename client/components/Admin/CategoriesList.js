import React, { useState, useEffect } from 'react'
import axios from 'axios';
import CategoryItem from './CategoryItem';

const CategoriesList = ({ tab }) => {
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categories, setCategories] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.post(`${process.env.API_URL}/categories`, { name: newCategoryName }).then((newCategory) => {
            setCategories([...categories, newCategory.data]);
            setNewCategoryName('');
        })
    }

    useEffect(() => {
        // Get all categories
        axios.get(`${process.env.API_URL}/categories`).then((res) => {
            setCategories(res.data || []);
        });
    }, [ tab ]);

  return (
    <div>
        <form action="" id="new-discount-form" onSubmit={ (e) => handleSubmit(e) }>
            <h3>הוסף קטגוריה חדשה</h3>
            <div>
                <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)}/>
            </div>

            <div>
                <input type="submit" value="הוסף" />
            </div>
        </form>

        <div id="gifts-list">
            { categories.map(item => (
                <CategoryItem category={ item } categories={ categories } setCategories={ setCategories }/>
            )) }
        </div>
    </div>
  )
}

export default CategoriesList