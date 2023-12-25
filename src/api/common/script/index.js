import { get } from '~/utils/ApiCaller'

const useScript = () => {
    const usersScript = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-users-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const subjectAreaScript = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-subject-areas-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conferenceSubmission = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-submissions-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conference1stReviewAssign = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-1st-review-assignment-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conference1stReview = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-1st-review-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conference1stDecision = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-1st-decision-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conference1stRevisionSubmission = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-1st-revision-submission-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conference2ndReview = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-2nd-review-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conference2ndDecision = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-2nd-decision-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conferenceCameraReady = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-camera-ready-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conferenceRegistration = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-registration-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const conferencePresentation = (conferenceId, trackId) =>
        get({
            endpoint: '/demos/conference-presentation-allocation',
            params: {
                conferenceId,
                trackId,
            },
        })

    const scriptCreateTemplate = (conferenceId) =>
        get({
            endpoint: '/email-templates/create-demo-email-template',
            params: {
                conferenceId,
            },
        })

    const scriptCreateSubmissionQuestion = (conferenceId, trackId) =>
        get({
            endpoint: `/tracks/create-demo-submission-question/${trackId}`,
        })

    const scriptDeployWebsite = (conferenceId, trackId) =>
        get({
            endpoint: `/demos/deploy-website-to-local`,
            params: {
                conferenceId,
            },
        })

    return {
        usersScript,
        subjectAreaScript,
        conferenceSubmission,
        conference1stReviewAssign,
        conference1stReview,
        conference1stDecision,
        conference1stRevisionSubmission,
        conference2ndReview,
        conference2ndDecision,
        conferenceCameraReady,
        conferenceRegistration,
        conferencePresentation,
        scriptCreateTemplate,
        scriptCreateSubmissionQuestion,
        scriptDeployWebsite,
    }
}

export default useScript
