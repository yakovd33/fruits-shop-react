import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image';

const MENU_BASE_WIDTH = 640;
const MENU_MIN_WIDTH = 280;
const MENU_GUTTER = 20;

const HeaderBottomLink = ({ categoryId, href, title, subCategories }) => {
    const [ showSubcategories, setShowSubCategories ] = useState(false);
    const [ menuPosition, setMenuPosition ] = useState({ left: 0, width: MENU_BASE_WIDTH, arrowOffset: 40 });

    const handleOver = () => {
        const linkElement = document.getElementById(`category-link-${categoryId}`);
        if (!linkElement || typeof window === 'undefined') {
            setShowSubCategories(true);
            return;
        }

        const rect = linkElement.getBoundingClientRect();
        const viewportWidth = window.innerWidth || MENU_BASE_WIDTH;
        const menuWidth = Math.max(MENU_MIN_WIDTH, Math.min(MENU_BASE_WIDTH, viewportWidth - MENU_GUTTER * 2));
        const rawLeft = rect.left + rect.width / 2 - menuWidth / 2;
        const maxLeft = Math.max(MENU_GUTTER, viewportWidth - menuWidth - MENU_GUTTER);
        const clampedLeft = Math.min(Math.max(rawLeft, MENU_GUTTER), maxLeft);
        const linkCenterWithinMenu = rect.left + rect.width / 2 - clampedLeft;
        const arrowOffset = Math.min(Math.max(linkCenterWithinMenu - 12, 24), menuWidth - 24);

        setMenuPosition({ left: clampedLeft, width: menuWidth, arrowOffset });
        setShowSubCategories(true);
    }

    const handleLeave = (e) => {
        const nextTarget = e.relatedTarget;
        const isMenuHover = nextTarget && typeof nextTarget.closest === 'function' && nextTarget.closest('.subcategories-menu');
        const isSameLink = nextTarget && nextTarget.id === `category-link-${categoryId}`;

        if (!isMenuHover && !isSameLink) {
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
            <div
                className={`subcategories-menu ${showSubcategories && categoryId ? 'show' : ''}`}
                style={{
                    left: menuPosition.left,
                    width: menuPosition.width,
                    '--submenu-arrow-x': `${menuPosition.arrowOffset}px`
                }}
                onMouseLeave={() => setShowSubCategories(false)}
            >
                <div className="subcategories-menu-header">
                    <div>
                        <div className="subcategories-menu-title">{ title }</div>
                        <div className="subcategories-menu-tagline">קטגוריות משנה מומלצות</div>
                    </div>
                        <Link href={ href } className="subcategories-menu-category-link">
                            לכל המוצרים
                        </Link>
                </div>

                <div className="subcategories-menu-body">
                    <div className={`subcategories-menu-links${linkSubCategories.length > 6 ? ' has-many' : ''}`}>
                        { linkSubCategories.map((sub) => (
                            <Link
                                key={`${sub._id || sub.id || sub.name}-${categoryId}`}
                                href={`${href}/?subcategory=${sub.name}`}
                            >
                                { sub.name }
                            </Link>
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
                                alt={ title }
                            />
                        </div>
                    }
                </div>
            </div>
        }
    </>
  )
}

export default HeaderBottomLink