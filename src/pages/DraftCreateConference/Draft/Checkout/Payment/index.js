import { forwardRef } from 'react'

import { Box, Divider, Grid, Typography } from '@mui/material'

import Paypal from './Paypal'

import { AppStyles } from '~/constants/colors'

const Payment = forwardRef(({ orderData, checkoutDetail, handleNext }, ref) => {
    return (
        <Box sx={{ pt: 2 }}>
            <Typography sx={{ mt: 2, fontSize: 24, fontWeight: 700, color: AppStyles.colors['#333333'] }}>
                Payment Method
            </Typography>
            <Divider
                sx={{
                    mt: 2,
                    width: '100%',
                }}
            ></Divider>
            <Grid container columnSpacing={10} mt={3}>
                <Grid item md={7} lg={7}>
                    <Paypal orderData={orderData} handleNext={handleNext} checkoutDetail={checkoutDetail} ref={ref} />
                </Grid>
                <Grid item md={5} lg={5}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ fontSize: 20, fontWeight: 'bolder', color: AppStyles.colors['#333333'] }}>
                            Order Total
                        </Typography>
                        <Typography sx={{ fontSize: 22, fontWeight: 'bolder', color: AppStyles.colors['#333333'] }}>
                            {/* <Typography component="span" sx={{ fontSize: 16, fontWeight: 'bold' }}>
                                USD
                            </Typography> */}
                            {'  '}
                            {/* {parseFloat(orderData.total).toFixed(0)} VND */}
                            {parseFloat(orderData.total ? orderData.total : 0)
                                .toLocaleString()
                                .replace(/,/g, '.')}{' '}
                            VND
                        </Typography>
                    </Box>
                    <Box display="flex" justifyContent="center">
                        <Divider
                            sx={{
                                width: '100%',
                                height: 2,
                                mt: 2,
                                backgroundColor: AppStyles.colors['#E6EDFF'],
                                opacity: 0.5,
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
})

export default Payment
