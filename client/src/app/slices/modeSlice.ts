import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type initialStateType ={
    mode :string
}
const initialState :initialStateType = {
    mode:"dark",
}
const modeSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        toggleMode : (state,action:PayloadAction<initialStateType>)=>{
            state.mode = action.payload.mode
        },
    }
})
export const {toggleMode}  = modeSlice.actions;
export default modeSlice.reducer;