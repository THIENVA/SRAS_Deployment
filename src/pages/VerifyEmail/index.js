import React, { useEffect, useState } from 'react'

import queryString from 'query-string'
import { useHistory, useLocation } from 'react-router-dom'

import { Box, Typography } from '@mui/material'
import Header from '~/components/Common/Header'

import Loading from '../Loading'

import { useSnackbar } from '~/HOCs/SnackbarContext'
import useAuth from '~/api/common/auth'

const Verify = () => {
    const [loading, setIsLoading] = useState(true)
    const [message, setMessage] = useState({ status: null, message: '' })
    const [countDown, setCountDown] = useState(5)
    const history = useHistory()
    const { search } = useLocation()
    const { account } = queryString.parse(search)
    const showSnackbar = useSnackbar()
    const { confirmEmail } = useAuth()

    useEffect(() => {
        let timer = -1
        const getAccount = account ? account : null

        confirmEmail(getAccount)
            .then(() => {
                setMessage({ status: 200, message: 'Thank you for your registration.' })
                // showSnackbar({
                //     severity: 'success',
                //     children: 'Email Verified successfully. Thank you for your registration.',
                // })
            })
            .catch((error) => {
                if (error.response.status === 403) {
                    setMessage({ status: 403, message: 'This user has already been confirmed.' })
                    showSnackbar({
                        severity: 'error',
                        children: 'This user has already been confirmed.',
                    })
                } else if (error.response.status === 400) {
                    setMessage({ status: 400, message: 'This user has not been registered into system yet.' })
                    showSnackbar({
                        severity: 'error',
                        children: 'This user has not been registered into system yet.',
                    })
                }
            })
            .finally(() => {
                setIsLoading(false)
                timer = setInterval(() => {
                    setCountDown((prevCount) => prevCount - 1)
                }, 1000)
            })
        return () => clearInterval(timer)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (countDown === 0) {
            history.push('/login')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [countDown])

    return (
        <React.Fragment>
            <Header />
            {loading ? (
                <Loading />
            ) : (
                <Box
                    display="flex"
                    height="80vh"
                    alignItems="center"
                    width="1"
                    justifyContent="center"
                    flexDirection="column"
                >
                    {message.status && (
                        <Box mb={2}>
                            {(() => {
                                switch (message.status) {
                                    case 400:
                                        return (
                                            <Typography fontWeight={500} color="error" variant="h5">
                                                {message.message}
                                            </Typography>
                                        )
                                    case 403:
                                        return (
                                            <Typography fontWeight={500} color="error" variant="h5">
                                                {message.message}
                                            </Typography>
                                        )
                                    case 200:
                                        return (
                                            <Typography fontWeight={500} color="success" variant="h5">
                                                {message.message}
                                            </Typography>
                                        )
                                }
                            })()}
                        </Box>
                    )}
                    <Typography variant="h4" fontWeight={500}>
                        The page will automatically redirect you login page after {countDown}
                    </Typography>
                </Box>
            )}
        </React.Fragment>
    )
}

export default Verify
