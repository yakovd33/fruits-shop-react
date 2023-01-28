import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';

const SubcategoryItem = ({ subcategory, subCategories, setSubCategories }) => {
    const deleteSubCategory = (subcategoryId) => {
        console.log(subcategoryId);
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.API_URL}/subcategories/${ subcategoryId }`).then(res => {
                setSubCategories(subCategories.filter((cat) => cat.id !== subcategoryId))
            });
        }
    }
    
    return (
        <>
            <div className="discount-list-item category-item-subcategory">
                <div className="discount-delete-btn" onClick={ () => deleteSubCategory(subcategory.id) }><BiTrash/></div>

                <div>{subcategory.name}</div>
            </div>
        </>
    )
}

export default SubcategoryItem
