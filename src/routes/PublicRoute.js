import { Redirect, Route } from 'react-router-dom'

import { useAppSelector } from '../hooks/redux-hooks'

const PublicRoute = (props) => {
    const { email } = useAppSelector((state) => state.auth)
    if (!email) {
        return <Route {...props} />
    }

    return <Redirect to="/conferences" />
}

export default PublicRoute
