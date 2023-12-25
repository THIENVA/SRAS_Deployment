import { get, post, remove } from '~/utils/ApiCaller'

const useRegistration = () => {
    const getRegistrationSetting = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/registration-settings`, signal })

    const getRegistrationPapers = (conferenceId, accountId, signal) =>
        get({
            endpoint: `/conferences/${conferenceId}/registrable-papers`,
            params: {
                accountId,
            },
            signal,
        })

    const createRegistration = (userId, conferenceId, mainPaperOption, data) =>
        post({
            endpoint: `/accounts/${userId}/registrations`,
            params: {
                conferenceId,
                mainPaperOption,
            },
            body: data,
        })

    const createRegistrationSetting = (conferenceId, data, isZeroVNDPriceTable) =>
        post({
            endpoint: `/conferences/create-registration-setting`,
            params: {
                conferenceId: conferenceId,
                isZeroVNDPriceTable,
            },
            body: data,
        })

    const deleteRegistration = (id, orderId) =>
        remove({
            endpoint: `/registrations/${id}`,
            params: {
                orderId: orderId,
            },
        })

    return {
        getRegistrationSetting,
        getRegistrationPapers,
        createRegistration,
        createRegistrationSetting,
        deleteRegistration,
    }
}

export default useRegistration
