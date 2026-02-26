import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    active : false,
}

const successAnimationSlice = createSlice({
    name:"successAnimation",
    initialState,
    reducers:{
        setActive : (state,action) =>{
            state.active = action.payload
        }
    }
})

export const { setActive } = successAnimationSlice.actions;

export const getSuccessActive = (state) => state.successAnimation.active;

export default successAnimationSlice.reducer;