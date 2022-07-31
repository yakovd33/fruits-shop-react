import React, { useState, useEffect } from 'react'
import HeaderBottomLink from './HeaderBottomLink'
import axios from 'axios'

const HeaderBottom = () => {
    const [ subCategories, setSubCategories ] = useState([]);

    useEffect(() => {
        // Get subcategories
        axios.get(`${process.env.API_URL}/subcategories`).then((res) => {
            setSubCategories(res.data)
        }).catch((e) => {
            console.log(e);
        });
    }, []);

  return (
    <div id="header-bottom">
        <div className="container" id="header-bottom-container">
            <div className="right">
                <HeaderBottomLink href="/category/1" categoryId={1} title="ירקות" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/2" categoryId={2} title="פירות" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/3" categoryId={3} title="מעדנייה" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/4" categoryId={4} title="ירק ופטריות" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/5" categoryId={5} title="מזווה" subCategories={subCategories}/>
            </div>

            <span id="header-bottom-center"></span>

            <div className="left">
                <HeaderBottomLink href="/category/6" categoryId={6} title="יבשים" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/7" title="מבצעים" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/6/?subcategory=תבלינים" title="תבלינים" subCategories={subCategories}/>
                <HeaderBottomLink href="/category/6/?subcategory=פיצוחים" title="פיצוחים" subCategories={subCategories}/>
            </div>
        </div>
    </div>
  )
}

export default HeaderBottom