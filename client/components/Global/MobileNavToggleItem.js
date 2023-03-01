import React from 'react'
import Link from "next/link";
import { FaAngleDown } from "react-icons/fa";

const MobileNavToggleItem = ({ id, name, handleDropdown, currentDropdown, subCategories }) => {
    const nestedSubcategories = subCategories.filter((sub) => sub.category == id)

    return (
        <>
            <div className="mobile-nav-link category">
                <Link href={`/category/${id}`}>{name}</Link>
                { (nestedSubcategories.length > 0) && <span className="icon" onClick={() => handleDropdown(id)}><FaAngleDown/></span> }
            </div>

            <div className={`category-dropdown ${currentDropdown == id ? 'active' : ''}`}>
                { nestedSubcategories.map((sub) => (
                    <Link href={`/category/${id}/?subcategory=${sub.name}`} className="mobile-nav-link">{sub.name}</Link>
                )) }
            </div>
        </>
    )
}

export default MobileNavToggleItem