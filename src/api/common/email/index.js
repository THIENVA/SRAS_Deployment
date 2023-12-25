import { get, post } from '~/utils/ApiCaller'

const useEmail = () => {
    const sendNotificationEmail = (data) =>
        post({
            endpoint: '/emails/send-list-mail-and-save-history',
            body: data,
        })

    const changeSubmissionStatus = (data) =>
        post({ endpoint: '/submissions/change-status-submission-after-send-mail', body: data })

    const getEmailHistory = (data, signal) =>
        get({ endpoint: '/emails/get-history-email-of-chair-or-track-chair', params: data, signal })

    const retryEmailAgain = (emailId) =>
        get({
            endpoint: '/emails/retry-email-sent-fall',
            params: {
                emailId,
            },
        })

    const retryAllEmailAgain = (conferenceId, trackId, accountId) =>
        get({
            endpoint: '/emails/retry-all-email-sent-fail',
            params: {
                conferenceId,
                trackId,
                accountId,
            },
        })

    const sendEmailRequestCameraReady = (conferenceId, trackId) =>
        get({
            endpoint: `/emails/send-mail-for-request-camera-ready`,
            params: {
                conferenceId,
                trackId,
            },
        })

    return {
        sendNotificationEmail,
        changeSubmissionStatus,
        getEmailHistory,
        retryEmailAgain,
        retryAllEmailAgain,
        sendEmailRequestCameraReady,
    }
}

export default useEmail
