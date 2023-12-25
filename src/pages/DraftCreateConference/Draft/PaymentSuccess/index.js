import { useEffect, useState } from 'react'

import { CheckCircle } from '@mui/icons-material'
import { Box, Button, Divider, Typography } from '@mui/material'

import useOrder from '~/api/common/order'
import { ScreenSize } from '~/constants/Sizes'
import { AppStyles } from '~/constants/colors'
import Loading from '~/pages/Loading'

const PaymentSuccess = ({ handleNext, order }) => {
    // const checkoutDetail = props.location.state
    const [orderData, setOrderData] = useState({})
    const [loading, setLoading] = useState(true)
    const { getOrder } = useOrder()
    useEffect(() => {
        const controller = new AbortController()

        getOrder(order.order.id, controller.signal)
            .then((response) => {
                const data = response.data
                // if (data.status !== 'Completed') {
                //     history.push(`/conferences/${conferenceId}/submission/author`)
                // }
                setOrderData(data)
            })
            .catch(() => {
                // history.push(`/conferences/${conferenceId}/submission/author`)
            })
            .finally(() => {
                setLoading(false)
            })

        return () => {
            controller.abort()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return loading ? (
        <Loading />
    ) : (
        <Box width={ScreenSize.ScreenWidth} m="0 auto">
            <Box mb={1} display="flex" justifyContent="center">
                <Box display="flex" alignItems="center">
                    <CheckCircle sx={{ fontSize: 44, color: AppStyles.colors['#5cb85c'] }} />
                    <Typography ml={2} sx={{ color: AppStyles.colors['#5cb85c'], fontSize: 40 }}>
                        Payment Successful !
                    </Typography>
                </Box>
            </Box>
            <Box textAlign="center" mb={2}>
                <Typography mb={1} sx={{ fontWeight: 600, fontSize: 20 }}>
                    Thank you! Your payment of Registration has been received.
                </Typography>
                {/* <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                    Order ID: {order.order.orderId}
                </Typography> */}
            </Box>
            <Box
                maxWidth={400}
                m="0 auto"
                sx={{
                    px: 4,
                    pb: 4,
                    pt: 2,
                    backgroundColor: AppStyles.colors['#FBFBFB'],
                    boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                }}
            >
                <Typography
                    textAlign="center"
                    sx={{ fontSize: 20, fontWeight: 600, color: AppStyles.colors['#333333'] }}
                >
                    Payment Details
                </Typography>
                <Box display="flex" justifyContent="center">
                    <Divider
                        sx={{
                            width: '100%',
                            height: 2,
                            mt: 1,
                            backgroundColor: AppStyles.colors['#E6EDFF'],
                            opacity: 0.5,
                        }}
                    />
                </Box>
                <Box sx={{ minHeight: 280 }}>
                    {orderData?.details?.map((value, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 1,
                            }}
                        >
                            <Box display="flex" justifyContent="space-between" mt={1}>
                                <Typography sx={{ fontSize: 18, fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                                    {value.chargeType}
                                </Typography>

                                <Typography sx={{ fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                                    {parseFloat(value.price ? value.price : 0)
                                        .toLocaleString()
                                        .replace(/,/g, '.')}{' '}
                                    VND
                                </Typography>
                            </Box>
                            <Box display="flex" alignItems="flex-end" justifyContent="space-between">
                                <Box>
                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 400,
                                            color: AppStyles.colors['#333333'],
                                        }}
                                    >
                                        {value.option}
                                    </Typography>
                                    <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
                                        Quantity: {value.amount}
                                    </Typography>
                                </Box>
                                <Box display="flex" alignItems="center">
                                    <Typography sx={{ fontSize: 16 }}>Sub Total: </Typography>
                                    <Typography
                                        sx={{
                                            ml: 1,
                                            fontSize: 18,
                                            fontWeight: 600,
                                            color: AppStyles.colors['#333333'],
                                        }}
                                    >
                                        {parseFloat(value.subtotal ? value.subtotal : 0)
                                            .toLocaleString()
                                            .replace(/,/g, '.')}{' '}
                                        VND
                                    </Typography>
                                </Box>
                            </Box>
                            <Box display="flex" justifyContent="center">
                                <Divider
                                    sx={{
                                        width: '100%',
                                        height: 1,
                                        mt: 2,
                                        backgroundColor: AppStyles.colors['#E6EDFF'],
                                        opacity: 0.5,
                                    }}
                                />
                            </Box>
                        </Box>
                    ))}
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                    <Typography sx={{ fontSize: 20, fontWeight: 'bolder', color: AppStyles.colors['#333333'] }}>
                        Order Total
                    </Typography>
                    <Typography sx={{ fontSize: 22, fontWeight: 'bolder', color: AppStyles.colors['#333333'] }}>
                        {parseFloat(orderData.total ? orderData.total : 0)
                            .toLocaleString()
                            .replace(/,/g, '.')}{' '}
                        VND
                    </Typography>
                </Box>
            </Box>

            <Box display="flex" alignItems="center" justifyContent="center" mt={2}>
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
                    onClick={handleNext}
                >
                    OK
                </Button>
            </Box>
        </Box>
    )
}

export default PaymentSuccess
