import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    steps: [],
    stepSelected: { trackId: '', currentStep: 0, guideLines: [] },
    isFinished: false,
    isLoading: true,
    isFirstLoading: true,
    openStep: false,
    guidelineGroup: '',
}

const TrackStepSlice = createSlice({
    name: 'trackSteps',
    initialState,
    reducers: {
        handleFinishStep: (state) => {
            state.isFinished = true
            state.guidelineGroup = ''
        },
        handleCurrentStep: (state, action) => {
            state.stepSelected = action.payload
        },
        handleGetSteps: (state, action) => {
            state.steps.push(action.payload.steps)
            state.stepSelected = action.payload.stepSelected
            state.guidelineGroup = action.payload.guidelineGroup
        },
        handleLoading: (state, action) => {
            state.isLoading = action.payload
        },
        handleFirstLoading: (state, action) => {
            state.isFirstLoading = action.payload
        },
        handleNextStep: (state) => {
            state.stepSelected.currentStep = state.stepSelected.currentStep + 1
        },
        handleUpdateSteps: (state, action) => {
            state.steps = action.payload
        },
        handleOpenStep: (state, action) => {
            state.openStep = action.payload
        },
        resetTrackSteps: () => initialState,
    },
})

export const {
    handleCurrentStep,
    handleFinishStep,
    handleGetSteps,
    handleLoading,
    handleFirstLoading,
    handleNextStep,
    handleUpdateSteps,
    resetTrackSteps,
    handleOpenStep,
} = TrackStepSlice.actions

export default TrackStepSlice.reducer
