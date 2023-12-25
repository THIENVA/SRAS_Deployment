import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const ReviewerConsole = createApi({
    reducerPath: 'ReviewerConsole',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['ReviewerPapers'],
    endpoints: (build) => ({
        getPapers: build.query({
            query: ({
                conferenceId,
                userId,
                page,
                pageSize,
                globalFilter,
                Sorting,
                SortedAsc,
                trackId,
                IsReviewed,
                isChairViewing,
            }) => ({
                url: '/reviewer-management/aggregation',
                params: {
                    accountId: userId,
                    conferenceId,
                    trackId,
                    SkipCount: page * pageSize,
                    MaxResultCount: pageSize,
                    InclusionText: globalFilter,
                    Sorting: Sorting,
                    SortedAsc: SortedAsc,
                    IsReviewed,
                    isChairViewing,
                },
            }),
            providesTags: ['ReviewerPapers'],
            keepUnusedDataFor: 15,
        }),
    }),
})

export const { useGetPapersQuery } = ReviewerConsole
