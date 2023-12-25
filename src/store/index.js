import { configureStore } from '@reduxjs/toolkit'
import { AuthorConsole } from '~/api/common/RTKQuery/AuthorConsole'
import { ManageReviewerApi } from '~/api/common/RTKQuery/ManagingReviewer'
import { ManageUserApi } from '~/api/common/RTKQuery/ManagingUser'
import { ManuScriptConsole } from '~/api/common/RTKQuery/ManuScriptConsole'
import { MyRegistration } from '~/api/common/RTKQuery/MyRegistration'
import { ReviewerConsole } from '~/api/common/RTKQuery/ReviewerConsole'
import { TrackChairConsole } from '~/api/common/RTKQuery/TrackChairConsole'
import AuthReducer from '~/features/auth'
import ConferenceReducer from '~/features/conference'
import GuideLinesReducer from '~/features/guidelines'
import MessageReducer from '~/features/message'
import TrackForChairReducer from '~/features/track-for-chair'
import TrackStepSliceReducer from '~/features/track-steps'

export const store = configureStore({
    reducer: {
        auth: AuthReducer,
        conference: ConferenceReducer,
        trackForChair: TrackForChairReducer,
        trackSteps: TrackStepSliceReducer,
        guidelines: GuideLinesReducer,
        messages: MessageReducer,
        [ManageUserApi.reducerPath]: ManageUserApi.reducer,
        [ManageReviewerApi.reducerPath]: ManageReviewerApi.reducer,
        [TrackChairConsole.reducerPath]: TrackChairConsole.reducer,
        [ReviewerConsole.reducerPath]: ReviewerConsole.reducer,
        [AuthorConsole.reducerPath]: AuthorConsole.reducer,
        [ManuScriptConsole.reducerPath]: ManuScriptConsole.reducer,
        [MyRegistration.reducerPath]: MyRegistration.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            ManageUserApi.middleware,
            ManageReviewerApi.middleware,
            TrackChairConsole.middleware,
            ReviewerConsole.middleware,
            AuthorConsole.middleware,
            ManuScriptConsole.middleware,
            MyRegistration.middleware,
        ]),
})
