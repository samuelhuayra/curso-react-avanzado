import React from 'react';

const Layout = ({children}:any) => {
    return (<>
        <h1>Desde Layout</h1>
        {children}
    </>
    );
}
 
export default Layout;