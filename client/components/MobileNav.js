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
			<div id="mobile-nav-header">
				<div className="title">תפריט</div>
				<div className="icon" onClick={() => setMobileNavTog(false)}><FaTimes/></div>
			</div>

			<div id="mobile-nav-links">
				<Link href="/" className="mobile-nav-link">
					דף הבית
				</Link>
				
				<Link href="/about" className="mobile-nav-link">
					אודות
				</Link>

				<Link href="/legal" className="mobile-nav-link">
					תקנון
				</Link>

				{ (categories || []).map((category) => (
					<MobileNavToggleItem id={category.id} name={category.name} handleDropdown={handleDropdown} currentDropdown={currentDropdown} subCategories={subCategories}/>
				)) }
			</div>

			<div id="mobile-nav-footer">
				<span>נבנה ב-❤️ ע"י <a href="https://eropa.co.il">אירופה בניית אתרים</a></span>
			</div>
		</div>
	</>
  );
};

export default MobileNav;
