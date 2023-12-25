import axios from 'axios'
import jwt_decode from 'jwt-decode'
import { useHistory } from 'react-router-dom'

import { REGISTER_ACCOUNT_URL } from '~/config'
import { login, logout } from '~/features/auth'
import { reset } from '~/features/conference'
import { resetTrackSteps } from '~/features/guidelines'
import { resetMessages } from '~/features/message'
import { reset as resetTrackForChair } from '~/features/track-for-chair'
import { useAppDispatch } from '~/hooks/redux-hooks'
import { get, post } from '~/utils/ApiCaller'
import LocalStorageUtils from '~/utils/LocalStorageUtils'

const useAuth = () => {
    const dispatch = useAppDispatch()
    const history = useHistory()

    const confirmEmail = (accountId) => get({ endpoint: `/accounts/confirmEmail/${accountId}` })
    const register = (account) =>
        axios({ url: `${REGISTER_ACCOUNT_URL}/api/account/register`, data: account, method: 'POST' })

    const updateUserInfo = (account) => post({ endpoint: '/accounts/update-user-infomation', body: account })

    const loginHandler = (info) => {
        return post({
            endpoint: '/account/login',
            body: info,
        })
    }

    const logoutHandler = () => {
        LocalStorageUtils.deleteUser()
        LocalStorageUtils.deleteRole()
        dispatch(reset())
        dispatch(resetTrackSteps())
        dispatch(resetTrackForChair())
        dispatch(resetMessages())
        dispatch(logout())
        history.push('/login')
    }

    const autoLoginHandler = () => {
        const token = LocalStorageUtils.getToken()
        const user = LocalStorageUtils.getUser()

        if (user && typeof user === 'object') {
            if (user?.exp && user?.exp * 1000 > Date.now()) {
                const {
                    country,
                    email,
                    exp,
                    family_name,
                    given_name,
                    middle_name,
                    nameid,
                    organization,
                    role,
                    name_prefix: namePrefix,
                } = jwt_decode(token)
                dispatch(
                    login({
                        country,
                        email,
                        exp,
                        lastName: family_name,
                        firstName: given_name,
                        middleName: middle_name,
                        userId: nameid,
                        organization,
                        role,
                        token,
                        namePrefix,
                    })
                )
            } else {
                dispatch(logout())
            }
        } else {
            dispatch(logout())
        }
    }

    return { loginHandler, logoutHandler, autoLoginHandler, confirmEmail, register, updateUserInfo }
}

export default useAuth
