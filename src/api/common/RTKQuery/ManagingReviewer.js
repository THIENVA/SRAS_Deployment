import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const ManageReviewerApi = createApi({
    reducerPath: 'ManageReviewerApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['Reviewers'],
    endpoints: (build) => ({
        getReviewer: build.query({
            query: ({
                conferenceId,
                page,
                pageSize,
                globalFilter,
                Sorting,
                SortedAsc,
                trackId,
                IsReviewed,
                IsAssigned,
                IsAllReviewerAssignmentFinished,
            }) => ({
                url: trackId
                    ? `/reviewer-management/get-reviewer-console-in-conference-or-track?trackId=${trackId}`
                    : `/reviewer-management/get-reviewer-console-in-conference-or-track`,
                params: {
                    conferenceId,
                    SkipCount: page * pageSize,
                    MaxResultCount: pageSize,
                    InclusionText: globalFilter,
                    Sorting: Sorting,
                    SortedAsc: SortedAsc,
                    IsReviewed: IsReviewed,
                    IsAssigned: IsAssigned,
                    IsAllReviewerAssignmentFinished: IsAllReviewerAssignmentFinished,
                },
            }),
            providesTags: ['Reviewers'],
            keepUnusedDataFor: 15,
        }),
    }),
})

export const { useGetReviewerQuery } = ManageReviewerApi
