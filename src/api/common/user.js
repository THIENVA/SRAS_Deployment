const { get, post } = require('~/utils/ApiCaller')

const useUser = () => {
    const getUserByEmail = (email) => get({ endpoint: `/accounts/by-email/${email ? email : -1}` })

    const getUserConference = (id, trackId, skipCount, maxResultCount, signal) =>
        get({
            endpoint: `/conferences/${id}/users`,
            params: {
                TrackId: trackId,
                SkipCount: skipCount,
                MaxResultCount: maxResultCount,
            },
            signal,
        })

    const getUserRole = (userId, conferenceId, trackId, signal) =>
        get({
            endpoint: '/conference-user-roles',
            params: {
                AccountId: userId,
                ConferenceId: conferenceId,
                trackId: trackId,
            },
            signal,
        })

    const createUserRole = (userRoles) => post({ endpoint: '/conference-user-roles', body: userRoles })

    const addReviewerQuota = (accountId, conferenceId, trackId, quota) =>
        post({
            endpoint: '/reviewer-quotas',
            body: {
                accountId: accountId,
                conferenceId: conferenceId,
                trackId: trackId,
                quota: quota,
            },
        })

    const getReviewerConflict = (accountId, conferenceId, submissionId, signal) =>
        get({
            endpoint: '/reviewer-conflicts',
            params: {
                AccountId: accountId,
                ConferenceId: conferenceId,
                SubmissionId: submissionId,
            },
            signal,
        })

    const editReviewerConflict = (accountId, conferenceId, submissionId, conflictCases) =>
        post({
            endpoint: '/reviewer-conflicts',
            body: {
                accountId: accountId,
                conferenceId: conferenceId,
                submissionId: submissionId,
                conflictCases: conflictCases,
            },
        })

    const editReviewerReviews = (reviewAssignmentId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: '/reviewer-reviews/review-files',
            params: {
                reviewAssignmentId: reviewAssignmentId,
            },
            body: files,
        })

    const editReviewTotalScoreCriteria = (reviewAssignmentId, data) =>
        post({
            endpoint: '/reviewer-reviews',
            params: {
                reviewAssignmentId: reviewAssignmentId,
            },
            body: data,
        })

    return {
        getUserByEmail,
        getUserConference,
        addReviewerQuota,
        getReviewerConflict,
        editReviewerConflict,
        getUserRole,
        createUserRole,
        editReviewerReviews,
        editReviewTotalScoreCriteria,
    }
}

export { useUser }
