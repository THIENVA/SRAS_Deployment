import { Fragment, useRef } from 'react'

import { Redirect, useParams } from 'react-router-dom'

import { ArrowCircleLeft } from '@mui/icons-material'
import { Box, Button, Typography } from '@mui/material'

import OrderDetails from './OrderDetails'
import Payment from './Payment'

import { AppStyles } from '~/constants/colors'

const Checkout = ({ order, handleBack, handleNext }) => {
    const { conferenceId } = useParams()
    // const [loading, setLoading] = useState(false)
    const isSuccess = useRef(false)

    if (!order) return <Redirect to={`/conferences/${conferenceId}/submission/author`} />

    return (
        <Box maxWidth={'lg'} sx={{ m: '0 auto', mt: 1 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Button
                    variant="text"
                    sx={{ textTransform: 'none', height: 36 }}
                    onClick={handleBack}
                    startIcon={<ArrowCircleLeft />}
                >
                    Go back
                </Button>
                <Typography
                    textAlign="center"
                    sx={{ mb: 2, fontSize: 36, fontWeight: 600, color: AppStyles.colors['#333333'] }}
                >
                    Checkout
                </Typography>
                <Box></Box>
            </Box>
            <Fragment>
                <OrderDetails orderData={order.orderDetails} />
                <Payment
                    handleNext={handleNext}
                    orderData={order.orderDetails}
                    checkoutDetail={order}
                    ref={isSuccess}
                />
            </Fragment>
        </Box>
    )
}

export default Checkout
