import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    roleConference: { roleName: '', roleId: '' },
    rolesTrack: [],
    trackConference: { trackName: '', trackId: '' },
    tracksConference: [],
    conference: { conferenceId: '', conferenceName: '', conferenceFullName: '' },
    isSingleTracks: false,
    conferences: [],
    conferenceStatus: '',
    websiteLink: '',
}

const conferenceSlice = createSlice({
    name: 'conference',
    initialState,
    reducers: {
        switchConference: (state, action) => {
            state.conference = action.payload.conference
        },

        switchRole: (state, action) => {
            state.roleConference = action.payload.roleConference
        },

        switchTrack: (state, action) => {
            state.trackConference = action.payload.trackConference
        },

        getConference: (state, action) => {
            state.rolesTrack = action.payload.rolesTrack
            state.tracksConference = action.payload.tracksConference
            state.roleConference = action.payload.roleConference
            state.trackConference = action.payload.trackConference
            state.isSingleTracks = action.payload.isSingleTracks
            state.conferences = action.payload.conferences
            state.conference = action.payload.conference
            state.conferenceStatus = action.payload.conferenceStatus
        },
        chooseConference: (state, action) => {
            state.conference = action.payload.conference
        },
        resetConferenceRole: (state) => {
            state.roleConference.roleId = ''
            state.roleConference.roleName = ''
        },
        addTrack: (state, action) => {
            state.tracksConference.push(action.payload)
        },
        updateTrackName: (state, action) => {
            if (state.tracksConference.length > 0) {
                const position = state.tracksConference.findIndex((track) => track.id === action.payload.trackId)
                state.tracksConference[position].name = action.payload.trackName
                state.trackConference.trackName = action.payload.trackName
            }
        },
        updateConferenceState: (state, action) => {
            state.conferenceStatus = action.payload.conferenceStatus
            state.websiteLink = action.payload.websiteLink
        },

        reset: () => initialState,
    },
})

export const {
    switchRole,
    getConference,
    switchTrack,
    reset,
    chooseConference,
    switchConference,
    resetConferenceRole,
    addTrack,
    updateTrackName,
    updateConferenceState,
} = conferenceSlice.actions

export default conferenceSlice.reducer
