import { Redirect, Route, useLocation } from 'react-router-dom'

import { useAppSelector } from '../hooks/redux-hooks'

const PrivateRoute = (props) => {
    const location = useLocation()
    const {
        roleAccess: { roleCommon, conferenceRole },
        ...rest
    } = props
    const { role: authRole, email } = useAppSelector((state) => state.auth)
    if (!email) return <Redirect to={{ pathname: '/login', state: location }} />

    if (roleCommon === 'admin') {
        if (authRole !== 'admin') return <Redirect to="/conferences" />
    }

    if (roleCommon === 'user') {
        if (authRole === 'admin') return <Redirect to="/admin" />
    }

    const modifiedLocation = {
        ...location,
        state: location.state ? { ...location.state, conferenceRole } : { conferenceRole },
    }

    return <Route {...rest} location={modifiedLocation} />
}

export default PrivateRoute
