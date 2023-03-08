import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BiTrash } from 'react-icons/bi';

const SubcategoryItem = ({ subcategory, subCategories, setSubCategories, deleteCallback }) => {
    const deleteSubCategory = (subcategoryId) => {
        if (prompt("הזן סיסמא") == '123123') {
            axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/subcategories/${ subcategoryId }`).then(res => {
                deleteCallback();
            });
        }
    }
    
    return (
        <>
            <div className="discount-list-item category-item-subcategory">
                <div className="discount-delete-btn" onClick={ () => deleteSubCategory(subcategory._id) }><BiTrash/></div>

                <div>{subcategory.name}</div>
            </div>
        </>
    )
}

export default SubcategoryItem
