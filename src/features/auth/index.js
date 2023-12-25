import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    userId: null,
    token: null,
    email: null,
    role: '',
    exp: 0,
    country: '',
    organization: '',
    firstName: '',
    lastName: '',
    middleName: '',
    namePrefix: '',
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.email = action.payload.email
            state.role = action.payload.role
            state.exp = action.payload.exp
            state.userId = action.payload.userId
            state.token = action.payload.token
            state.country = action.payload.country
            state.organization = action.payload.organization
            state.firstName = action.payload.firstName
            state.lastName = action.payload.lastName
            state.middleName = action.payload.middleName
            state.namePrefix = action.payload.namePrefix
        },
        logout: () => initialState,
    },
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
