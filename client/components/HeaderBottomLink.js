import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image';

const HeaderBottomLink = ({ categoryId, href, title, subCategories }) => {
    const [ showSubcategories, setShowSubCategories ] = useState(false);
    const [ menuLeft, setMenuLeft ] = useState(0);

    const handleOver = () => {
        let left = document.getElementById(`category-link-${categoryId}`).offsetLeft;
        setMenuLeft(left);
        setShowSubCategories(true);
    }

    const handleLeave = (e) => {
        console.log(e.relatedTarget.className);
        if (!e.relatedTarget?.className?.includes('subcategories-menu')) {
            setShowSubCategories(false);
        }
    }

    const linkSubCategories = subCategories.filter((sub) => (sub.category == categoryId));
    
  return (
    <>
        <Link href={ href } className="header-bottom-link" id={`category-link-${categoryId}`} onMouseOver={handleOver} onMouseLeave={(e) => handleLeave(e)}>
            { title }
        </Link>

        { linkSubCategories.length > 0 && 
            <div className={`subcategories-menu ${showSubcategories && categoryId ? 'show' : ''}`} style={{left: menuLeft - 330}} onMouseLeave={(e) => setShowSubCategories(false)}>
                <div className="subcategories-menu-links">
                    { linkSubCategories.map((sub) => (
                            <Link href={`${href}/?subcategory=${sub.name}`}>{ sub.name }</Link>
                    )) }
                </div>
                
                { categoryId < 6 &&
                    <div className="subcategories-menu-image">
                        <Image
                            src={`/images/header-categories/${ categoryId }.jpeg`}
                            height={300}
                            width={200}
                            placeholder="blur"
                            blurDataURL="URL"
                        />
                    </div>
                }
            </div>
        }
    </>
  )
}

export default HeaderBottomLink