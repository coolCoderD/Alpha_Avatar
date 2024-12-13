// src/components/layout/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';




const Layout = ({ children }) => (
  <>
 
    <Header />
    <div className=''>
    <main>{children}</main>
    </div>
    {/* <Footer /> */}
    

  </>
);

export default Layout;
