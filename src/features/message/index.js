import { v4 as uuid } from 'uuid'

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    messages: [],
    unique: uuid(),
}

const getMessageSlice = createSlice({
    name: 'get-messages',
    initialState,
    reducers: {
        getMessage: (state, action) => {
            state.messages = action.payload
        },
        syncMessage: (state, action) => {
            state.unique = action.payload
        },
        resetMessages: () => initialState,
    },
})

export const { getMessage, resetMessages, syncMessage } = getMessageSlice.actions

export default getMessageSlice.reducer
