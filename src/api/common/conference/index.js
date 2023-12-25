import { get, patch, post, remove } from '~/utils/ApiCaller'

const useConference = () => {
    const createConference = (conferenceInfo) => post({ endpoint: '/conferences', body: conferenceInfo })
    const updateConference = (id, conferenceInfo) => post({ endpoint: `/conferences/${id}`, body: conferenceInfo })

    const deleteConference = (id) => remove({ endpoint: `/conferences/${id}` })

    const getConferences = (
        userId = null,
        signal,
        SkipCount,
        MaxResultCount,
        inclusionText = '',
        isCallingForPapers = null
    ) =>
        get({
            endpoint: '/conferences',
            params: {
                AccountId: userId,
                SkipCount,
                MaxResultCount,
                inclusionText,
                isCallingForPapers,
            },
            signal,
        })

    const getConferenceDetail = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/detail`, signal })

    const getDashboardSummaryAndPC = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/dashboard-summary-and-pc-aggregation`, signal })

    const getDashboardParticipation = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/dashboard-participation-aggregation`, signal })

    const getPhase = (conferenceId, trackId, signal) =>
        get({
            endpoint: `/conferences/${conferenceId}/tracks-with-current-and-next-phases`,
            params: { trackId: trackId },
            signal,
        })

    const getDetail = (conferenceId, signal) => get({ endpoint: `/conferences/${conferenceId}`, signal })

    const notifyChairEmail = (emails) => post({ endpoint: '/submissions/notify-assigning-to-chair', body: emails })

    const checkShortNameExisted = (shortName, signal) =>
        get({
            endpoint: `/conferences/is-conference-short-name-existing`,
            params: {
                shortName,
            },
            signal,
        })

    const updateWebLink = (conferenceId, newWebsiteLink) =>
        patch({
            endpoint: `/conferences/update-conference-website-link`,
            params: {
                conferenceId: conferenceId,
            },
            body: {
                newWebsiteLink: newWebsiteLink,
            },
        })

    const getConferenceStatus = (conferenceId, signal) =>
        get({
            endpoint: `/tracks/get-conference-status`,
            params: {
                conferenceId,
            },
            signal,
        })

    const updateReviewAbnormalitySetting = (conferenceId, settings) =>
        post({ endpoint: `/conferences/${conferenceId}/review-abnormality-detection-settings`, body: settings })

    const getReviewAbnormalitySetting = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/review-abnormality-detection-settings`, signal })

    const getConferenceInfo = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/alterable-info`, signal })

    return {
        createConference,
        getConferences,
        getConferenceDetail,
        getDashboardSummaryAndPC,
        getDashboardParticipation,
        notifyChairEmail,
        getPhase,
        getDetail,
        checkShortNameExisted,
        updateWebLink,
        getConferenceStatus,
        updateReviewAbnormalitySetting,
        getReviewAbnormalitySetting,
        getConferenceInfo,
        updateConference,
        deleteConference,
    }
}

export { useConference }
