import { get } from '~/utils/ApiCaller'

const useScriptV2 = () => {
    const subjectAreaScript = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/conference-subject-areas-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const programCommittees = (conferenceId, trackId, amount = null) =>
        get({
            endpoint: '/demos/with-message/conference-program-committee-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const reviewersScript = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/conference-reviewers-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conferenceSubmission = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/conference-submissions-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const deskReject = (conferenceId, trackId, amount = null) =>
        get({
            endpoint: '/demos/with-message/conference-desk-rejection-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conference1stReviewAssign = (conferenceId, trackId, amountOfPapers = null) =>
        get({
            endpoint: '/demos/with-message/conference-1st-review-assignment-allocation',
            params: {
                conferenceId,
                trackId,
                amountOfPapers,
            },
        })

    // const conference1stReview = (conferenceId, trackId, amount) =>
    //     get({
    //         endpoint: '/demos/with-message/conference-1st-review-allocation',
    //         params: {
    //             conferenceId,
    //             trackId,
    //             amount,
    //         },
    //     })

    // const conference1stDecision = (conferenceId, trackId, amount) =>
    //     get({
    //         endpoint: '/demos/with-message/conference-1st-decision-allocation',
    //         params: {
    //             conferenceId,
    //             trackId,
    //             amount,
    //         },
    //     })

    const conference1stReview = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/demo-conference-1st-review-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conference1stDecision = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/demo-conference-1st-decision-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conference1stRevisionSubmission = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/conference-1st-revision-submission-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conference2ndReview = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/conference-2nd-review-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conference2ndDecision = (conferenceId, trackId, amount) =>
        get({
            endpoint: '/demos/with-message/conference-2nd-decision-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conferenceCameraReady = (conferenceId, trackId, amount = null) =>
        get({
            endpoint: '/demos/with-message/conference-camera-ready-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conferenceRegistration = (conferenceId, trackId, amount = null) =>
        get({
            endpoint: '/demos/with-message/conference-registration-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const conferencePresentation = (conferenceId, trackId, amount = null) =>
        get({
            endpoint: '/demos/with-message/conference-presentation-allocation',
            params: {
                conferenceId,
                trackId,
                amount,
            },
        })

    const scriptCreateTemplate = (conferenceId, _, amount = null) =>
        get({
            endpoint: '/email-templates/create-demo-email-template',
            params: {
                conferenceId,
                amount,
            },
        })

    const scriptCreateSubmissionQuestion = (_, trackId, amount = 2) =>
        get({
            endpoint: `/tracks/create-demo-submission-question/${trackId}/${amount}`,
            params: {
                amount,
            },
        })

    const scriptDeployWebsite = (conferenceId, _, amount = null) =>
        get({
            endpoint: `/demos/deploy-website-to-local`,
            params: {
                conferenceId,
                amount,
            },
        })

    return {
        subjectAreaScript,
        programCommittees,
        reviewersScript,
        conferenceSubmission,
        deskReject,
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

export default useScriptV2
