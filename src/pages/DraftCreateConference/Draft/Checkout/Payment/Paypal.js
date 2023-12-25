import { Fragment, forwardRef, useEffect, useRef, useState } from 'react'

import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'

import { Skeleton } from '@mui/material'

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { useSnackbar } from '~/HOCs/SnackbarContext'
import useOrder from '~/api/common/order'
import { PAY_PAL } from '~/config'

const currency = 'USD'
const Paypal = forwardRef(({ orderData, checkoutDetail, handleNext }, ref) => {
    const { conferenceId } = useParams()
    const [loading, setLoading] = useState(true)
    // const [error, setError] = useState(null)

    const showSnackbar = useSnackbar()
    const { createOrder } = useOrder()

    const amount = useRef(orderData?.total)

    const description = useRef('Registration Submission')

    useEffect(() => {
        axios({
            url: `https://api.apilayer.com/fixer/convert?to=USD&from=VND&amount=${orderData.total}`,
            method: 'GET',
            headers: {
                apikey: 'xR0XRHHMKT8s7pvCXCaSJyQ1PYPqG5pd',
            },
        })
            .then((response) => {
                amount.current = parseFloat(response.data.result).toFixed(2)
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Can not get price, please try again later',
                })
            })
            .finally(() => {
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [orderData.total])

    const history = useHistory()

    function handleApprove() {
        const info = {
            registration: checkoutDetail.registration,
            order: checkoutDetail.order,
            totalWholeAmount: orderData.total,
            status: 'Completed',
        }

        createOrder(info)
            .then(() => {
                ref.current = true
                // history.push(`/conferences/${conferenceId}/checkout/${checkoutDetail.order.id}/payment-success`)
                showSnackbar({
                    severity: 'success',
                    children: 'Payment Successfully.',
                })
                handleNext()
            })
            .catch(() => {
                showSnackbar({
                    severity: 'error',
                    children: 'Something went wrong, please contact Paypal for the refund.',
                })
            })
            .finally(() => {})
    }

    function handleError() {
        history.push({
            pathname: `/conferences/${conferenceId}/checkout/payment-fail`,
            state: { orderData: checkoutDetail.order.id },
        })
    }

    return (
        <Fragment>
            {loading ? (
                <Fragment>
                    <Skeleton variant="rounded" height={55} />
                    <Skeleton variant="rounded" height={55} sx={{ mt: 2 }} />
                </Fragment>
            ) : (
                <PayPalScriptProvider
                    options={{
                        'client-id': PAY_PAL,
                    }}
                >
                    <PayPalButtons
                        style={{
                            color: 'gold',
                            tagline: false,
                            shape: 'rect',
                        }}
                        onClick={() => {}}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        description: description.current,
                                        amount: {
                                            currency_code: currency,
                                            value: amount.current,
                                        },
                                    },
                                ],
                                application_context: {
                                    shipping_preference: 'NO_SHIPPING',
                                },
                            })
                        }}
                        onApprove={async (data, actions) => {
                            const order = await actions.order.capture()
                            handleApprove(order)
                        }}
                        onCancel={() => {}}
                        onError={() => {
                            // setError(error)
                            handleError()
                        }}
                    />
                </PayPalScriptProvider>
            )}
        </Fragment>
    )
})

export default Paypal
