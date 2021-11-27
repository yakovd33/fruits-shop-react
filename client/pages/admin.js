import React, { useState, useEffect } from 'react';
import Head from 'next/Head';
import ProductsList from '../components/Admin/ProductsList';
import NewProduct from '../components/Admin/NewProduct';
import OrdersList from '../components/Admin/OrdersList';

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
                </div>

                <div id="tabs">
                    <div className={ `tab ${tab == 'products' ? 'active' : ''}`}>
                        <ProductsList/>
                    </div>

                    <div className={ `tab ${tab == 'orders' ? 'active' : ''}`}>
                        <OrdersList/>
                    </div>

                    <div className={ `tab ${tab == 'new-product' ? 'active' : ''}`}>
                        <NewProduct/>
                    </div>
                </div>
            </div>
        </div>


    </> );
}
 
export default Admin;