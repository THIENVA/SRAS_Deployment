import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const AuthorConsole = createApi({
    reducerPath: 'AuthorConsole',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['AuthorPapers'],
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
                StatusId,
                IsRequestedForCameraReady,
                IsRequestedForPresentation,
            }) => ({
                url: '/author-management/aggregation',
                params: {
                    accountId: userId,
                    conferenceId,
                    SkipCount: page * pageSize,
                    MaxResultCount: pageSize,
                    InclusionText: globalFilter,
                    Sorting: Sorting,
                    SortedAsc: SortedAsc,
                    StatusId: StatusId,
                    IsRequestedForCameraReady: IsRequestedForCameraReady,
                    IsRequestedForPresentation: IsRequestedForPresentation,
                },
            }),
            providesTags: ['AuthorPapers'],
            keepUnusedDataFor: 15,
        }),
    }),
})

export const { useGetPapersQuery } = AuthorConsole
