import { get, post, put } from '~/utils/ApiCaller'

const useReviewer = () => {
    const getReviewerFacts = (params, signal) =>
        get({
            endpoint: '/reviewer-management/reviewing-facts',
            params: params,
            signal,
        })

    const getHasTrackAccount = (params, signal) =>
        get({
            endpoint: '/reviewer-management/has-account-in-track',
            params: params,
            signal,
        })

    const getEmail = (body) =>
        post({
            endpoint: '/reviewer-management/get-email-send-to-invite-reviewer',
            body: body,
        })

    const sendEmail = (body) =>
        post({
            endpoint: '/reviewer-management/send-mail-invite-reviewer',
            body: body,
        })

    const getHasCreateAccount = (params, signal) =>
        get({
            endpoint: '/reviewer-management/has-account-by-participant-id',
            params: params,
            signal,
        })

    const getHasInvite = (params, signal) =>
        get({
            endpoint: '/reviewer-management/check-invitation-status',
            params: params,
            signal,
        })

    const postConfirmInvite = (params) =>
        post({
            endpoint: '/reviewer-management/confirm-reviewer-invite',
            params: params,
        })

    const updateDomainConflict = (params) =>
        put({
            endpoint: '/account/update-domain-conflict-of-user',
            params: params,
        })

    const getManageInvite = (params, signal) =>
        get({
            endpoint: '/reviewer-management/get-invitation-clone-of-conference',
            params: params,
            signal,
        })

    return {
        getReviewerFacts,
        getHasTrackAccount,
        getEmail,
        sendEmail,
        getHasCreateAccount,
        getHasInvite,
        postConfirmInvite,
        updateDomainConflict,
        getManageInvite,
    }
}

export { useReviewer }
