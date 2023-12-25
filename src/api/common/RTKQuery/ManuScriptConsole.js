import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const ManuScriptConsole = createApi({
    reducerPath: 'ManuScriptConsole',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['ManuScript'],
    endpoints: (build) => ({
        getManuScript: build.query({
            query: ({ aggregationType, InclusionText, conferenceId, trackId, skipCount, maxResultCount }) => ({
                url: trackId
                    ? `/submissions/conference-manuscripts-aggregation?trackId=${trackId}`
                    : `/submissions/conference-manuscripts-aggregation`,
                params: {
                    aggregationType,
                    InclusionText,
                    conferenceId,
                    skipCount,
                    maxResultCount,
                },
            }),
            providesTags: ['ManuScript'],
            keepUnusedDataFor: 15,
        }),
        editRequestedPresentation: build.mutation({
            query: ({ conferenceId, trackId, paperId, isCameraReadyRequested }) => ({
                url: `/conferences/${conferenceId}/presentation-bulk-request?trackId=${trackId}&submissionId=${paperId}&isRequested=${isCameraReadyRequested}`,
                method: 'GET',
            }),
        }),
        bulkAllRequestPresentation: build.mutation({
            query: ({ conferenceId, trackId, isRequest }) => ({
                url: trackId
                    ? `/conferences/${conferenceId}/presentation-bulk-request?trackId=${trackId}&isRequested=${isRequest}`
                    : `/conferences/${conferenceId}/presentation-bulk-request?isRequested=${isRequest}`,
                method: 'GET',
            }),
            invalidatesTags: ['ManuScript'],
        }),
    }),
})

export const { useGetManuScriptQuery, useEditRequestedPresentationMutation, useBulkAllRequestPresentationMutation } =
    ManuScriptConsole
