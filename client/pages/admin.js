import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import ProductsList from '../components/Admin/ProductsList';
import NewProduct from '../components/Admin/NewProduct';
import OrdersList from '../components/Admin/OrdersList';
import Discounts from '../components/Admin/Discounts';
import Gifts from '../components/Admin/Gifts';
import Cities from '../components/Admin/Cities';

const Admin = () => {
    const [ tab, setTab ] = useState('products');
    const [ showNewProductForm, setShowNewProductForm ] = useState(false);

    return ( <>
        <Head>
            <link rel="stylesheet" href="/admin/admin.css" />
        </Head>

        <div className="container">
            <div>
                <div className="tab-triggers">
                    <div className={ `tab-trigger ${tab == 'products' ? 'active' : ''}` } onClick={ () => setTab('products') }>מוצרים</div>
                    <div className={ `tab-trigger ${tab == 'orders' ? 'active' : ''}` } onClick={ () => setTab('orders') }>הזמנות</div>
                    <div className={ `tab-trigger ${tab == 'new-product' ? 'active' : ''}` } onClick={ () => setTab('new-product') }>מוצר חדש</div>
                    <div className={ `tab-trigger ${tab == 'discounts' ? 'active' : ''}` } onClick={ () => setTab('discounts') }>מבצעים</div>
                    <div className={ `tab-trigger ${tab == 'gifts' ? 'active' : ''}` } onClick={ () => setTab('gifts') }>מתנות</div>
                    <div className={ `tab-trigger ${tab == 'cities' ? 'active' : ''}` } onClick={ () => setTab('cities') }>ערים</div>
                </div>

                <div id="tabs">
                    <div className={ `tab ${tab == 'products' ? 'active' : ''}`}>
                        <ProductsList tab={ tab }/>
                    </div>

                    <div className={ `tab ${tab == 'orders' ? 'active' : ''}`}>
                        <OrdersList tab={ tab }/>
                    </div>

                    <div className={ `tab ${tab == 'new-product' ? 'active' : ''}`}>
                        <NewProduct tab={ tab }/>
                    </div>

                    <div className={ `tab ${tab == 'discounts' ? 'active' : ''}`}>
                        <Discounts tab={ tab }/>
                    </div>

                    <div className={ `tab ${tab == 'gifts' ? 'active' : ''}`}>
                        <Gifts tab={ tab }/>
                    </div>

                    <div className={ `tab ${tab == 'cities' ? 'active' : ''}`}>
                        <Cities tab={ tab }/>
                    </div>
                </div>
            </div>
        </div>


    </> );
}
 
export default Admin;