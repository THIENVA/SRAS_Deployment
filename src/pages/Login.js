import React, { useState } from 'react'

import jwt_decode from 'jwt-decode'
import { Link, useHistory } from 'react-router-dom'

import { LoadingButton } from '@mui/lab'
import { Avatar, Box, Divider, TextField, Typography } from '@mui/material'
import Header from '~/components/Common/Header'

import ForgotPassword from './ForgotPassword'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useAuth from '~/api/common/auth'
import logo from '~/assets/images/Logo.png'
import { AppStyles } from '~/constants/colors'
import { login } from '~/features/auth'
import { useAppDispatch } from '~/hooks/redux-hooks'
import LocalStorageUtils from '~/utils/LocalStorageUtils'

const Login = () => {
    const [account, setAccount] = useState({ email: '', password: '' })
    const history = useHistory()
    const showSnackbar = useSnackbar()
    const { loginHandler } = useAuth()
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const inputChangeHandler = (event) => {
        const { name, value } = event.target
        setAccount((prev) => ({ ...prev, [name]: value }))
        setError(false)
    }

    const handleLogin = (event) => {
        event.preventDefault()
        setLoading(true)
        loginHandler({ userNameOrEmailAddress: account.email, password: account.password })
            .then((res) => {
                const token = res.data.token
                if (token) {
                    LocalStorageUtils.setUser(token)
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
                    if (role === 'admin') {
                        history.push('/admin')
                    } else {
                        history.push('/conferences')
                    }
                } else {
                    setError(true)
                }
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong. Please try again later',
                })
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const handleOpenModal = () => {
        setOpenModal(true)
    }

    const handleCloseModal = () => {
        setOpenModal(false)
    }

    return (
        <React.Fragment>
            <Header />
            {openModal && <ForgotPassword open={openModal} handleClose={handleCloseModal} />}
            <Box display="flex" mt={10} justifyContent="center">
                <Box
                    maxWidth={400}
                    height={400}
                    width="1"
                    sx={{ border: '0.5px solid #cfcfcf', borderRadius: 3, overflow: 'hidden' }}
                >
                    <Box
                        py={2}
                        sx={{
                            borderBottom: '0.5px solid #333',
                            px: 4,
                            backgroundColor: (theme) => theme.palette.primary.main,
                        }}
                        justifyContent="center"
                        display="flex"
                    >
                        <Avatar sx={{ height: 40, width: 114 }} src={logo} alt="logo" variant="square" />
                    </Box>
                    <Box mt={5}>
                        <Box px={3} component="form" onSubmit={handleLogin}>
                            <Box mb={2}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Email <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    onChange={inputChangeHandler}
                                    value={account.email}
                                    name="email"
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Box>
                            <Box mb={1}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    Password <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    inputProps={{ type: 'password' }}
                                    onChange={inputChangeHandler}
                                    value={account.password}
                                    name="password"
                                    fullWidth
                                    size="small"
                                    required
                                />
                            </Box>
                            {error && (
                                <Typography my={1} align="center" sx={{ color: 'red' }} variant="body1">
                                    Invalid email or password
                                </Typography>
                            )}
                            <LoadingButton sx={{ mt: 1 }} loading={loading} type="submit" fullWidth variant="contained">
                                LOGIN
                            </LoadingButton>
                            <Box mt={3}>
                                <Box display="flex" alignItems="center">
                                    <Typography
                                        variant="body2"
                                        sx={{ color: AppStyles.colors['#004DFF'], cursor: 'pointer' }}
                                        onClick={handleOpenModal}
                                    >
                                        Forgot your password?
                                    </Typography>
                                    <Divider
                                        orientation="vertical"
                                        sx={{ mx: 2, backgroundColor: AppStyles.colors['#333333'] }}
                                        flexItem
                                    />
                                    <Box display="flex" alignItems="baseline">
                                        <Typography variant="body2"> New to SRASS? </Typography>
                                        <Box
                                            component={Link}
                                            to="/register"
                                            sx={{ ml: 1, color: AppStyles.colors['#004DFF'] }}
                                        >
                                            Register
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default Login
