import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';
import SubcategoryItem from './SubCategoryItem';

const CategoryItem = ({ category, categories, setCategories, deleteCallback }) => {
    const [subcategories, setSubcategories] = useState([]);

    useEffect(() => {
        // Get category subcategories
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${category.id}`).then((res) => {
            setSubcategories(res.data || []);
        });
    }, []);
    
    const deleteCategory = (categoryId) => {
        console.log(categoryId);
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/categories/${ categoryId }`).then(res => {
                setCategories(categories.filter((cat) => cat.id !== categoryId))
            });
        }
    }
    
    return (
        <>
            <div className="discount-list-item">
                <div className="discount-delete-btn" onClick={ () => deleteCategory(category.id) }><BiTrash/></div>

                <div>{category.name}</div>
            </div>

            { (subcategories || []).map((item) => (
                <SubcategoryItem subcategory={item} subcategories={subcategories} setSubCategories={setSubcategories} deleteCallback={deleteCallback}/>
            )) }
        </>
    )
}

export default CategoryItem
