import { get } from '~/utils/ApiCaller'

const useStatistic = () => {
    const getReviewerStatis = (conferenceId, signal) =>
        get({
            endpoint: '/statistic/get-reviewer-management-statistic',
            params: { conferenceId: conferenceId },
            signal,
        })

    const getSubjectAreaStatis = (conferenceId, signal) =>
        get({
            endpoint: '/statistic/get-number-of-subject-area-of-each-tracks',
            params: { conferenceId: conferenceId },
            signal,
        })

    const getUserStatis = (conferenceId, trackId, signal) =>
        get({
            endpoint: '/statistic/get-number-of-user-in-conference',
            params: { conferenceId: conferenceId, trackId: trackId },
            signal,
        })

    const getSubmissionStatis = (conferenceId, trackId, signal) =>
        get({
            endpoint: '/submissions/aggregation/statistics',
            params: { conferenceId: conferenceId, trackId: trackId },
            signal,
        })

    const getManuscriptStatis = (conferenceId, trackId, signal) =>
        get({
            endpoint: '/submissions/conference-manuscripts-aggregation/statistics',
            params: { conferenceId: conferenceId, trackId: trackId },
            signal,
        })

    return { getReviewerStatis, getSubjectAreaStatis, getUserStatis, getSubmissionStatis, getManuscriptStatis }
}

export { useStatistic }
