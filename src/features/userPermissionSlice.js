import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import userPermissionService from '@/api/userPermissionService'

export const fetchUserPermission = createAsyncThunk(
    'user/permission',
    async (_, { rejectWithValue }) => {
        try {
            const response = await userPermissionService.userPermissionService()
            return response
        } catch (error) {
            const data =
                error.response && error.response.data.detail
                    ? error.response.data.detail
                    : error.message
            return rejectWithValue(data)
        }
    }
)

const userPermissionSlice = createSlice({
    name: 'userPermission',
    initialState: {
        is_loading: false,
        error: null,
        userPermission: {},
    },
    reducers: {
        resetUserPermission: (state) => {
            state.is_loading = false
            state.error = null
            state.userPermission = {}
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserPermission.pending, (state) => {
                state.error = null
                state.is_loading = true
            })
            .addCase(fetchUserPermission.fulfilled, (state, action) => {
                state.userPermission = action.payload
                state.is_loading = false
            })
            .addCase(fetchUserPermission.rejected, (state, action) => {
                state.error = action.payload || 'Something went wrong'
                state.is_loading = false
            })
    }
})

export const { resetUserPermission } = userPermissionSlice.actions
export default userPermissionSlice.reducer