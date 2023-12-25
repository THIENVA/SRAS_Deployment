import { useState } from 'react'

import { Error } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { AppStyles } from '~/constants/colors'
import ConferenceDetail from '~/pages/ConferenceDetail'
import Loading from '~/pages/Loading'

const PaymentFail = () => {
    const history = useHistory()
    const { conferenceId } = useParams()
    const [loading, setLoading] = useState(false)

    return (
        <ConferenceDetail>
            {loading ? (
                <Loading />
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    flexDirection="column"
                    maxWidth={600}
                    m="0 auto"
                    sx={{
                        mt: 7,
                        px: 4,
                        pt: 2,
                        pb: 6,
                        boxShadow: 'rgba(50, 50, 105, 0.15) 0px 2px 5px 0px, rgba(0, 0, 0, 0.05) 0px 1px 1px 0px',
                    }}
                >
                    <Box mb={1} display="flex" justifyContent="center">
                        <Box display="flex" alignItems="center">
                            <Error color="error" sx={{ fontSize: 44, color: AppStyles.colors['#d55b69'] }} />
                            <Typography ml={2} sx={{ color: AppStyles.colors['#d55b69'], fontSize: 40 }}>
                                Payment Failed!
                            </Typography>
                        </Box>
                    </Box>
                    <Box textAlign="center" mb={4}>
                        <Typography mb={1} sx={{ fontWeight: 600, fontSize: 20 }}>
                            Your payment was not successfully processed
                        </Typography>
                        <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                            Please try again later
                        </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" justifyContent="center" mt={1}>
                        <Button
                            sx={{
                                ml: 1,
                                minWidth: 100,
                                height: 36,
                                textTransform: 'none',
                                border: '1px solid #0077CC',
                                backgroundImage: 'linear-gradient(to bottom, #007EA3, #0048a3)',
                                borderRadius: 1,
                                color: AppStyles.colors['#FFFFFF'],
                                fontWeight: 500,
                                px: 1,
                                ':hover': {
                                    backgroundColor: '#0048a3',
                                    backgroundImage: 'linear-gradient(to bottom, #1482D0, #0048a3)',
                                    borderColor: '#1482D0',
                                    textDecoration: 'none',
                                },
                                ':active': {
                                    backgroundImage: 'linear-gradient(#3D94D9, #0067B9)',
                                    borderColor: '#006DBC',
                                    outline: 'none',
                                },
                                ':focus': {
                                    boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                                    outline: 'none',
                                },
                                ':disabled': {
                                    color: AppStyles.colors['#EFEFEF'],
                                    boxShadow: 'rgba(131, 192, 253, 0.5) 0 0 0 3px',
                                    outline: 'none',
                                },
                            }}
                            onClick={() => history.push(`/conferences/${conferenceId}/submission/author`)}
                        >
                            Go Back
                        </Button>
                    </Box>
                </Box>
            )}
        </ConferenceDetail>
    )
}

export default PaymentFail
