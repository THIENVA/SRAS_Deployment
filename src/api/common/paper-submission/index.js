import { get, post, put, remove } from '~/utils/ApiCaller'

const usePaperSubmission = () => {
    const createPaperSubmission = (paper) => post({ endpoint: '/submissions', body: paper })

    const createFilesForPaper = (paperId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${paperId}/submission-files`,
            body: files,
        })

    const editSubmissionConflict = (paperId, conflictReviewer) =>
        post({
            endpoint: `/submissions/${paperId}/conflicts`,
            body: conflictReviewer,
        })

    const getSubmissionConflict = (paperId, params, signal) =>
        get({
            endpoint: `/submissions/${paperId}/conflicts`,
            params: params,
            signal,
        })

    const getAggregation = (conferenceId, trackId, sorting = null, skipCount, maxResultCount, signal) =>
        get({
            endpoint: '/submissions/aggregation',
            params: {
                ConferenceId: conferenceId,
                TrackId: trackId,
                Sorting: sorting,
                SkipCount: skipCount,
                MaxResultCount: maxResultCount,
            },
            signal,
        })

    const editDecision = (submissionId, paperStatusId) =>
        post({
            endpoint: `/submissions/${submissionId}/decision`,
            params: {
                paperStatusId: paperStatusId,
            },
        })

    const getReviewerAssignment = (submissionId, params, signal) =>
        get({
            endpoint: `/submissions/${submissionId}/reviewer-assignment`,
            params: params,
            signal,
        })

    const editReviewerAssignment = (submissionId, reviewerId, isAssigned) =>
        post({
            endpoint: `/submissions/${submissionId}/reviewer-assignment`,
            params: {
                reviewerId: reviewerId,
                isAssigned: isAssigned,
            },
        })

    const editReviewerAssignmentV2 = (submissionId, data) =>
        post({
            endpoint: `/submissions/${submissionId}/reviewer-assignment-v2`,
            body: data,
        })

    const getConflictCase = (signal, trackId = null) =>
        get({
            endpoint: '/conflictcases',
            params: {
                trackId: trackId,
            },
            signal,
        })

    const getNumberOfSubmission = (conferenceId, signal, trackId = null) =>
        get({
            endpoint: `/conferences/numOfSubmission/${conferenceId}`,
            params: {
                trackId,
            },
            signal,
        })

    const reviewConflicts = (paperInfo) => post({ endpoint: '/reviewer-conflicts', body: paperInfo })

    const getNumberSubmissionWithStatus = (statuses) =>
        post({ endpoint: `/submissions/get-number-submissions-and-email-by-status`, body: statuses })

    const getEmailsSent = (statuses) =>
        post({ endpoint: '/email-templates/emails-to-sent-each-status', body: statuses })

    const getPaperStatuses = (conferenceId, signal) =>
        get({
            endpoint: `/paper-statuses`,
            params: {
                conferenceId: conferenceId,
            },
            signal,
        })

    const createCameraReadySubmissionFiles = (submissionId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${submissionId}/camera-ready-files`,
            body: files,
        })

    const createCameraReady = (submissionId, body) =>
        post({
            endpoint: `/submissions/${submissionId}/camera-ready`,
            body: body,
        })

    const updateCameraReady = (submissionId, body) =>
        put({
            endpoint: `/submissions/${submissionId}/camera-ready`,
            body: body,
        })

    const deleteCameraReady = (submissionId) =>
        remove({
            endpoint: `/submissions/${submissionId}/camera-ready`,
        })

    const deleteSubmission = (submissionId) => remove({ endpoint: `/submissions/${submissionId}` })

    const getReviewerAggregation = (accountId, conferenceId, skipCount, maxResultCount, signal) =>
        get({
            endpoint: `/reviewer-management/aggregation`,
            params: {
                accountId: accountId,
                conferenceId: conferenceId,
                SkipCount: skipCount,
                MaxResultCount: maxResultCount,
            },
            signal,
        })

    const getAuthorAggregation = (accountId, conferenceId, skipCount, maxResultCount, signal) =>
        get({
            endpoint: `/author-management/aggregation`,
            params: {
                accountId: accountId,
                conferenceId: conferenceId,
                SkipCount: skipCount,
                MaxResultCount: maxResultCount,
            },
            signal,
        })

    const getSubmissionInfo = (submissionId, signal) =>
        get({
            endpoint: `/submissions/${submissionId}/selected-brief-info`,
            signal,
        })

    const getSubmissionSummary = (submissionId, signal) =>
        get({
            endpoint: `/submissions/${submissionId}/submission-summary`,
            signal,
        })

    const getSubmissionQuestions = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/submission-questions`,
            signal,
        })

    const createSubmissionQuestions = (trackId, questions) =>
        post({ endpoint: `/tracks/${trackId}/submission-questions`, body: questions })

    const updatePaperSubmission = (id, paper) => put({ endpoint: `/submissions/${id}`, body: paper })

    const changeAllCameraReadyRequest = (conferenceId, trackId, isRequest) =>
        get({
            endpoint: '/submissions/change-all-camera-ready-request',
            params: {
                trackId,
                conferenceId,
                isRequest,
            },
        })

    const getCopyRightFiles = (submissionId, signal) =>
        get({ endpoint: `/submissions/${submissionId}/download-copy-right-file`, signal })

    const getReview = (submissionId, signal) => get({ endpoint: `/submissions/${submissionId}/reviews`, signal })

    const getReviewReviewers = (submissionId, reviewAssignmentId, signal) =>
        get({
            endpoint: `/reviewer-management/reviews`,
            params: {
                submissionId,
                reviewAssignmentId: reviewAssignmentId,
            },
            signal,
        })

    const getAuthorReviewers = (submissionId, signal) =>
        get({
            endpoint: `/author-management/reviews`,
            params: {
                submissionId,
            },
            signal,
        })

    const getManuscript = (params, signal) =>
        get({
            endpoint: `/submissions/conference-manuscripts-aggregation`,
            params: params,
            signal,
        })

    const createPresenters = (submissionId, presenterIds) =>
        post({ endpoint: `/submissions/${submissionId}/presenters`, body: presenterIds })

    const getSubmissionInfoSupport = (submissionId, signal) =>
        get({
            endpoint: `/submissions/get-submission-info-support-chair-desicion`,
            params: {
                submissionId: submissionId,
            },
            signal,
        })

    const getTrackNameById = (trackId, signal) =>
        get({
            endpoint: `/tracks/get-track-name`,
            params: {
                trackId: trackId,
            },
            signal,
        })

    const uploadSupplementary = (submissionId, files) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/submissions/${submissionId}/supplementary-material-files`,
            body: files,
        })

    const getCurrentStatus = (submissionId, signal) =>
        get({
            endpoint: `/submissions/${submissionId}/current-status`,
            signal,
        })

    const getTotalNumberOfReviewer = (submissionId, signal) =>
        get({ endpoint: `/submissions/${submissionId}/reviewer-assignment-suggestion-statistics`, signal })

    return {
        createPaperSubmission,
        createFilesForPaper,
        editSubmissionConflict,
        getSubmissionConflict,
        getAggregation,
        editDecision,
        getReviewerAssignment,
        editReviewerAssignment,
        getConflictCase,
        getNumberOfSubmission,
        reviewConflicts,
        getNumberSubmissionWithStatus,
        getEmailsSent,
        getPaperStatuses,
        createCameraReadySubmissionFiles,
        getReviewerAggregation,
        getAuthorAggregation,
        getSubmissionInfo,
        getSubmissionSummary,
        getSubmissionQuestions,
        createSubmissionQuestions,
        updatePaperSubmission,
        createCameraReady,
        updateCameraReady,
        deleteCameraReady,
        editReviewerAssignmentV2,
        changeAllCameraReadyRequest,
        getCopyRightFiles,
        getReview,
        getManuscript,
        createPresenters,
        getReviewReviewers,
        getAuthorReviewers,
        getSubmissionInfoSupport,
        getTrackNameById,
        uploadSupplementary,
        deleteSubmission,
        getCurrentStatus,
        getTotalNumberOfReviewer,
    }
}

export { usePaperSubmission }
