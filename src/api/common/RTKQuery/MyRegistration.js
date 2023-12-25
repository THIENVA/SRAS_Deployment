import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const MyRegistration = createApi({
    reducerPath: 'MyRegistration',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['Registration'],
    endpoints: (build) => ({
        getRegistration: build.query({
            query: ({
                aggregationType,
                InclusionText,
                conferenceId,
                trackId,
                accountId,
                skipCount,
                maxResultCount,
            }) => ({
                url: trackId
                    ? `/submissions/author-conference-manuscripts-aggregation?trackId=${trackId}`
                    : `/submissions/author-conference-manuscripts-aggregation`,
                params: {
                    aggregationType,
                    InclusionText,
                    conferenceId,
                    accountId,
                    skipCount,
                    maxResultCount,
                },
            }),
            providesTags: ['Registration'],
            keepUnusedDataFor: 15,
        }),
    }),
})

export const { useGetRegistrationQuery } = MyRegistration
