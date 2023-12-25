import React from 'react'

import { Redirect, useHistory, useLocation } from 'react-router-dom'

import { ArrowForward, Email } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'
import Header from '~/components/Common/Header'

const ConfirmEmail = () => {
    const history = useHistory()
    const { state } = useLocation()

    if (!state) return <Redirect to="/not-found" />

    return (
        <React.Fragment>
            <Header />
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                maxWidth={600}
                m="0 auto"
                sx={{
                    mt: 6,
                    px: 4,
                    pt: 2,
                    pb: 6,
                    boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
                }}
            >
                <Box display="flex" justifyContent="center" mb={2}>
                    <Box sx={{ backgroundColor: '#edf5fd', borderRadius: 10, p: 1 }}>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{ backgroundColor: '#dcebfb', borderRadius: 10, p: 2 }}
                        >
                            <Email color="primary" sx={{ fontSize: 28, lineHeight: 0 }} />
                        </Box>
                    </Box>
                </Box>
                <Box maxWidth={500} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                    <Typography sx={{ color: '#37414f', fontWeight: 'bold', fontSize: 30 }}>
                        Please verify your email
                    </Typography>
                    <Typography sx={{ mt: 1 }}>You&apos;re almost there! We sent an email to</Typography>
                    <Typography sx={{ color: '#37414f', fontWeight: 'bold', fontSize: 18 }}>{state.email}</Typography>
                    <Typography textAlign="center" sx={{ mt: 2 }}>
                        Just click on the link in that email to complete your signup. If you don&apos;t see it, you may
                        need to{' '}
                        <Typography component="span" sx={{ color: '#37414f', fontWeight: 'bold' }}>
                            check your spam
                        </Typography>{' '}
                        folder.
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ textTransform: 'none', mt: 4, fontWeight: 'bold' }}
                        endIcon={<ArrowForward />}
                        onClick={() => history.push('/login')}
                    >
                        Return to Login
                    </Button>
                </Box>
            </Box>
        </React.Fragment>
    )
}

export default ConfirmEmail
