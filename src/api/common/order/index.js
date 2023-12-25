import { get, post } from '~/utils/ApiCaller'

const useOrder = () => {
    const getOrder = (orderId, signal) =>
        get({
            endpoint: `/orders/${orderId}`,
            signal,
        })

    const createOrder = (info) =>
        post({
            endpoint: '/payments',
            body: info,
        })

    const uploadProof = (paymentId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/payments/upload-payment-proof-file/${paymentId}`,
            body: files,
        })

    return { getOrder, createOrder, uploadProof }
}

export default useOrder
