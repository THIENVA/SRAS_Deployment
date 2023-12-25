import { Box, Divider, Typography } from '@mui/material'
import ModalInfo from '~/components/ModalInfo'

import { AppStyles } from '~/constants/colors'

const OrderInfoModal = ({ open, handleClose, row }) => {
    return (
        <ModalInfo
            open={open}
            handleClose={handleClose}
            header={'Order Information'}
            headerStyle={{ fontSize: 24, fontWeight: 600, color: AppStyles.colors['#212529'] }}
            maxWidth="sm"
        >
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
                    {row.order?.details?.map((value, index) => (
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
                        {/* <Typography component="span" sx={{ fontSize: 16, fontWeight: 'bold' }}>
                            USD
                        </Typography> */}
                        {parseFloat(row.order?.total ? row.order?.total : 0)
                            .toLocaleString()
                            .replace(/,/g, '.')}{' '}
                        VND
                    </Typography>
                </Box>
            </Box>
        </ModalInfo>
    )
}

export default OrderInfoModal
