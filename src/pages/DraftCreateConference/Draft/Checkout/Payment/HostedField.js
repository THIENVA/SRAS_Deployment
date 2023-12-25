import {
    PayPalHostedField,
    PayPalHostedFieldsProvider,
    PayPalScriptProvider,
    usePayPalHostedFields,
} from '@paypal/react-paypal-js'
import { PAY_PAL } from '~/config'

const SubmitPayment = () => {
    // Here declare the variable containing the hostedField instance
    const hostedFields = usePayPalHostedFields()

    const submitHandler = () => {
        if (typeof hostedFields.submit !== 'function') return // validate that `submit()` exists before using it
        hostedFields
            .submit({
                // The full name as shown in the card and billing address
                cardholderName: 'John Wick',
            })
            .then(() => {
                fetch('/your-server-side-integration-endpoint/capture-payment-info')
                    .then((response) => response.json())
                    .then(() => {
                        // Inside the data you can find all the information related to the payment
                    })
                    .catch(() => {
                        // Handle any error
                    })
            })
    }

    return <button onClick={submitHandler}>Pay</button>
}

export default function HostedField() {
    return (
        <PayPalScriptProvider
            options={{
                clientId: PAY_PAL,
                dataClientToken: PAY_PAL,
            }}
        >
            <PayPalHostedFieldsProvider
                createOrder={() => {
                    // Here define the call to create and order
                    return fetch('/your-server-side-integration-endpoint/orders')
                        .then((response) => response.json())
                        .then((order) => order.id)
                        .catch(() => {
                            // Handle any error
                        })
                }}
            >
                <PayPalHostedField id="card-number" hostedFieldType="number" options={{ selector: '#card-number' }} />
                <PayPalHostedField id="cvv" hostedFieldType="cvv" options={{ selector: '#cvv' }} />
                <PayPalHostedField
                    id="expiration-date"
                    hostedFieldType="expirationDate"
                    options={{
                        selector: '#expiration-date',
                        placeholder: 'MM/YY',
                    }}
                />
                <SubmitPayment />
            </PayPalHostedFieldsProvider>
        </PayPalScriptProvider>
    )
}
