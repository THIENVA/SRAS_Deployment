import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const TrackChairConsole = createApi({
    reducerPath: 'TrackChairConsole',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['Papers'],
    endpoints: (build) => ({
        getPapers: build.query({
            query: ({
                conferenceId,
                track,
                page,
                pageSize,
                globalFilter,
                IsToBeReviewedPapers,
                IsReviewerAssigned,
                IsReviewProcessComplete,
                NotifiedStatusId,
                IsRevisionSubmitted,
                IsRequestedForCameraReady,
                IsSortedByAverageScoreAsc,
                StatusId,
                IsFirstAttemptFinalDecided,
            }) =>
                track
                    ? `/submissions/aggregation?ConferenceId=${conferenceId}&TrackId=${track}&SkipCount=${
                          page * pageSize
                      }&MaxResultCount=${pageSize}&InclusionText=${globalFilter}&IsToBeReviewedPapers=${IsToBeReviewedPapers}&IsReviewerAssigned=${IsReviewerAssigned}&IsReviewProcessComplete=${IsReviewProcessComplete}&NotifiedStatusId=${NotifiedStatusId}&IsRevisionSubmitted=${IsRevisionSubmitted}&IsRequestedForCameraReady=${IsRequestedForCameraReady}&IsSortedByAverageScoreAsc=${IsSortedByAverageScoreAsc}&StatusId=${StatusId}&IsFirstAttemptFinalDecided=${IsFirstAttemptFinalDecided}`
                    : `/submissions/aggregation?ConferenceId=${conferenceId}&SkipCount=${
                          page * pageSize
                      }&MaxResultCount=${pageSize}&InclusionText=${globalFilter}&IsToBeReviewedPapers=${IsToBeReviewedPapers}&IsReviewerAssigned=${IsReviewerAssigned}&IsReviewProcessComplete=${IsReviewProcessComplete}&NotifiedStatusId=${NotifiedStatusId}&IsRevisionSubmitted=${IsRevisionSubmitted}&IsRequestedForCameraReady=${IsRequestedForCameraReady}&IsSortedByAverageScoreAsc=${IsSortedByAverageScoreAsc}&StatusId=${StatusId}&IsFirstAttemptFinalDecided=${IsFirstAttemptFinalDecided}`,
            providesTags: ['Papers'],
            keepUnusedDataFor: 15,
        }),
        editStatus: build.mutation({
            query: ({ paperId, paperStatusId, checklist }) => ({
                url: `/submissions/${paperId}/decision`,
                params: {
                    paperStatusId,
                },
                body: checklist,
                method: 'POST',
            }),
            invalidatesTags: ['Papers'],
        }),
        editRequestedCameraReady: build.mutation({
            query: ({ conferenceId, trackId, paperId, isCameraReadyRequested }) => ({
                url: `/conferences/${conferenceId}/camera-ready-bulk-request?trackId=${trackId}&submissionId=${paperId}&isRequested=${isCameraReadyRequested}`,
                method: 'GET',
            }),
        }),
        editAllRequestCameraReady: build.mutation({
            query: ({ conferenceId, trackId, isRequest }) => ({
                url: trackId
                    ? `/submissions/change-all-camera-ready-request?conferenceId=${conferenceId}&trackId=${trackId}&isRequest=${isRequest}`
                    : `/submissions/change-all-camera-ready-request?conferenceId=${conferenceId}&isRequest=${isRequest}`,
                method: 'GET',
            }),
            invalidatesTags: ['Papers'],
        }),
        bulkAllRequestCameraReady: build.mutation({
            query: ({ conferenceId, trackId, isRequest }) => ({
                url: trackId
                    ? `/conferences/${conferenceId}/camera-ready-bulk-request?trackId=${trackId}&isRequested=${isRequest}`
                    : `/conferences/${conferenceId}/camera-ready-bulk-request?isRequested=${isRequest}`,
                method: 'GET',
            }),
            invalidatesTags: ['Papers'],
        }),
        editReviewerAssignment: build.mutation({
            query: ({ paperId, data }) => ({
                url: `/submissions/${paperId}/reviewer-assignment-v2`,
                body: data,
                method: 'POST',
            }),
            invalidatesTags: ['Papers'],
        }),
    }),
})

export const {
    useGetPapersQuery,
    useEditStatusMutation,
    useEditRequestedCameraReadyMutation,
    useEditAllRequestCameraReadyMutation,
    useBulkAllRequestCameraReadyMutation,
    useEditReviewerAssignmentMutation,
} = TrackChairConsole
