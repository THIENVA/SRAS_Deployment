import { get, patch, post } from '~/utils/ApiCaller'

const useTrack = () => {
    const createTrack = (conferenceId, trackId) =>
        post({
            endpoint: `/tracks/${conferenceId}/${trackId}`,
        })

    const getAllTrack = (conferenceId, signal) =>
        get({
            endpoint: `/tracks/${conferenceId}`,
            signal,
        })
    const getSubjectAreasRelevance = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/subject-area-relevance`,
            signal,
        })

    const createSubjectAreasRelevance = (trackId, info) =>
        post({
            endpoint: `/tracks/${trackId}/subject-area-relevance`,
            body: info,
        })

    const getTracksRolesRelevant = (userId, conferenceId, signal) =>
        get({ endpoint: `/tracks/get-tracks-and-roles-of-track-chair-user/${userId}/${conferenceId}`, signal })

    const postConflictSettings = (trackId, conflictSettings) =>
        post({
            endpoint: `/tracks/${trackId}/conflict-settings`,
            body: { settings: conflictSettings },
        })

    const getConflictSettings = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/conflict-settings`,
            signal,
        })

    const postSubmissionSettings = (trackId, submissionSettings, submissionInstruction) =>
        post({
            endpoint: `/tracks/${trackId}/submission-settings`,
            params: { submissionInstruction: submissionInstruction },
            body: { settings: submissionSettings },
        })

    const getSubmissionSettings = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/submission-settings`,
            signal,
        })

    const getInstructionSettings = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/submission-instruction`,
            signal,
        })

    const getGuideline = (trackId, isForChair, signal) =>
        get({
            endpoint: `/tracks/${trackId}/guidelines`,
            params: {
                isForChair: isForChair,
            },
            signal,
        })

    const finishStep = (trackId, activityDeadlineId, guidelineName, isFinished) =>
        post({
            endpoint: `/tracks/${trackId}/guidelines/completion`,
            params: {
                activityDeadlineId,
                guidelineName,
                isFinished,
            },
        })

    const postTrackPlan = (trackId, numberOfRevisions) =>
        get({
            endpoint: `/tracks/${trackId}/track-plan-with-number-of-revisions`,
            params: {
                numberOfRevisions: numberOfRevisions,
            },
        })

    const getTrackPlan = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/track-plan`,
            signal,
        })

    const checkTrackPlan = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/number-of-revisions`,
            signal,
        })

    const updateTrackPlan = (trackId, info) =>
        post({
            endpoint: `/tracks/${trackId}/track-plan`,
            body: info,
        })

    const getActivityTimeline = (trackId, signal) =>
        get({
            endpoint: `/tracks/${trackId}/activity-timeline`,
            signal,
        })

    const postActivityCompletion = (trackId, activityDeadlineId) =>
        post({
            endpoint: `/tracks/${trackId}/activity-timeline/completion`,
            params: {
                activityDeadlineId: activityDeadlineId,
            },
        })

    const postActivityExtension = (trackId, info) =>
        post({
            endpoint: `/tracks/${trackId}/activity-timeline/extension`,
            body: info,
        })

    const updateTrack = ({ trackName, conferenceId, trackId }) =>
        patch({
            endpoint: '/tracks/update-track-name',
            params: {
                trackName,
                conferenceId,
                trackId,
            },
        })

    const getDecisionCheckList = (trackId, signal) => get({ endpoint: `/tracks/${trackId}/decision-checklist`, signal })

    const updateDecisionCheckList = (trackId, questions) =>
        post({ endpoint: `/tracks/${trackId}/decision-checklist`, body: questions })

    const getCameraReadyChecklist = (submissionId, signal) =>
        get({
            endpoint: `/submissions/get-camera-ready-checklist`,
            params: {
                submissionId,
            },
            signal,
        })

    const getSubmittableTrack = (conferenceId, signal) =>
        get({ endpoint: `/conferences/${conferenceId}/submittable-tracks`, signal })

    const getDecisionCriteriaSetting = (trackId, signal) =>
        get({ endpoint: `/tracks/get-decision-checklist-by-trackId/${trackId}`, signal })

    const updateDecisionCriteriaSetting = (trackId, data) =>
        post({
            endpoint: `/tracks/update-decision-checklist-of-track`,
            body: data,
            params: {
                trackId,
            },
        })

    const uploadReviewTemplate = (trackId, file) =>
        post({
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            endpoint: `/tracks/upload-review-template-by-track/${trackId}`,
            body: file,
        })

    const updateReviewCriteriaSetting = (trackId, criteria) =>
        post({
            endpoint: `/tracks/update-review-setting-of-track`,
            params: {
                trackId,
            },
            body: criteria,
        })

    const getReviewCriteriaSetting = (trackId, signal) =>
        get({ endpoint: `/tracks/get-review-setting-of-track/${trackId}`, signal })

    const getDecisionChecklist = (trackId, signal) =>
        get({ endpoint: `/tracks/get-decision-checklist-by-trackId/${trackId}`, signal })

    const getReviewSetting = (trackId, signal) =>
        get({ endpoint: `/tracks/get-review-setting-of-trackId/${trackId}`, signal })

    const getMessageBasedOnRole = (conferenceId, trackId, conferenceRoleId, accountId, signal) =>
        get({
            endpoint: '/conference-user-roles/messages',
            params: {
                conferenceId,
                trackId,
                conferenceRoleId,
                accountId,
            },
            signal,
        })

    const getCameraReadySetting = (trackId, signal) =>
        get({
            endpoint: '/tracks/get-camera-ready-setting-of-track',
            params: {
                trackId,
            },
            signal,
        })

    const getPresentationSetting = (trackId, signal) =>
        get({
            endpoint: '/tracks/get-presentation-setting-of-track',
            params: {
                trackId,
            },
            signal,
        })

    const updateCameraReadySetting = (trackId, data) =>
        patch({
            endpoint: '/tracks/update-camera-ready-setting-of-track',
            body: data,
            params: {
                trackId,
            },
        })

    const updatePresentationSetting = (trackId, data) =>
        patch({
            endpoint: '/tracks/update-presentation-setting-of-track',
            body: data,
            params: {
                trackId,
            },
        })

    return {
        createTrack,
        getAllTrack,
        getSubjectAreasRelevance,
        createSubjectAreasRelevance,
        getTracksRolesRelevant,
        postConflictSettings,
        getConflictSettings,
        postSubmissionSettings,
        getSubmissionSettings,
        getInstructionSettings,
        getGuideline,
        postTrackPlan,
        getTrackPlan,
        updateTrackPlan,
        getActivityTimeline,
        postActivityCompletion,
        postActivityExtension,
        checkTrackPlan,
        updateTrack,
        getDecisionCheckList,
        updateDecisionCheckList,
        getCameraReadyChecklist,
        getSubmittableTrack,
        getDecisionCriteriaSetting,
        updateDecisionCriteriaSetting,
        uploadReviewTemplate,
        updateReviewCriteriaSetting,
        getReviewCriteriaSetting,
        getReviewSetting,
        getDecisionChecklist,
        finishStep,
        getMessageBasedOnRole,
        getCameraReadySetting,
        getPresentationSetting,
        updateCameraReadySetting,
        updatePresentationSetting,
    }
}

export { useTrack }
