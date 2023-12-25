import React from 'react'

import Header from '~/components/Admin/Header'

const AdminPage = ({ children }) => {
    return (
        <React.Fragment>
            <Header />
            {children}
        </React.Fragment>
    )
}

export default AdminPage
