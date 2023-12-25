import { Redirect } from 'react-router-dom'

import { useAppSelector } from '~/hooks/redux-hooks'

const Home = () => {
    const { email } = useAppSelector((state) => state.auth)

    return email ? <Redirect to="/conferences" /> : <Redirect to="/login" />
}

export default Home
