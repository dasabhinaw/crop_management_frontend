import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '@/api/authService'

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
    try {
        const response = await authService.login(credentials)
        return response
    } catch (error) {
        const data = error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        return rejectWithValue(data)
    }
})

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
    try {
        const response = await authService.logout()
        return response
    } catch (error) {
        const data = error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        return rejectWithValue(data)
    }
})

export const getUserInfo = createAsyncThunk('auth/userinfo', async (_, { rejectWithValue }) => {
    try {
        const response = await authService.userInfo()
        return response
    } catch (error) {
        const data = error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        return rejectWithValue(data)
    }
})

export const checkAuth = createAsyncThunk('auth/isLoggedIn', async (_, { rejectWithValue }) => {
    try {
        const response = await authService.checkAuth()
        return response
    } catch (error) {
        const data = error.response && error.response.data.detail
            ? error.response.data.detail
            : error.message
        return rejectWithValue(data)
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        is_loading: false,
        error: null,
        userInfo: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.error = null
                state.is_loading = true
            })
            .addCase(login.fulfilled, (state,action) => {
                state.is_loading = false
                const { user } = action.payload
                state.userInfo = user
            })
            .addCase(login.rejected, (state, action) => {
                state.is_loading = false
                state.error = action.payload
            })
            .addCase(logout.pending, (state) => {
                state.is_loading = true
            })
            .addCase(logout.fulfilled, (state) => {
                state.is_loading = false
                state.userInfo = null
            })
            .addCase(logout.rejected, (state, action) => {
                state.is_loading = false
                state.error = action.payload
            })
            .addCase(getUserInfo.pending, (state) => {
                state.is_loading = true
            })
            .addCase(getUserInfo.fulfilled, (state, action) => {
                state.is_loading = false
                state.userInfo = action.payload
            })
            .addCase(getUserInfo.rejected, (state, action) => {
                state.is_loading = false
                state.error = action.payload
            })
            .addCase(checkAuth.pending, (state) => {
                state.is_loading = true
            })
            .addCase(checkAuth.fulfilled, (state,action) => {
                const { user } = action.payload
                state.is_loading = false
                state.userInfo = user
            })
            .addCase(checkAuth.rejected, (state, action) => {
                state.is_loading = false
            })
    },
})

const getIsLoading = (state) => state.auth.is_loading
const getError = (state) => state.auth.error
const getUserInfoState = (state) => state.auth.userInfo

export {
    getIsLoading,
    getError,
    getUserInfoState,
}

export const { clearError } = authSlice.actions;
export default authSlice.reducer;