import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    trackName: '',
    trackId: '',
    tracks: [],
    isFirstLoading: true,
    submittableTracks: [],
}

const trackForChairSlice = createSlice({
    name: 'track-for-chair',
    initialState,
    reducers: {
        trackChange: (state, action) => {
            state.trackId = action.payload.id
            state.trackName = action.payload.name
        },
        getTracks: (state, action) => {
            state.tracks = action.payload.tracks
            state.isFirstLoading = action.payload.isFirstLoading
        },
        resetFirstLoading: (state) => {
            state.isFirstLoading = true
        },
        addTrackForChair: (state, action) => {
            state.tracks.push(action.payload)
        },
        updateTrackForChair: (state, action) => {
            const position = state.tracks.findIndex((track) => track.id === action.payload.trackId)
            state.tracks[position].name = action.payload.trackName
            state.trackName = action.payload.trackName
        },
        getSubmittableTracks: (state, action) => {
            state.submittableTracks = action.payload
        },
        reset: () => initialState,
    },
})

export const {
    trackChange,
    reset,
    getTracks,
    resetFirstLoading,
    addTrackForChair,
    updateTrackForChair,
    getSubmittableTracks,
} = trackForChairSlice.actions

export default trackForChairSlice.reducer
