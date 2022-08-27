import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaTimes, FaAngleDown } from "react-icons/fa";
import { useRouter } from 'next/router';

const MobileNav = ({ mobileNavTog, setMobileNavTog }) => {
	const router = useRouter();
	const [ currentDropdown, setCurrentDropdown ] = useState('');

	const handleDropdown = (id) => {
		setCurrentDropdown(currentDropdown != id ? id : '')
	}

	useEffect(() => {
		setMobileNavTog(false)
	  }, [router.asPath]);	

  return (
	<>
		<div id="mobile-nav-bg" className={`${mobileNavTog ? "active" : ""}`} onClick={() => setMobileNavTog(false)}></div>

		<div id="mobile-nav" className={`${mobileNavTog ? "active" : ""}`}>
			<div id="mobile-nav-header">
				<div className="title">תפריט</div>
				<div className="icon" onClick={() => setMobileNavTog(false)}><FaTimes/></div>
			</div>

			<div id="mobile-nav-links">
				<Link href="/">
					<a href="/" className="mobile-nav-link">
						דף הבית
					</a>
				</Link>
				
				<Link href="/about">
					<a href="/about" className="mobile-nav-link">
						אודות
					</a>
				</Link>

				<Link href="/legal">
					<a href="/legal" className="mobile-nav-link">
						תקנון
					</a>
				</Link>

				{/* ירקות */}
				<div className="mobile-nav-link category">
					<Link href="/category/1">ירקות</Link>
					<span className="icon" onClick={() => handleDropdown(1)}><FaAngleDown/></span>
				</div>

				<div className={`category-dropdown ${currentDropdown == 1 ? 'active' : ''}`}>
					<Link href="/category/1/?subcategory=ירקות קפואים" className="mobile-nav-link">
						ירקות קפואים
					</Link>
				</div>

				{/* פירות */}
				<div className="mobile-nav-link category">
					<Link href="/category/2">פירות</Link>
					<span className="icon" onClick={() => handleDropdown(2)}><FaAngleDown/></span>
				</div>

				<div className={`category-dropdown ${currentDropdown == 2 ? 'active' : ''}`}>
					<Link href="/category/2/?subcategory=פירות קפואים" className="mobile-nav-link">
						פירות קפואים
					</Link>
				</div>

				{/* מעדנייה */}
				<div className="mobile-nav-link category">
					<Link href="/category/1">מעדנייה</Link>
					<span className="icon" onClick={() => handleDropdown(3)}><FaAngleDown/></span>
				</div>

				<div className={`category-dropdown ${currentDropdown == 3 ? 'active' : ''}`}>
					<Link href="/category/3/?subcategory=גבינות" className="mobile-nav-link">
						גבינות
					</Link>

					<Link href="/category/3/?subcategory=ביצים" className="mobile-nav-link">
						ביצים
					</Link>

					<Link href="/category/3/?subcategory=חמוצים" className="mobile-nav-link">
						חמוצים
					</Link>
				</div>

				{/* ירק ופטריות */}
				<div className="mobile-nav-link category">
					<Link href="/category/4">ירק ופטריות</Link>
					<span className="icon" onClick={() => handleDropdown(4)}><FaAngleDown/></span>
				</div>

				<div className={`category-dropdown ${currentDropdown == 4 ? 'active' : ''}`}>
					<Link href="/category/4/?subcategory=פטריות" className="mobile-nav-link">
						פטריות
					</Link>

					<Link href="/category/4/?subcategory=עלים" className="mobile-nav-link">
						עלים
					</Link>

					<Link href="/category/4/?subcategory=עשבי תיבול" className="mobile-nav-link">
						עשבי תיבול
					</Link>
				</div>

				{/* מזווה */}
				<div className="mobile-nav-link category">
					<Link href="/category/5">מזווה</Link>
					<span className="icon" onClick={() => handleDropdown(5)}><FaAngleDown/></span>
				</div>

				<div className={`category-dropdown ${currentDropdown == 5 ? 'active' : ''}`}>
					<Link href="/category/5/?subcategory=מאפייה" className="mobile-nav-link">
						מאפייה
					</Link>

					<Link href="/category/5/?subcategory=קמחים" className="mobile-nav-link">
						קמחים
					</Link>

					<Link href="/category/5/?subcategory=בישול" className="mobile-nav-link">
						בישול
					</Link>

					<Link href="/category/5/?subcategory=דגנים" className="mobile-nav-link">
						דגנים
					</Link>

					<Link href="/category/5/?subcategory=קטניות" className="mobile-nav-link">
						קטניות
					</Link>

					<Link href="/category/5/?subcategory=שמנים" className="mobile-nav-link">
						שמנים
					</Link>

					<Link href="/category/5/?subcategory=יינות" className="mobile-nav-link">
						יינות
					</Link>

					<Link href="/category/5/?subcategory=בירות" className="mobile-nav-link">
						בירות
					</Link>

					<Link href="/category/5/?subcategory=תה" className="mobile-nav-link">
						תה
					</Link>

					<Link href="/category/5/?subcategory=משקאות טבעיים" className="mobile-nav-link">
						משקאות טבעיים
					</Link>

					<Link href="/category/5/?subcategory=קפה" className="mobile-nav-link">
						קפה
					</Link>

					<Link href="/category/5/?subcategory=ממרחים" className="mobile-nav-link">
						ממרחים
					</Link>

					<Link href="/category/5/?subcategory=רטבים" className="mobile-nav-link">
						רטבים
					</Link>

					<Link href="/category/5/?subcategory=ריבות" className="mobile-nav-link">
						ריבות
					</Link>

					<Link href="/category/5/?subcategory=אסיאתי" className="mobile-nav-link">
						אסיאתי
					</Link>

					<Link href="/category/5/?subcategory=אורגני" className="mobile-nav-link">
						אורגני
					</Link>
				</div>

				{/* יבשים */}
				<div className="mobile-nav-link category">
					<Link href="/category/6">יבשים</Link>
					<span className="icon" onClick={() => handleDropdown(6)}><FaAngleDown/></span>
				</div>

				<div className={`category-dropdown ${currentDropdown == 6 ? 'active' : ''}`}>
					<Link href="/category/6/?subcategory=חטיפים" className="mobile-nav-link">
						חטיפים
					</Link>

					<Link href="/category/6/?subcategory=פיצוחים" className="mobile-nav-link">
						פיצוחים
					</Link>

					<Link href="/category/6/?subcategory=תבלינים" className="mobile-nav-link">
						תבלינים
					</Link>
				</div>
			</div>

			<div id="mobile-nav-footer">
				<span>נבנה ב-❤️ ע"י <a href="https://eropa.co.il">אירופה בניית אתרים</a></span>
			</div>
		</div>
	</>
  );
};

export default MobileNav;
