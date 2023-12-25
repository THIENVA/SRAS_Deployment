import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { APP_API_URL } from '~/config'

export const ManageUserApi = createApi({
    reducerPath: 'ManageUserApi',
    baseQuery: fetchBaseQuery({ baseUrl: `${APP_API_URL}` }),
    tagTypes: ['Users'],
    endpoints: (build) => ({
        getUser: build.query({
            query: ({ conferenceId, track, page, pageSize, globalFilter, Sorting, SortedAsc }) =>
                track
                    ? `/conferences/${conferenceId}/users?TrackId=${track}&SkipCount=${
                          page * pageSize
                      }&MaxResultCount=${pageSize}&InclusionText=${globalFilter}&Sorting=${Sorting}&SortedAsc=${SortedAsc}`
                    : `/conferences/${conferenceId}/users?SkipCount=${
                          page * pageSize
                      }&MaxResultCount=${pageSize}&InclusionText=${globalFilter}&Sorting=${Sorting}&SortedAsc=${SortedAsc}`,
            providesTags: ['Users'],
            keepUnusedDataFor: 15,
        }),
        addUser: build.mutation({
            query: (body) => ({
                url: `/conference-user-roles`,
                method: 'POST',
                body,
            }),
            invalidatesTags: ['Users'],
        }),
    }),
})

export const { useGetUserQuery, useAddUserMutation } = ManageUserApi
