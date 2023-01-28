import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductsList from '../components/Admin/ProductsList';
import NewProduct from '../components/Admin/NewProduct';
import OrdersList from '../components/Admin/OrdersList';
import Discounts from '../components/Admin/Discounts';
import Gifts from '../components/Admin/Gifts';
import Cities from '../components/Admin/Cities';
import MainSlider from '../components/Admin/MainSlider';
import CategoriesList from '../components/Admin/CategoriesList';

const Admin = () => {
    const [ tab, setTab ] = useState('categories');
    const [ showNewProductForm, setShowNewProductForm ] = useState(false);

    return ( <>
        <Head>
            <link rel="stylesheet" href="/admin/admin.css" />
        </Head>

        <div className="container">
            <div>
                <div className="tab-triggers">
                    <div className={ `tab-trigger ${tab == 'products' ? 'active' : ''}` } onClick={ () => setTab('products') }>מוצרים</div>
                    <div className={ `tab-trigger ${tab == 'categories' ? 'active' : ''}` } onClick={ () => setTab('categories') }>קטגוריות</div>
                    <div className={ `tab-trigger ${tab == 'orders' ? 'active' : ''}` } onClick={ () => setTab('orders') }>הזמנות</div>
                    <div className={ `tab-trigger ${tab == 'new-product' ? 'active' : ''}` } onClick={ () => setTab('new-product') }>מוצר חדש</div>
                    <div className={ `tab-trigger ${tab == 'discounts' ? 'active' : ''}` } onClick={ () => setTab('discounts') }>מבצעים</div>
                    <div className={ `tab-trigger ${tab == 'gifts' ? 'active' : ''}` } onClick={ () => setTab('gifts') }>מתנות</div>
                    <div className={ `tab-trigger ${tab == 'cities' ? 'active' : ''}` } onClick={ () => setTab('cities') }>ערים</div>
                    <div className={ `tab-trigger ${tab == 'slider' ? 'active' : ''}` } onClick={ () => setTab('slider') }>סליידר ראשי</div>
                </div>

                <div id="tabs">
                    <div className={ `tab active`}>
                        { tab == 'products' && <ProductsList tab={ tab }/> }
                        { tab == 'categories' && <CategoriesList tab={ tab }/> }
                        { tab == 'orders' && <OrdersList tab={ tab }/> }
                        { tab == 'new-product' && <NewProduct tab={ tab }/> }
                        { tab == 'discounts' && <Discounts tab={ tab }/> }
                        { tab == 'gifts' && <Gifts tab={ tab }/> }
                        { tab == 'cities' && <Cities tab={ tab }/> }
                        { tab == 'slider' && <MainSlider tab={ tab }/> }
                    </div>
                </div>
            </div>
        </div>


    </> );
}
 
export default Admin;