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
		axios.get(`${process.env.API_URL}/categories`).then((res) => {
			setCategories(res.data);
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
				<Link href="/">
					<a className="mobile-nav-link">
						דף הבית
					</a>
				</Link>
				
				<Link href="/about">
					<a className="mobile-nav-link">
						אודות
					</a>
				</Link>

				<Link href="/legal">
					<a className="mobile-nav-link">
						תקנון
					</a>
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
