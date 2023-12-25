const { createSlice } = require('@reduxjs/toolkit')

const initialState = {
    steps: [],
    stepSelected: {
        trackId: '',
        guidelines: [],
        guideLineSelected: {
            name: '',
            description: '',
            guidelineGroup: '',
            isChairOnly: false,
            route: '',
            factor: 1,
            consoleUIColumns: '',
            consoleFigures: '',
            isFinishedMarkingGuideline: '',
            isFinished: '',
        },
        currentStep: 0,
        guidelineGroup: '',
        isCurrentPhase: true,
        activityDeadlineId: '',
        guidelineGroupFactor: 1,
        revisionNo: null,
    },
    factorIsCurrent: -1,
    isLoading: true,
    isFirstLoading: true,
    openStep: false,
}

const guidelinesSlice = createSlice({
    name: 'guidelinesSlice',
    initialState,
    reducers: {
        handleLoading: (state, action) => {
            state.isLoading = action.payload
        },
        handleFirstLoading: (state, action) => {
            state.isFirstLoading = action.payload
        },
        handleGetSteps: (state, action) => {
            state.steps = action.payload.steps
            state.stepSelected = action.payload.stepSelected
        },
        handleGetGuideLine: (state, action) => {
            state.stepSelected.guideLineSelected = action.payload
        },
        handleChangeGuideLineGroup: (state, action) => {
            state.stepSelected = action.payload
        },
        handleCurrentStep: (state, action) => {
            state.stepSelected.currentStep = action.payload
        },
        handleOpenStep: (state, action) => {
            state.openStep = action.payload
        },
        handleCompleteStepGuideline: (state, action) => {
            state.stepSelected.guidelines = action.payload
        },
        handleFactorIsCurrent: (state, action) => {
            state.factorIsCurrent = action.payload
        },
        handleUpdateSteps: (state, action) => {
            state.steps = action.payload
        },
        resetStepWhenTrackChange: (state) => {
            state.steps = []
            state.stepSelected = {
                trackId: '',
                guidelines: [],
                guideLineSelected: {
                    name: '',
                    description: '',
                    guidelineGroup: '',
                    isChairOnly: false,
                    route: '',
                    factor: 1,
                    consoleUIColumns: '',
                    consoleFigures: '',
                    isFinishedMarkingGuideline: '',
                    isFinished: '',
                },
                currentStep: 0,
                guidelineGroup: '',
                isCurrentPhase: true,
                activityDeadlineId: '',
                guidelineGroupFactor: 1,
                revisionNo: null,
            }
            state.factorIsCurrent = -1
        },
        resetTrackSteps: () => initialState,
    },
})

export const {
    handleLoading,
    handleFirstLoading,
    handleGetSteps,
    handleGetGuideLine,
    handleChangeGuideLineGroup,
    handleCurrentStep,
    resetTrackSteps,
    handleOpenStep,
    handleCompleteStepGuideline,
    handleFactorIsCurrent,
    handleUpdateSteps,
    resetStepWhenTrackChange,
} = guidelinesSlice.actions

export default guidelinesSlice.reducer
