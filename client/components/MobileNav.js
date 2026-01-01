import Link from "next/link";
import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useRouter } from 'next/router';
import MobileNavToggleItem from "./Global/MobileNavToggleItem";
import axios from "axios";

const MobileNav = ({ mobileNavTog, setMobileNavTog, subCategories }) => {
	const router = useRouter();
	const [ currentDropdown, setCurrentDropdown ] = useState('');
	const [categories, setCategories] = useState([]);

	const handleDropdown = (id) => {
		setCurrentDropdown(currentDropdown != id ? id : '')
	}

	useEffect(() => {
		setMobileNavTog(false)
	}, [router.asPath]);

	useEffect(() => {
		axios.get(`${process.env.NEXT_PUBLIC_API_URL}/categories`).then((res) => {
			setCategories(res.data);
		}).catch((error) => {
			console.log(error);
		});
	}, []);

	return (
	<>
		<div id="mobile-nav-bg" className={`${mobileNavTog ? "active" : ""}`} onClick={() => setMobileNavTog(false)}></div>

		<div id="mobile-nav" className={`${mobileNavTog ? "active" : ""}`}>
			<div className="mobile-nav-shell">
				<div id="mobile-nav-header">
					<div>
						<p className="title">תפריט</p>
						<span className="subtitle">כל השפע במרחק לחיצה</span>
					</div>
					<button type="button" className="icon" onClick={() => setMobileNavTog(false)} aria-label="סגירת תפריט"><FaTimes/></button>
				</div>

				<div className="mobile-nav-body">
					<div className="mobile-nav-summary">
						<p>הוסיפו מוצרים, עדכנו הזמנה או דברו איתנו בקלות.</p>
						<div className="mobile-nav-actions">
							<a href="https://wa.me/972523207007" target="_blank" rel="noreferrer" className="mobile-nav-chip">ווטסאפ</a>
							<a href="tel:0528629030" className="mobile-nav-chip secondary">חיוג מהיר</a>
						</div>
					</div>

					<div className="mobile-nav-section">
						<p className="mobile-nav-section-label">קטגוריות</p>
						<div className="mobile-nav-links" id="mobile-nav-links">
							{ (categories || []).map((category) => (
								<MobileNavToggleItem
									key={ category.id }
									id={ category.id }
									name={ category.name }
									handleDropdown={ handleDropdown }
									currentDropdown={ currentDropdown }
									subCategories={ subCategories }
								/>
							)) }
						</div>
					</div>

					<div className="mobile-nav-section">
						<p className="mobile-nav-section-label">גלישה מהירה</p>
						<ul className="mobile-nav-primary-links">
							<li><Link href="/">דף הבית</Link></li>
							<li><Link href="/about">אודות</Link></li>
							<li><Link href="/legal">תקנון</Link></li>
						</ul>
					</div>
				</div>

				<div id="mobile-nav-footer">
					<span>נבנה ב-❤️ ע"י <a href="https://eropa.co.il">אירופה בניית אתרים</a></span>
				</div>
			</div>
		</div>
	</>
	);
};

export default MobileNav;
