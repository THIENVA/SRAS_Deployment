import { Fragment } from 'react'

import { Box, Divider, Grid, Typography } from '@mui/material'

import { AppStyles } from '~/constants/colors'
import { addLeadingZero } from '~/utils/commonFunction'

const OrderDetails = ({ orderData }) => {
    return (
        <Fragment>
            <Box
                sx={{
                    px: 4,
                    pb: 4,
                    pt: 2,
                    backgroundColor: AppStyles.colors['#FBFBFB'],
                    boxShadow: 'rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px',
                }}
            >
                <Typography sx={{ fontSize: 28, fontWeight: 700, color: AppStyles.colors['#333333'] }}>
                    Review your order
                </Typography>

                <Box
                    sx={{
                        p: 1,
                    }}
                >
                    <Grid container columnSpacing={10} mt={2} alignItems="center">
                        <Grid item md={5} lg={5}>
                            <Typography sx={{ fontSize: 18, fontWeight: 600, color: AppStyles.colors['#333333'] }}>
                                Product
                            </Typography>
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <Typography
                                sx={{ textAlign: 'right', fontWeight: 600, color: AppStyles.colors['#333333'] }}
                            >
                                Price
                            </Typography>
                        </Grid>
                        <Grid item md={2} lg={2}>
                            <Typography
                                sx={{
                                    textAlign: 'right',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#333333'],
                                }}
                            >
                                Quantity
                            </Typography>
                        </Grid>
                        <Grid item md={3} lg={3}>
                            <Typography
                                sx={{
                                    textAlign: 'right',
                                    fontSize: 16,
                                    fontWeight: 600,
                                    color: AppStyles.colors['#333333'],
                                }}
                            >
                                Sub Total
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box display="flex" justifyContent="center">
                        <Divider
                            sx={{
                                width: '100%',
                                height: 1,
                                mt: 1,
                                backgroundColor: AppStyles.colors['#E6EDFF'],
                                opacity: 0.5,
                            }}
                        />
                    </Box>
                </Box>
                <Box sx={{ minHeight: 140 }}>
                    {orderData?.details?.map((value, index) => (
                        <Box
                            key={index}
                            sx={{
                                p: 1,
                            }}
                        >
                            <Grid container columnSpacing={10} mt={1}>
                                <Grid item md={5} lg={5}>
                                    <Typography
                                        sx={{ fontSize: 18, fontWeight: 600, color: AppStyles.colors['#333333'] }}
                                    >
                                        {value.chargeType}
                                    </Typography>
                                    <Typography
                                        sx={{ fontSize: 14, fontWeight: 400, color: AppStyles.colors['#333333'] }}
                                    >
                                        {value.option}
                                    </Typography>
                                </Grid>
                                <Grid item md={2} lg={2}>
                                    <Typography
                                        sx={{ textAlign: 'right', fontSize: 18, color: AppStyles.colors['#333333'] }}
                                    >
                                        {/* {parseFloat(value.price).toFixed()} VND */}
                                        {parseFloat(value.price ? value.price : 0)
                                            .toLocaleString()
                                            .replace(/,/g, '.')}{' '}
                                        VND
                                    </Typography>
                                </Grid>
                                <Grid item md={2} lg={2}>
                                    <Typography
                                        sx={{ textAlign: 'right', fontSize: 18, color: AppStyles.colors['#333333'] }}
                                    >
                                        {addLeadingZero(value.amount ? value.amount : 0)}
                                    </Typography>
                                </Grid>
                                <Grid item md={3} lg={3}>
                                    <Typography
                                        sx={{ textAlign: 'right', fontSize: 18, color: AppStyles.colors['#333333'] }}
                                    >
                                        {/* {parseFloat(value.subtotal).toFixed(0)} VND */}
                                        {parseFloat(value.subtotal ? value.subtotal : 0)
                                            .toLocaleString()
                                            .replace(/,/g, '.')}{' '}
                                        VND
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    ))}
                </Box>
            </Box>
            <Box mt={1} mr={5} display="flex" justifyContent="flex-end" alignItems="center">
                <Typography sx={{ mr: 2, fontSize: 20, fontWeight: 'bolder', color: AppStyles.colors['#333333'] }}>
                    Order Total:
                </Typography>
                <Typography sx={{ fontSize: 22, fontWeight: 'bolder', color: AppStyles.colors['#333333'] }}>
                    {parseFloat(orderData.total ? orderData.total : 0)
                        .toLocaleString()
                        .replace(/,/g, '.')}{' '}
                    VND
                </Typography>
            </Box>
        </Fragment>
    )
}

export default OrderDetails
